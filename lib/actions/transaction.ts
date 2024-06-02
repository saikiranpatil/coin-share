"use server";

import { auth } from "../db/auth";
import { db } from "../db/db"
import moment from "moment";
import { getFilteredTransactions } from "../utils";
import { transactionTableIncludeQuery } from "../constants/queries";
import { resolveGroupBalances } from "./group";

interface createTransactionProps {
    basicDetails: {
        type: "Payment" | "Settlement";
        image?: string;
        amount: string;
        groupId: string;
        description: string;
    },
    contributors: {
        isMultiple: boolean;
        single?: UserSelectListProps;
        multiple?: AddTransactionDataMembersProps[];
    },
    recipients: AddTransactionDataMembersProps[];
};

export const createTransaction = async (transaction: createTransactionProps) => {
    const session = await auth();

    if (!session?.user?.id) {
        return { error: "Session or user information is missing" };
    }
    const userId = session.user.id;

    const parsedAmount = Number(transaction.basicDetails?.amount);

    if (isNaN(parsedAmount)) {
        return { error: "Invalid Amount Format" };
    }

    const filteredContributors = transaction.contributors.isMultiple ?
        transaction.contributors.multiple : [{ ...transaction.contributors.single, amount: parsedAmount }];
    const { recipients } = transaction;

    if (!filteredContributors) {
        return { error: "Error while fetching Contributers" };
    }

    const totalContributersAmount = filteredContributors?.reduce((total, contributer) => total + contributer.amount, 0);
    const totalRecipientsAmount = recipients?.reduce((total, recipient) => total + recipient.amount, 0);

    if (totalContributersAmount !== totalRecipientsAmount) {
        return { error: "Total Contributers Amount is not equal to total Recipients Amount" };
    }

    const { type, description, groupId } = transaction.basicDetails;

    try {
        const transactionData = await db.transaction.create({
            data: {
                type,
                description,
                amount: parsedAmount,
                creatorUserId: userId,
                groupId,
                contributors: {
                    create: filteredContributors.map(contributor => ({
                        userId: contributor.id,
                        amount: contributor.amount
                    }))
                },
                recipients: {
                    create: recipients.map(recipient => ({
                        userId: recipient.id,
                        amount: recipient.amount
                    }))
                }
            },
        });

        await resolveGroupBalances(groupId);

        return {
            transaction: transactionData,
            success: "transaction created Sucessfully."
        };
    } catch (error) {
        return { error: "Something went wrong while creating transaction" };
    }
}

export const getTransactionDetails = async (transactionId: string) => {
    const session = await auth();

    if (!session?.user) {
        return { error: "Session or user information is missing" };
    }

    try {
        const transaction = await db.transaction.findUnique({
            where: {
                id: transactionId,
            },
            include: transactionTableIncludeQuery,
        });

        if (!transaction) {
            return { error: "Transaction not found" };
        }

        const {
            id, type, description, createdAt, amount,
            contributors, recipients,
            user: { name: creatorName }, groups: { name: groupName },
        } = transaction;

        const filteredTransaction = {
            id, type, description, amount, creatorName, groupName,
            createdAt: moment(createdAt).format("YYYY-MM-DD, hh:mm A"),
            recipients: recipients.map(({ amount, user }) => ({ amount, name: user.name })),
            contributors: contributors.map(({ amount, user }) => ({ amount, name: user.name })),
        };

        return { transaction: filteredTransaction };
    } catch (error) {
        return { error: "Something went wrong while loading transaction Details" };
    }
}

export const getAllTransactionsByUser = async () => {
    const session = await auth();

    if (!session?.user?.id) {
        return { error: "Session or user information is missing" };
    }
    const userId = session.user.id;

    try {
        const transactions = await db.transaction.findMany({
            where: {
                creatorUserId: userId,
            },
            include: transactionTableIncludeQuery,
            orderBy: { createdAt: "desc" }
        });

        const filteredTransactions = getFilteredTransactions(transactions, userId);

        return { transactions: filteredTransactions };
    } catch (error) {
        return { error: "Something went erong while fetching Transactions Details" };
    }
}

export const makePayment = async (groupId: string, memberId: string, amount: number, tag: GroupStatusTagProps) => {
    if (!amount) {
        return { error: "Invalid Amount" };
    }

    const session = await auth();
    if (!session?.user?.id) {
        return { error: "Session or user information is missing" };
    }

    const userId = session.user.id;

    const group = await db.group.findUnique({
        where: { id: groupId }
    });
    if (!group) {
        return { error: "Group not found with given groupId" };
    }

    const member = await db.user.findUnique({
        where: { id: memberId }
    });
    if (!member) {
        return { error: "Member not found with given userId" };
    }

    const user = await db.user.findUnique({
        where: { id: userId }
    })

    const description = tag === "owe" ? `"${user?.name}" paid "${member?.name}" Rs.${amount}` : `"${member?.name}" paid "${user?.name}" Rs.${amount}`;

    const recipients = tag === "owe" ? [{ userId: userId, amount }] : [{ userId: memberId, amount }];
    const contributors = tag === "owe" ? [{ userId: memberId, amount }] : [{ userId: userId, amount }];



    try {
        await db.transaction.create({
            data: {
                type: "Settlement",
                creatorUserId: userId,
                groupId,
                description,
                amount,
                contributors: {
                    create: contributors
                },
                recipients: {
                    create: recipients
                }
            }
        });

        await resolveGroupBalances(groupId);

        return { success: "Payment Sucessful!" };
    } catch (error) {
        return { error: "Something went wrong while making payment" };
    }
}