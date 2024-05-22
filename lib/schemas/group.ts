import * as z from "zod";

export const CreateGroupSchema = z.object({
    name: z.string().min(3, "Name should be atleast 3 characters"),
    image: z.string().optional()
})

export type createGroupSchemaType = z.infer<typeof CreateGroupSchema>