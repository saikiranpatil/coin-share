"use server";

import moment from "moment";

import { db } from "../db/db";
import { transactionTableIncludeQuery } from "../constants/queries";
import { getFilteredTransactions } from "../utils";
import { resolveGroupBalances } from "./group";
import { withAuth, type ActionResult } from "../utils";

interface TransactionParty {
  id: string;
  amount: number;
}

interface CreateTransactionInput {
  basicDetails: {
    type: "Payment" | "Settlement";
    image?: string;
    amount: string;
    groupId: string;
    description: string;
  };
  contributors:
    | { isMultiple: false; single: UserSelectListProps }
    | { isMultiple: true; multiple: AddTransactionDataMembersProps[] };
  recipients: AddTransactionDataMembersProps[];
}

function resolveContributors(
  contributors: CreateTransactionInput["contributors"],
  parsedAmount: number
): TransactionParty[] {
  if (!contributors.isMultiple) {
    return [{ id: contributors.single.id as string, amount: parsedAmount }];
  }
  return contributors.multiple.map(({ id, amount }) => ({ id: id as string, amount }));
}

function sumAmounts(parties: { amount: number }[]): number {
  return parties.reduce((sum, p) => sum + p.amount, 0);
}

export const createTransaction = withAuth(
  async (userId, _session, input: CreateTransactionInput) => {
    const parsedAmount = Number(input.basicDetails.amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      return { error: "Invalid amount format" };
    }

    const contributors = resolveContributors(input.contributors, parsedAmount);
    const { recipients } = input;

    if (sumAmounts(contributors) !== sumAmounts(recipients)) {
      return { error: "Total contributor amount must equal total recipient amount" };
    }

    const { type, description, groupId } = input.basicDetails;

    const transaction = await db.transaction.create({
      data: {
        type,
        description,
        amount: parsedAmount,
        creatorUserId: userId,
        groupId,
        contributors: {
          create: contributors.map(({ id, amount }) => ({
            user: { connect: { id } },
            amount,
          })),
        },
        recipients: {
          create: recipients.map(({ id, amount }) => ({
            user: { connect: { id: id as string } },
            amount,
          })),
        },
      },
    });

    await resolveGroupBalances(groupId);

    return { data: { transactionId: transaction.id } };
  }
);

export const getTransactionDetails = withAuth(
  async (_userId, _session, transactionId: string) => {
    const transaction = await db.transaction.findUnique({
      where: { id: transactionId },
      include: transactionTableIncludeQuery,
    });

    if (!transaction) return { error: "Transaction not found" };

    const {
      id, type, description, createdAt, amount,
      contributors, recipients,
      user: { name: creatorName },
      groups: { name: groupName },
    } = transaction;

    return {
      data: {
        id,
        type,
        description,
        amount,
        creatorName,
        groupName,
        createdAt: moment(createdAt).format("YYYY-MM-DD, hh:mm A"),
        contributors: contributors.map(({ amount, user }) => ({ amount, name: user.name })),
        recipients:   recipients.map(({ amount, user })   => ({ amount, name: user.name })),
      },
    };
  }
);

export const getAllTransactionsByUser = withAuth(
  async (userId) => {
    const transactions = await db.transaction.findMany({
      where: { creatorUserId: userId },
      include: transactionTableIncludeQuery,
      orderBy: { createdAt: "desc" },
    });

    return { data: getFilteredTransactions(transactions, userId) };
  }
);

export const makePayment = withAuth(
  async (userId, _session, groupId: string, memberId: string, amount: number, tag: GroupStatusTagProps) => {
    if (!amount || amount <= 0) {
      return { error: "Invalid amount" };
    }

    // Fetch group, member, and acting user in parallel
    const [group, member, actingUser] = await Promise.all([
      db.group.findUnique({ where: { id: groupId }, select: { id: true } }),
      db.user.findUnique({ where: { id: memberId }, select: { id: true, name: true } }),
      db.user.findUnique({ where: { id: userId },   select: { id: true, name: true } }),
    ]);

    if (!group)      return { error: "Group not found" };
    if (!member)     return { error: "Member not found" };
    if (!actingUser) return { error: "Authenticated user not found" };

    const isOwing = tag === "owe";
    const description = isOwing
      ? `"${actingUser.name}" paid "${member.name}" ₹${amount}`
      : `"${member.name}" paid "${actingUser.name}" ₹${amount}`;

    // When the acting user owes: they are the contributor, member is recipient (they receive the credit)
    const contributors = [{ userId: isOwing ? userId   : memberId, amount }];
    const recipients   = [{ userId: isOwing ? memberId : userId,   amount }];

    await db.transaction.create({
      data: {
        type: "Settlement",
        creatorUserId: userId,
        groupId,
        description,
        amount,
        contributors: { create: contributors },
        recipients:   { create: recipients },
      },
    });

    await resolveGroupBalances(groupId);

    return { data: undefined };
  }
);