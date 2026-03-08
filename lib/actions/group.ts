"use server";

import { db } from "../db/db";
import cloudinary from "../cloudinary";
import { uploaderOptions } from "../constants";
import { transactionTableIncludeQuery } from "../constants/queries";
import { CreateGroupSchema, type createGroupSchemaType } from "../schemas/group";
import { getFilteredGroupDetails, getStatusTextForGroup } from "../utils";
import { Entry, getMinCashFlow } from "../algorithms/MinCashFlow";
import { withAuth, type ActionResult } from "../utils";

async function uploadGroupImage(image: string) {
  const { public_id: publicId, secure_url: url } = await cloudinary.uploader.upload(
    image,
    uploaderOptions
  );
  return { publicId, url };
}

/**
 * Computes the net balance per user across all transactions in the group,
 * persists it, and rebuilds the minimum-cash-flow settlement graph.
 */
async function rebuildGroupBalances(groupId: string): Promise<void> {
  const group = await db.group.findUnique({
    where: { id: groupId },
    include: {
      transactions: {
        include: {
          contributors: { select: { amount: true, user: { select: { id: true } } } },
          recipients:   { select: { amount: true, user: { select: { id: true } } } },
        },
      },
    },
  });

  if (!group) throw new Error(`Group ${groupId} not found`);

  // Aggregate net balance per member
  const balance: Record<string, number> = {};

  for (const { contributors, recipients } of group.transactions) {
    for (const { user, amount } of contributors) {
      balance[user.id] = (balance[user.id] ?? 0) + amount;
    }
    for (const { user, amount } of recipients) {
      balance[user.id] = (balance[user.id] ?? 0) - amount;
    }
  }

  // Persist member balances + rebuild settlement graph in a single transaction
  // so we never leave the DB in a partially-updated state.
  await db.$transaction(async (tx) => {
    await Promise.all(
      Object.entries(balance).map(([userId, bal]) =>
        tx.groupMember.update({
          where: { userId_groupId: { groupId, userId } },
          data: { balance: bal },
        })
      )
    );

    await tx.userGroupBalance.deleteMany({ where: { groupId } });

    const netAmountData: Entry[] = Object.entries(balance).map(([key, amount]) => ({
      key,
      amount,
    }));

    const settlements = getMinCashFlow(netAmountData).filter(({ amount }) => amount !== 0);

    await Promise.all(
      settlements.map(({ from, to, amount }) =>
        tx.userGroupBalance.create({
          data: { fromUserId: from, toUserId: to, groupId, amount },
        })
      )
    );
  });
}

export const createGroup = withAuth(
  async (userId, _session, values: createGroupSchemaType): Promise<ActionResult<{ groupId: string }>> => {
    const parsed = CreateGroupSchema.safeParse(values);
    if (!parsed.success) {
      return { error: "Invalid fields: " + parsed.error.flatten().formErrors.join(", ") };
    }

    const { name, image } = parsed.data;
    const imageData = image ? await uploadGroupImage(image) : null;

    const group = await db.group.create({
      data: {
        name,
        members: { create: { userId } },
        image: imageData ? { create: imageData } : undefined,
      },
    });

    return { data: { groupId: group.id } };
  }
);

export const getAllGroups = withAuth(
  async (userId): Promise<ActionResult<GroupSummary[]>> => {
    const groups = await db.group.findMany({
      where: { members: { some: { userId } } },
      select: {
        id: true,
        name: true,
        image: true,
        members: { select: { userId: true, balance: true } },
        _count: { select: { members: true } },
      },
    });

    const data: GroupSummary[] = groups.map(
      ({ id, name, image, members, _count: { members: membersCount } }) => {
        const balance = members.find((m) => m.userId === userId)?.balance ?? 0;
        return { id, name, image, status: getStatusTextForGroup(balance), membersCount };
      }
    );

    return { data };
  }
);

export const getAllGroupTitles = withAuth(
  async (userId): Promise<ActionResult<GroupTitle[]>> => {
    const groups = await db.group.findMany({
      select: { id: true, name: true },
      where: { members: { some: { userId } } },
    });

    return { data: groups };
  }
);

export const getGroupDetails = withAuth(
  async (userId, _session, groupId: string) => {
    const group = await db.group.findUnique({
      where: {
        id: groupId,
        members: { some: { userId } },
      },
      select: {
        name: true,
        image: { select: { url: true } },
        transactions: {
          include: transactionTableIncludeQuery,
          orderBy: { createdAt: "desc" },
        },
        members: {
          select: {
            balance: true,
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                image: { select: { url: true } },
              },
            },
          },
        },
        userGroupBalance: {
          select: { amount: true, fromUserId: true, toUserId: true },
          where: { OR: [{ fromUserId: userId }, { toUserId: userId }] },
        },
      },
    });

    if (!group) return { error: "Group not found" };

    return { data: getFilteredGroupDetails(group, userId) };
  }
);

/**
 * Public re-export so transaction actions can trigger a balance rebuild
 * without importing the internal helper directly.
 */
export const resolveGroupBalances = async (groupId: string): Promise<ActionResult> => {
  try {
    await rebuildGroupBalances(groupId);
    return { data: undefined };
  } catch (err) {
    console.error("[resolveGroupBalances]", err);
    return { error: "Failed to resolve group balances" };
  }
};