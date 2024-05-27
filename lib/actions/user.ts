"use server"

import { auth } from "../db/auth";
import { db } from "../db/db"
import moment from "moment";

export const getUserDetails = async () => {
    const session = await auth();

    if (!session?.user) {
        return { error: "Session or user information is missing" };
    }

    const userId = session.user.id;
    try {
        const user = await db.user.findUnique({
            where: { id: userId },
            include: {
                transaction: {
                    include: {
                        user: {
                            select: {
                                name: true,
                            }
                        }
                    },
                },
                groups: {
                    include: {
                        group: {
                            include: {
                                _count: {
                                    select: {
                                        members: true,
                                    }
                                }
                            }
                        }
                    }
                },
            },
        });

        if (!user) {
            return { error: "user not found" };
        }

        const { id, name, email, image, createdAt, groups, transaction } = user;
        const formattedUser = {
            id, name, email, image,
            createdAt: moment(createdAt).format("MMMM YYYY"),
            transactions: transaction.map(({ id, type, description, createdAt, amount, user: name }) => ({
                id, type, description, createdAt: moment(createdAt).format("YYYY-MM-DD, h:mm A"), amount, creatorName: name,
            })),
            groups: groups.map(({ group: { id, name, image, _count: { members: membersCount } } }) => ({
                id, name, image, membersCount
            })),
        };

        return { user: formattedUser };
    } catch (error) {
        return { error: "Something went wrong while fetching user details" };
    }
}

export const allAddGroupMembers = async (groupId: string) => {
    const session = await auth();

    if (!session?.user) {
        return { error: "Session or user information is missing" };
    }

    const group = await db.group.findFirst({
        where: {
            id: groupId
        },
        select: {
            id: true,
            name: true,
            image: true,
        }
    });

    if (!group) {
        return { error: "Invalid GroupId" }
    }

    try {
        const users = await db.user.findMany({
            select: {
                id: true,
                name: true,
                email: true,
                image: true,
            }, where: {
                groups: {
                    none: {
                        groupId: groupId
                    }
                }
            }
        }) as UserSelectListProps[];

        return { users };
    } catch (error) {
        return { error };
    }
}

export const addUserToGroup = async (groupId: string, userId: string) => {
    const group = await db.group.findFirst({
        where: {
            id: groupId
        }
    });

    const user = await db.user.findFirst({
        where: {
            id: userId
        }
    })

    if (!group || !user) {
        return { error: "Invalid GroupId or userId" };
    }

    try {
        await db.groupMember.create({
            data: {
                userId: userId,
                groupId: groupId,
            },
        });
        return { success: true };
    } catch (error) {
        return { error: "Something went wrong while adding user to group" };
    }
}