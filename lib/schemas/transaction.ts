import * as z from "zod";

export const AddTransactionSchema = z.object({
    type: z.enum(["Payment", "Settlement"]).default("Payment"),
    description: z.string().min(5, "Description should be atleast 5 charaters"),
    amount: z.string(),
    groupId: z.string(),
    image: z.string().optional()
})
export type addTransactionSchemaType = z.infer<typeof AddTransactionSchema>;

export const TransactionMembersSchema = z.array(z.object({
    userId: z.string(),
    name: z.string(),
    amount: z.number(),
}));
export type TransactionMembersSchema = z.infer<typeof TransactionMembersSchema>;