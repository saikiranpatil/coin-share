"use server";

import moment from "moment";
import bcrypt from "bcryptjs";
import { AuthError } from "next-auth";

import cloudinary from "@/lib/cloudinary";
import { signIn, signOut } from "@/lib/db/auth";
import { db } from "../db/db";
import { LoginSchema, type loginType } from "@/lib/schemas/login";
import { RegisterSchema, type registerType } from "@/lib/schemas/register";
import { DEFAULT_LOGIN_REDIRECT } from "@/lib/db/routes";
import { getUserByEmail } from "@/lib/data/user";
import { getFilteredTransactions, getStatusTextForGroup } from "../utils";
import { transactionTableIncludeQuery } from "../constants/queries";
import { uploaderOptions } from "../constants";
import { withAuth, type ActionResult } from "../utils";

export const register = async (values: registerType): Promise<ActionResult> => {
  const parsed = RegisterSchema.safeParse(values);
  if (!parsed.success) {
    return { error: "Invalid fields: " + parsed.error.flatten().formErrors.join(", ") };
  }

  const { name, email, password, avatar } = parsed.data;

  const existing = await getUserByEmail(email);
  if (existing) return { error: "Email is already in use" };

  const hashedPassword = await bcrypt.hash(password, 10);

  let imageData: { publicId: string; url: string } | null = null;
  if (avatar) {
    const avatarOptions = { folder: "avatars", height: 800, width: 800, crop: "thumb", gravity: "faces" };
    const { public_id: publicId, secure_url: url } = await cloudinary.uploader.upload(avatar, avatarOptions);
    imageData = { publicId, url };
  }

  await db.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      image: imageData ? { create: imageData } : undefined,
    },
  });

  return { data: undefined };
};

export const login = async (values: loginType): Promise<ActionResult> => {
  const parsed = LoginSchema.safeParse(values);
  if (!parsed.success) {
    return { error: "Invalid fields" };
  }

  const { email, password } = parsed.data;

  try {
    await signIn("credentials", { email, password, redirectTo: DEFAULT_LOGIN_REDIRECT });
    return { data: undefined };
  } catch (err) {
    if (err instanceof AuthError) {
      return err.type === "CredentialsSignin"
        ? { error: "Invalid credentials" }
        : { error: "Sign-in failed. Please try again." };
    }
    throw err; // Re-throw redirect errors so Next.js handles them
  }
};

export const logout = async () => signOut();

export const loginWithOAuth = async (provider: "google" | "github") => {
  await signIn(provider, { redirectTo: DEFAULT_LOGIN_REDIRECT });
};

export const getUserDetails = withAuth(async (userId) => {
  const user = await db.user.findUnique({
    where: { id: userId },
    include: {
      image: { select: { url: true } },
      transaction: {
        take: 5,
        include: transactionTableIncludeQuery,
        orderBy: { createdAt: "desc" },
        where: {
          OR: [
            { contributors: { some: { userId } } },
            { recipients:   { some: { userId } } },
          ],
        },
      },
      groups: {
        take: 5,
        include: {
          group: {
            select: {
              id: true,
              name: true,
              image: { select: { url: true } },
              members: { select: { userId: true, balance: true } },
              _count: { select: { members: true } },
            },
          },
        },
      },
    },
  });

  if (!user) return { error: "User not found" };

  const { id, name, email, image, createdAt, groups, transaction: transactionsData } = user;

  return {
    data: {
      id,
      name: name ?? "Unknown",
      email,
      imageUrl: image?.url,
      createdAt: moment(createdAt).format("MMMM YYYY"),
      transactions: getFilteredTransactions(transactionsData, userId),
      groups: groups.map(({ group: { id, name, image, members, _count: { members: membersCount } } }) => {
        const balance = members.find((m) => m.userId === userId)?.balance ?? 0;
        return { id, name, imageUrl: image?.url, status: getStatusTextForGroup(balance), membersCount };
      }),
    },
  };
});

export const allGroupMembers = withAuth(
  async (_userId, _session, groupId: string, withinGroup = true) => {
    const group = await db.group.findFirst({
      where: { id: groupId },
      select: { id: true },
    });
    if (!group) return { error: "Invalid group ID" };

    const users = await db.user.findMany({
      select: { id: true, name: true, email: true, image: true },
      where: {
        groups: withinGroup
          ? { some: { groupId } }
          : { none: { groupId } },
      },
    });

    return { data: users };
  }
);

export const addUserToGroup = withAuth(
  async (_userId, _session, groupId: string, targetUserId: string) => {
    const [group, user] = await Promise.all([
      db.group.findFirst({ where: { id: groupId }, select: { id: true } }),
      db.user.findFirst({ where: { id: targetUserId }, select: { id: true } }),
    ]);

    if (!group || !user) return { error: "Invalid group ID or user ID" };

    await db.groupMember.create({ data: { userId: targetUserId, groupId } });

    return { data: undefined };
  }
);

export const getUserStats = withAuth(async (userId) => {
  const transactions = await db.transaction.findMany({
    where: {
      OR: [
        { contributors: { some: { userId } } },
        { recipients:   { some: { userId } } },
      ],
    },
    select: {
      contributors: { select: { userId: true, amount: true } },
      recipients:   { select: { userId: true, amount: true } },
    },
  });

  let totalBalance = 0;
  let totalVolume = 0;

  for (const { contributors, recipients } of transactions) {
    const contributed = contributors.filter((c) => c.userId === userId).reduce((s, c) => s + c.amount, 0);
    const received    = recipients.filter((r) => r.userId === userId).reduce((s, r) => s + r.amount, 0);
    totalBalance += contributed - received;
    totalVolume  += contributed + received;
  }

  return {
    data: {
      totalBalance,
      totalVolume,
      totalTransactions: transactions.length,
    },
  };
});

export const changeUserAvatar = withAuth(
  async (_userId, _session, id: string, type: editAvatarType, image: string | undefined) => {
    // Remove old image from Cloudinary + DB atomically
    const prevImage = await db.image.findFirst({
      where: type === "user" ? { user: { id } } : { group: { id } },
      select: { id: true, publicId: true },
    });

    if (prevImage) {
      await Promise.all([
        cloudinary.uploader.destroy(prevImage.publicId),
        db.image.delete({ where: { id: prevImage.id } }),
      ]);
    }

    if (!image) return { data: undefined };

    const { public_id: publicId, secure_url: url } = await cloudinary.uploader.upload(image, uploaderOptions);

    if (type === "user") {
      await db.user.update({ where: { id }, data: { image: { create: { publicId, url } } } });
    } else if (type === "group") {
      await db.group.update({ where: { id }, data: { image: { create: { publicId, url } } } });
    }

    return { data: undefined };
  }
);