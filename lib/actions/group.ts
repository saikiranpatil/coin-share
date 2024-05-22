"use server"

import { auth } from "../db/auth";
import { db } from "../db/db"
import { CreateGroupSchema, type createGroupSchemaType } from "../schemas/group";

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

        console.log(data);

        return { success: "Group created sucessfully!", data };
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
            name: group.name,
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

getAllGroupsTitle();

export const getGroup = async (groupId: string) => {
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
                transactions: true,
                members: {
                    include: {
                        user: true, // Include user details if needed
                    },
                },
            },
        });

        console.log(group);
    } catch (err) {
        return { error: "Something went wrong while fetching group data" };
    }
}    