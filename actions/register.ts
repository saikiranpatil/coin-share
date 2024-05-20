"use server"

import bcrypt from "bcryptjs"

import { getUserByEmail } from "@/data/user";

import { db } from "@/lib/db";
import {
    RegisterSchema,
    type registerType,
} from "@/schemas/register";

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