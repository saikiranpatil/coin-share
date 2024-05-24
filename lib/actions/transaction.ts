"use server";

import { MdOutlineEmergency } from "react-icons/md";
import { auth } from "../db/auth";
import { db } from "../db/db"
import { AddTransactionSchema, addTransactionSchemaType } from "../schemas/transaction";
import { error } from "console";
import moment from "moment";

export const createTransaction = async (values: addTransactionSchemaType) => {
    const session = await auth();

    if (!session?.user) {
        return { error: "Session or user information is missing" };
    }

    const userId = session.user.id;

    const validatedSchema = AddTransactionSchema.safeParse(values);
    if (!validatedSchema.success) {
        return { error: "Invalid Data Format" }
    }

    const parsedAmount = Number(validatedSchema.data.amount);
    if (isNaN(parsedAmount)) {
        return { error: "Invalid Amount Format" };
    }
    const { description, groupId } = validatedSchema.data;

    try {
        const transaction = await db.transaction.create({
            data: {
                amount: parsedAmount,
                description,
                groupId,
                creatorUserId: userId as string,
            }
        });

        return { success: "Transaction Created", transaction };
    } catch (error) {
        return { error: "Something went wrong while creating transaction" }
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
        return { error };
    }
}