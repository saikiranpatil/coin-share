"use server";

import { auth } from "../db/auth";
import { db } from "../db/db"
import moment from "moment";
import { getTransactionStatusOfUser } from "../utils";

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
                },
                contributors: {
                    select: {
                        amount: true,
                        user: {
                            select: {
                                name: true,
                            }
                        }
                    },
                },
                recipients: {
                    select: {
                        amount: true,
                        user: {
                            select: {
                                name: true,
                            }
                        }
                    },
                }
            }
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
                contributors: {
                    select: {
                        amount: true,
                        user: {
                            select: {
                                id: true,
                            }
                        }
                    },
                },
                recipients: {
                    select: {
                        amount: true,
                        user: {
                            select: {
                                id: true,
                            }
                        }
                    },
                },
            }
        });

        const filteredTransactions = transactions
            .map(
                (transaction) => {
                    const {
                        id, type, description, createdAt, amount,
                        user: { name: creatorName },
                    } = transaction;

                    console.log(getTransactionStatusOfUser(userId, transaction, type),"saasdds");

                    return ({
                        id, type, description, status: getTransactionStatusOfUser(userId, transaction, type),
                        createdAt: moment(createdAt).format("YYYY-MM-DD, hh:mm A"), amount,
                        creatorName: creatorName ?? "Unknown",
                    })
                }
            );

        return { transactions: filteredTransactions };
    } catch (error) {
        return { error: "Something went erong while fetching Transactions Details" };
    }
}