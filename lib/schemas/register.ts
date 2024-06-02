import * as z from "zod";

export const RegisterSchema = z.object({
    name: z.string().min(2, { message: "Name is required" }),
    email: z.string().email(),
    password: z.string().min(6, { message: "Minimum of 6 characters required" }),
    avatar: z.string().optional().refine((value) => {
        if (!value) return;
        const base64Size = (value.length * (3 / 4)) - (value.endsWith('==') ? 2 : (value.endsWith('=') ? 1 : 0));
        return base64Size <= 2000 * 1024;
    }, "File size should be less than 2MB"),
})

export type registerType = z.infer<typeof RegisterSchema>