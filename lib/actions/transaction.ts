"use server";

import { auth } from "../db/auth";
import { db } from "../db/db"
import { AddTransactionSchema, addTransactionSchemaType } from "../schemas/transaction";

export const getAllTransactions = async () => {
    const transaction = await db.transaction.findMany();
}

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
        await db.transaction.create({
            data: {
                amount: parsedAmount,
                description,
                groupId,
                creatorUserId: userId as string,
            }
        });
        
        return { success: "Transaction Created" };
    } catch (error) {
        console.log(error)
        return { error: "Something went wrong while creating transaction" }
    }
}