import * as z from "zod";

export const CreateGroupSchema = z.object({
    name: z.string().min(3, "Name should be atleast 3 characters"),
    image: z.string().optional().refine((value) => {
        if (!value) return;
        const base64Size = (value.length * (3 / 4)) - (value.endsWith('==') ? 2 : (value.endsWith('=') ? 1 : 0));
        return base64Size <= 2000 * 1024;
    }, "File size should be less than 2MB"),
})

export type createGroupSchemaType = z.infer<typeof CreateGroupSchema>