"use server"

import moment from "moment";
import bcrypt from "bcryptjs"

import { AuthError } from "next-auth";
import cloudinary from "@/lib/cloudinary"
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
import { getFilteredTransactions, getStatusTextForGroup } from "../utils";
import { transactionTableIncludeQuery } from "../constants/queries";

export const register = async (values: registerType) => {
    const validatedSchema = RegisterSchema.safeParse(values);

    if (!validatedSchema.success) {
        return { error: "Invalid Feild" };
    }

    const { name, email, password, avatar } = validatedSchema.data;
    const hashedPassword = await bcrypt.hash(password, 10);

    const existingUser = await getUserByEmail(email);

    if (existingUser) {
        return { error: "Email already use" }
    }

    try {
        let imageData = null;

        if (avatar) {
            const uploaderOptions = {
                folder: "avatars",
                height: 800,
                width: 800,
                crop: "thumb",
                gravity: "faces",
            };

            const myCloud = await cloudinary.uploader.upload(avatar, uploaderOptions);
            imageData = {
                publicId: myCloud.public_id,
                url: myCloud.secure_url,
            };
        }

        await db.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                image: imageData ? { create: imageData } : undefined,
            },
        });

        return { success: "User created!" };
    } catch (error) {
        return { error: "Something went wrong while registering user" };
    }
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
                image: {
                    select: { url: true }
                },
                transaction: {
                    take: 5,
                    include: transactionTableIncludeQuery,
                    orderBy: { createdAt: "desc" },
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
                    take: 5,
                    include: {
                        group: {
                            select: {
                                id: true,
                                name: true,
                                image: {
                                    select: { url: true }
                                },
                                members: {
                                    select: {
                                        userId: true,
                                        balance: true,
                                    }
                                },
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

        const { id, name, email, image, createdAt, groups, transaction: transactionsData } = user;

        const formattedUser = {
            id, name: name ?? "Unknown", email, imageUrl: image?.url,
            createdAt: moment(createdAt).format("MMMM YYYY"),
            transactions: getFilteredTransactions(transactionsData, userId),
            groups: groups.map(({ group: { id, name, image, members, _count: { members: membersCount } } }) => {
                const balance = members.find(member => member.userId === userId)?.balance || 0;
                const status = getStatusTextForGroup(balance);

                return ({
                    id,
                    name,
                    imageUrl: image?.url,
                    status,
                    membersCount
                })
            })
        };

        return { user: formattedUser };
    } catch (error) {
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

export const userStatsData = async () => {
    const session = await auth();

    if (!session?.user) {
        return ["-", "-", "-"];
    }

    const userId = session.user.id;
    try {
        const transactions = await db.transaction.findMany({
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
            },
            select: {
                contributors: {
                    select: {
                        userId: true,
                        amount: true,
                    }
                },
                recipients: {
                    select: {
                        userId: true,
                        amount: true,
                    }
                }
            }
        });

        const totalTransactionCount = transactions.length;
        const totalTransactionAmount = transactions.reduce((sum, transaction) => {
            const totalContributerAmount = transaction.contributors.reduce((contributerSum, contributer) => {
                if (contributer.userId === userId) return contributerSum + contributer.amount;
                return contributerSum;
            }, 0);

            const totalRecipientAmount = transaction.recipients.reduce((recipientSum, recipient) => {
                if (recipient.userId === userId) return recipientSum + recipient.amount;
                return recipientSum;
            }, 0);
            return totalContributerAmount + totalRecipientAmount + sum;
        }, 0);
        const totalBalance = transactions.reduce((sum, transaction) => {
            const totalContributerAmount = transaction.contributors.reduce((contributerSum, contributer) => {
                if (contributer.userId === userId) return contributerSum + contributer.amount;
                return contributerSum;
            }, 0);

            const totalRecipientAmount = transaction.recipients.reduce((recipientSum, recipient) => {
                if (recipient.userId === userId) return recipientSum + recipient.amount;
                return recipientSum;
            }, 0);
            return totalContributerAmount - totalRecipientAmount + sum;
        }, 0);

        return [totalBalance, totalTransactionAmount, totalTransactionCount];
    } catch (error) {
        return ["-", "-", "-"];
    }
}