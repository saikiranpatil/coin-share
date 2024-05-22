import * as z from "zod";

export const AddTransactionSchema = z.object({
    type: z.enum(["PAYMENT", "SETTLEMENT"]).optional(),
    description: z.string().min(5, "Description should be atleast 5 charaters"),
    amount: z.string(), 
    groupId: z.string(),
    image: z.string().optional()
})

export type addTransactionSchemaType = z.infer<typeof AddTransactionSchema>