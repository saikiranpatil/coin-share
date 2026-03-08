// types/next-auth.d.ts
import { DefaultSession } from "next-auth"

declare module "next-auth" {
    interface Session {
        user: {
            isOAuth: boolean;
        } & DefaultSession["user"]
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        isOAuth?: boolean;
    }
}