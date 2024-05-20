import bcrypt from "bcryptjs"

import type { NextAuthConfig } from "next-auth"

import Credentials from "next-auth/providers/credentials"
import Github from "next-auth/providers/github"
import Google from "next-auth/providers/google"

import { LoginSchema } from "@/schemas/login"
import { getUserByEmail } from "@/data/user"

const authConfig: NextAuthConfig = {
    providers: [
        Github({
            clientId:process.env.GITHUB_CLIENT_ID,
            clientSecret:process.env.GITHUB_CLIENT_SECRET
        }),
        Google({
            clientId:process.env.GOOGLE_CLIENT_ID,
            clientSecret:process.env.GOOGLE_CLIENT_SECRET
        }),
        Credentials({
            async authorize(credentials) {
                const validatedCredentials = LoginSchema.safeParse(credentials);

                // if schema is not matched with credentials do not proceed
                if (!validatedCredentials.success) {
                    return null;
                }

                const { email, password } = validatedCredentials.data;
                const user = await getUserByEmail(email);

                // if user not found do not proceed
                if (!user) {
                    return null;
                }

                const isPasswordMatched = await bcrypt.compare(password, user.password || "");

                // if password did not match do not proceed
                if (!isPasswordMatched) {
                    return null;
                }

                return user;
            }
        })
    ]
}

export default authConfig