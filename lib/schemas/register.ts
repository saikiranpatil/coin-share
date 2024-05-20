import * as z from "zod";

export const RegisterSchema = z.object({
    name: z.string().min(2, { message: "Name is required" }),
    email: z.string().email(),
    password: z.string().min(6, { message: "Minimum of 6 characters required" })
})

export type registerType = z.infer<typeof RegisterSchema>