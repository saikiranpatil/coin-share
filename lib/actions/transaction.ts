"use server";

import { auth } from "../db/auth";
import { db } from "../db/db"
import moment from "moment";

export const createTransaction = async (transaction) => {
    const session = await auth();

    if (!session?.user?.id) {
        return { error: "Session or user information is missing" };
    }
    const userId = session.user.id;

    const parsedAmount = Number(transaction.basicDetails.amount);

    if (isNaN(parsedAmount)) {
        return { error: "Invalid Amount Format" };
    }

    const filteredContributors = transaction.contributors.isMultiple ?
        transaction.contributors.multiple : [{ ...transaction.contributors.single, amount: parsedAmount }];

    const { recipients } = transaction;
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
            include: {
                user: {
                    select: {
                        name: true,
                    }
                },
                groups: {
                    select: {
                        name: true,
                    }
                }
            }
        });

        if (!transaction) {
            return { error: "Transaction not found" };
        }

        const { id, type, description, createdAt, amount, user: { name: creatorName }, groups: { name: groupName } } = transaction;
        const filteredTransaction = {
            id, type, description, createdAt: moment(createdAt).format("YYYY-MM-DD, hh:mm A"), amount, creatorName, groupName
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
            select: {
                id: true,
                amount: true,
                type: true,
                description: true,
                createdAt: true,
                user: {
                    select: {
                        name: true,
                    }
                },
                groups: {
                    select: {
                        name: true,
                    }
                }
            }
        });

        const filteredTransactions = transactions
            .map(({
                id,
                type,
                description,
                createdAt,
                amount,
                user: { name: creatorName },
                groups: { name: groupName },
            }) => ({
                id,
                type,
                description,
                createdAt: moment(createdAt).format("YYYY-MM-DD, hh:mm A"),
                amount,
                creatorName: creatorName ?? "Unknown",
                groupName: groupName ?? "Unknown",
            }));

        return { transactions: filteredTransactions };
    } catch (error) {
        return { error: "Something went erong while fetching All Transactions" };
    }
}