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
            select: {
                name: true,
                image: true,
                email: true,
                createdAt: true
            }
        });

        if (!user) {
            return { error: "user not found" };
        }

        const formattedUser = {
            ...user,
            createdAt: moment(user.createdAt).format("MMMM YYYY")
        };

        return { user: formattedUser, success: "User Found" };
    } catch (error) {
        return { error: "Something went wrong while fetching user details" };
    }
}