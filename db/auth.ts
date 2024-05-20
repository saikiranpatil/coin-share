import NextAuth from "next-auth"
import authConfig from "./auth.config"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { db } from "@/lib/db"

export const {
    handlers: {
        GET,
        POST
    },
    signIn,
    signOut,
    auth
} = NextAuth({
    callbacks: {
        async session({ token, session }) {
            console.log("Session Starts");
            console.log(session);
            console.log(token);
            console.log("Session Ends");

            return session;
        },
        async jwt({ token }) {
            console.log("Token Starts");
            console.log(token);
            console.log(token);
            console.log("Token Ends");

            return token;
        },
    },
    adapter: PrismaAdapter(db),
    session: { strategy: "jwt" },
    ...authConfig,
})