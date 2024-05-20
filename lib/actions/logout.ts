"use server";

import { signOut } from "@/lib/db/auth";

export const logout = async () => {
    await signOut();
}