"use client"

import {
    DumbbellIcon,
    IndianRupee,
} from "lucide-react"
import {
    SelectValue,
    SelectTrigger,
    SelectItem,
    SelectContent,
    Select,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle
} from "@/components/ui/card"

import AddContributers from "@/components/transactions/AddContributers"
import AddRecipients from "@/components/transactions/AddRecipients"
import {
    AddTransactionSchema,
    addTransactionSchemaType
} from "@/lib/schemas/transaction"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import React, {
    useEffect,
    useState,
    useTransition
} from "react"
import { createTransaction } from "@/lib/actions/transaction"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from "../ui/form"

import FormError from "../form/FormError"
import FormSuccess from "../form/FormSucess"

import { getAllGroupsTitle } from "@/lib/actions/group"
import { Textarea } from "../ui/textarea"
import { redirect } from "next/navigation"
import { toast } from "../ui/use-toast"

interface groupSelectListProps {
    id: string;
    name: string;
}

const AddTransactionPage = () => {

    const [isPending, startTransation] = useTransition();

    const [groupsList, setGroupsList] = useState<groupSelectListProps[]>([]);
    const [areGroupsLoading, setAreGroupsLoading] = useState<boolean>(false);

    const [formError, setFormError] = useState<string | undefined>(undefined);
    const [formSuccess, setFormSuccess] = useState<string | undefined>(undefined);

    const [contributers, setContributers] = useState([]);
    const [receipients, setReceipients] = useState([]);

    const form = useForm<addTransactionSchemaType>({
        resolver: zodResolver(AddTransactionSchema),
        defaultValues: {
            type: "SETTLEMENT",
            description: "",
            amount: undefined,
        }
    });

    const onSubmit = (values: addTransactionSchemaType) => {
        setFormError(undefined);
        setFormSuccess(undefined);

        startTransation(async () => {
            const data = await createTransaction(values);

            if (!data.error) {
                toast({
                    title: "Success",
                    description: "Transaction created Sucessfully!"
                })

                if (data.transaction?.groupId) {
                    redirect("/group/" + data.transaction.groupId);
                } else {
                    redirect("/");
                }
            }

            setFormError(data?.error);
            setFormSuccess(data?.success);
        });
    }

    useEffect(() => {
        const fetchGroups = async () => {
            setAreGroupsLoading(true);
            const { error, groups } = await getAllGroupsTitle() as { error: string | undefined, groups: groupSelectListProps[] | undefined };
            setAreGroupsLoading(false);

            if (!error && groups) setGroupsList(groups);
        };
        fetchGroups();
    }, []);

    return (
        <div className="container mx-auto px-4 py-8 md:py-12 lg:py-16">
            <div className="max-w-2xl mx-auto">
                <Card>
                    <CardHeader>
                        <CardTitle>Add Transaction</CardTitle>
                        <CardDescription>Record a new transaction for your group.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                                <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 ">
                                    <div className="min-h-[30vmin] border rounded-sm relative group/editavatar flex justify-center">
                                        <span className="absolute bg-accent w-full h-full flex justify-center items-center opacity-0 group-hover/editavatar:opacity-80 transition-all ease-in">
                                            Change
                                        </span>
                                        <DumbbellIcon className="w-auto h-full text-gray-400 p-6" />
                                    </div>
                                    <div className="space-y-4">
                                        <div>
                                            <FormField
                                                control={form.control}
                                                name="groupId"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Group</FormLabel>
                                                        <Select
                                                            onValueChange={field.onChange}
                                                            defaultValue={field.value}
                                                            value={field.value}
                                                        >
                                                            <FormControl>
                                                                <SelectTrigger>
                                                                    <SelectValue placeholder="Select Group" />
                                                                </SelectTrigger>
                                                            </FormControl>
                                                            <SelectContent>
                                                                {groupsList?.length && !areGroupsLoading ?
                                                                    groupsList.map((group) => (
                                                                        <SelectItem key={group.id} value={group.id}>
                                                                            {group.name}
                                                                        </SelectItem>
                                                                    )) :
                                                                    <h1 className="text-xs text-muted-foreground">
                                                                        Loading Groups
                                                                    </h1>
                                                                }
                                                            </SelectContent>
                                                        </Select>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                        <FormField
                                            control={form.control}
                                            name="description"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Transaction Title</FormLabel>
                                                    <FormControl>
                                                        <Textarea
                                                            {...field}
                                                            placeholder="Enter transaction description"
                                                            disabled={isPending}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="amount"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Transaction Amount</FormLabel>
                                                    <FormControl>
                                                        <div className="relative flex-1">
                                                            <IndianRupee className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                                            <Input
                                                                {...field}
                                                                type="number"
                                                                className="pl-8"
                                                                placeholder="Enter transaction amount"
                                                                disabled={isPending}
                                                            />
                                                        </div>
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                    <div>
                                        <AddContributers setContributers={setContributers} />
                                    </div>
                                    <div>
                                        <AddRecipients setReciepents={setReceipients} />
                                    </div>
                                </div>
                                <div className="flex flex-col gap-4 justify-end ">
                                    <FormError message={formError} />
                                    <FormSuccess message={formSuccess} />
                                </div>
                                <div className="flex justify-end">
                                    <Button type="submit">
                                        Save Transaction
                                    </Button>
                                </div>
                            </form>
                        </Form>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}


export default AddTransactionPage;