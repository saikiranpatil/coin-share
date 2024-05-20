"use server"

import { AuthError } from "next-auth";

import { signIn } from "@/lib/db/auth";

import {
    LoginSchema,
    type loginType
} from "@/lib/schemas/login";

import { DEFAULT_LOGIN_REDIRECT } from "@/lib/db/routes";

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

        return { sucess: true };
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

export const loginWithOAuth = async (provider: "google" | "github") => {
    await signIn(provider, {
        redirectTo: DEFAULT_LOGIN_REDIRECT
    });
}