"use server"

import moment from "moment";
import { auth } from "../db/auth";
import { db } from "../db/db"
import { CreateGroupSchema, type createGroupSchemaType } from "../schemas/group";
import { getTransactionStatusOfUser } from "../utils";

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
                    include: {
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
                        },
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
                },
                members: {
                    include: {
                        user: true
                    },
                },
            },
        });

        if (!group) {
            return { error: "Group Not Found" };
        }

        const formattedGroup = {
            ...group,
            members: group.members.map(
                ({
                    user: { id, name, email, image }
                }) => ({
                    id, name: name ?? "Unknown", email, image
                })
            ),
            transactions: group.transactions.map(
                (transaction) => {
                    const {
                        id, type, description, createdAt, amount,
                        user: { name: creatorName },
                    } = transaction;

                    return ({
                        id, type, description, status: getTransactionStatusOfUser(userId, transaction, type),
                        createdAt: moment(createdAt).format("YYYY-MM-DD, hh:mm A"), amount,
                        creatorName: creatorName ?? "Unknown",
                    })
                }
            )
        };

        return { group: formattedGroup };
    } catch (error) {
        console.log(error);
        return { error: "Something went wrong while fetching group data" };
    }
}    