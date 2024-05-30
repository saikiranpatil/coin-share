"use server"

import { auth } from "../db/auth";
import { db } from "../db/db"
import { CreateGroupSchema, type createGroupSchemaType } from "../schemas/group";
import { getFilteredGoups, getFilteredTransactions } from "../utils";
import { transactionTableIncludeQuery } from "../constants/queries";
import { Entry, getMinCashFlow } from "../algorithms/MinCashFlow";

export const createGroup = async (values: createGroupSchemaType) => {
    const session = await auth();

    if (!session?.user?.id) {
        return { error: "Session or user information is missing" };
    }
    const userId = session.user.id;
    const validatedSchema = CreateGroupSchema.safeParse(values);

    if (!validatedSchema.success) {
        return { error: "Invalid Feilds" };
    }

    const { name, image } = validatedSchema.data;

    try {
        const data = await db.group.create({
            data: {
                name,
                image,
                members: {
                    create: {
                        userId: userId
                    }
                }
            }
        });

        return { success: "Group created sucessfully!", groupId: data.id };
    } catch (err) {
        return { error: "Something went wrong while creating group" };
    }
}

export const getAllGroups = async () => {
    const session = await auth();

    if (!session?.user?.id) {
        return { error: "Session or user information is missing" };
    }

    const userId = session.user.id;
    try {
        const groups = await db.group.findMany({
            where: {
                members: {
                    some: {
                        userId: userId
                    }
                }
            },
            include: {
                _count: {
                    select: {
                        members: true,
                    },
                },
            },
        });

        const filteredGroups = groups.map(group => ({
            id: group.id,
            name: group.name ?? "Unknown",
            image: group.image,
            membersCount: group._count.members,
        }));

        return { groups: filteredGroups };
    } catch (err) {
        return { error: "Something went wrong while fetching groups" };
    }
}

export const getAllGroupsTitle = async () => {
    const session = await auth();

    if (!session?.user?.id) {
        return { error: "Session or user information is missing" };
    }

    const userId = session.user.id;
    try {
        const groups = await db.group.findMany({
            select: {
                id: true,
                name: true,
            },
            where: {
                members: {
                    some: {
                        userId: userId
                    }
                }
            },
        });

        return { groups };
    } catch (err) {
        return { error: "Something went wrong while fetching groups titles" };
    }
}

export const getGroupDetails = async (groupId: string) => {
    const session = await auth();

    if (!session?.user?.id) {
        return { error: "Session or user information is missing" };
    }

    const userId = session.user.id;
    try {
        const group = await db.group.findUnique({
            where: {
                id: groupId,
                members: {
                    some: {
                        userId: userId,
                    },
                },
            },
            include: {
                transactions: {
                    include: transactionTableIncludeQuery,
                },
                members: {
                    select: {
                        user: {
                            select: {
                                id: true,
                                name: true,
                                email: true,
                                image: true,
                            }
                        },
                    }
                },
                userGroupBalance: {
                    select: {
                        amount: true,
                        fromUserId: true,
                        toUserId: true,
                    },
                    where: {
                        OR: [
                            {
                                fromUserId: userId,
                            },
                            {
                                toUserId: userId,
                            }
                        ]
                    }
                }
            },
        });

        if (!group) {
            return { error: "Group Not Found" };
        }

        return { group: getFilteredGoups(group, userId) };
    } catch (error) {
        return { error: "Something went wrong while fetching group data" };
    }
}

export const resolveGroupBalances = async (groupId: string) => {
    console.log("Resolve Balance Solve Called");

    const session = await auth();
    if (!session?.user?.id) {
        return { error: "Session or user information is missing" };
    }

    try {
        const group = await db.group.findUnique({
            where: {
                id: groupId,
            },
            include: {
                transactions: {
                    include: {
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
                        }
                    },
                },
            },
        });

        if (!group) {
            return { error: "Group Not Found" };
        }

        const balance: { [key: string]: number } = {};
        const netAmountData: Entry[] = [];

        group.transactions.forEach(transaction => {
            const { contributors, recipients } = transaction;

            contributors.forEach(contributer => {
                balance[contributer.user.id] = (balance[contributer.user.id] || 0) + contributer.amount;
            });
            recipients.forEach(recipient => {
                balance[recipient.user.id] = (balance[recipient.user.id] || 0) - recipient.amount;
            });
        });

        for (const userId in balance) {
            await db.groupMember.update({
                where: { userId_groupId: { groupId, userId } },
                data: { balance: balance[userId] }
            });
        }

        for (const userId in balance) {
            netAmountData.push({ key: userId, amount: balance[userId] });
        }

        const minCashFlowData = getMinCashFlow(netAmountData);
        await db.userGroupBalance.createMany({
            data: minCashFlowData.map(({ from, to, amount }) => ({ fromUserId: from, toUserId: to, amount, groupId }))
        });

        await Promise.all(
            minCashFlowData.map(({ from, to, amount }) => {
                db.userGroupBalance.upsert({
                    where: {
                        groupId_fromUserId_toUserId: {
                            groupId,
                            fromUserId: from,
                            toUserId: to
                        }
                    },
                    update: { amount },
                    create: { fromUserId: from, toUserId: to, groupId, amount },
                })
            })
        );

        return { success: "Group Balance Resolved Sucessfully." };
    } catch (error) {
        return { error: "Something went wrong while fetching group data" };
    }
}