"use server"

import moment from "moment";
import bcrypt from "bcryptjs"

import { AuthError } from "next-auth";

import {
    auth,
    signIn,
    signOut
} from "@/lib/db/auth";
import { db } from "../db/db";

import {
    LoginSchema,
    type loginType
} from "@/lib/schemas/login";
import {
    RegisterSchema,
    type registerType,
} from "@/lib/schemas/register";

import { DEFAULT_LOGIN_REDIRECT } from "@/lib/db/routes";
import { getUserByEmail } from "@/lib/data/user";
import { getTransactionStatusOfUser } from "../utils";


export const register = async (values: registerType) => {
    const validatedSchema = RegisterSchema.safeParse(values);

    if (!validatedSchema.success) {
        return { error: "Invalid Feild" };
    }

    const { name, email, password } = validatedSchema.data;
    const hashedPassword = await bcrypt.hash(password, 10);

    const existingUser = await getUserByEmail(email);

    if (existingUser) {
        return { error: "Email already use" }
    }

    await db.user.create({
        data: {
            name,
            email,
            password: hashedPassword,
        }
    })

    return { success: "User created!" };
}

export const login = async (values: loginType) => {
    const validatedSchema = LoginSchema.safeParse(values);

    if (!validatedSchema.success) {
        return { error: "Invalid Feild" };
    }

    const { email, password } = validatedSchema.data;

    try {
        await signIn("credentials", {
            email,
            password,
            redirectTo: DEFAULT_LOGIN_REDIRECT
        });

        return { success: "Logged In" };
    } catch (error) {
        if (error instanceof AuthError) {
            switch (error.type) {
                case "CredentialsSignin":
                    return { error: "Invalid Credentials" };

                default:
                    return { error: "Something went wrong while sigining in" };
            }
        }
        throw error;
    }
}

export const logout = async () => {
    await signOut();
}

export const loginWithOAuth = async (provider: "google" | "github") => {
    await signIn(provider, {
        redirectTo: DEFAULT_LOGIN_REDIRECT
    });
}

export const getUserDetails = async () => {
    const session = await auth();

    if (!session?.user?.id) {
        return { error: "Session or user information is missing" };
    }

    const userId = session.user.id;
    try {
        const user = await db.user.findUnique({
            where: {
                id: userId,
            },
            include: {
                transaction: {
                    include: {
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
                    },
                    where: {
                        OR: [
                            {
                                contributors: {
                                    some: {
                                        userId: userId,
                                    }
                                }
                            },
                            {
                                recipients: {
                                    some: {
                                        userId: userId,
                                    }
                                }
                            },
                        ]
                    }
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
            },
        });

        if (!user) {
            return { error: "user not found" };
        }

        const { id, name, email, image, createdAt, groups, transaction: transactionsData } = user;

        const formattedUser = {
            id, name: name ?? "Unknown", email, image,
            createdAt: moment(createdAt).format("MMMM YYYY"),
            transactions: transactionsData
                .map(
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
                ),
            groups: groups.map(
                ({
                    group: { id, name, image, _count: { members: membersCount } }
                }) =>
                ({
                    id, name: name ?? "Unknown", image, membersCount
                })
            ),
        };

        return { user: formattedUser };
    } catch (error) {
        console.log(error);
        return { error: "Something went wrong while fetching user details" };
    }
}

export const allGroupMembers = async (groupId: string, withinGroup: boolean = true) => {
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
                groups: withinGroup ?
                    {
                        some: {
                            groupId: groupId,
                        }
                    } : {
                        none: {
                            groupId: groupId,
                        }
                    }
            }
        }) as UserSelectListProps[];

        return { users };
    } catch (error) {
        return { error: "Something went wrong while fetching users list" };
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