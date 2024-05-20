"use server";

import { signOut } from "@/db/auth";

export const logout = async () => {
    await signOut();
}