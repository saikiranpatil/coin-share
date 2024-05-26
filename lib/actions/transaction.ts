"use server";

import { MdOutlineEmergency } from "react-icons/md";
import { auth } from "../db/auth";
import { db } from "../db/db"
import { error } from "console";
import moment from "moment";

export const createTransaction = async (values) => {
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

    console.log(values);
    const session = await auth();

    if (!session?.user) {
        return { error: "Session or user information is missing" };
    }

    return {};
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