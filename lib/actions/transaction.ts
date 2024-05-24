"use server";

import { MdOutlineEmergency } from "react-icons/md";
import { auth } from "../db/auth";
import { db } from "../db/db"
import { AddTransactionSchema, addTransactionSchemaType } from "../schemas/transaction";
import { error } from "console";
import moment from "moment";

export const createTransaction = async (values: addTransactionSchemaType) => {
    // const transaction = {
    //     amount: "23",
    //     description: "asdas",
    //     groupId: "clwi5ehx500009vhtvljki786",
    //     creatorUserId:"clwd6pib30000r01sj0ml3hl9",
    //     contributers:[
    //         {
    //             userId:"clwd6pib30000r01sj0ml3hl9",
    //             amount:45
    //         },
    //         {
    //             userId:"clwk4yac300055fb26lpn82zy",
    //             amount:45
    //         },
    //     ],
    //     reciepients:[
    //         {
    //             userId:"clwk4rbjj00025fb2y9qxcv29",
    //             amount:45
    //         },
    //         {
    //             userId:"clwk4rbjj00025fb2y9qxcv29",
    //             amount:45
    //         },
    //     ]
    // };
    // return;
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