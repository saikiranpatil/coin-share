"use client"

import {
    useEffect,
    useState,
} from "react"

import {
    DumbbellIcon,
    IndianRupee,
} from "lucide-react"

import {
    AddTransactionSchema,
    addTransactionSchemaType
} from "@/lib/schemas/transaction"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import {
    SelectValue,
    SelectTrigger,
    SelectItem,
    SelectContent,
    Select,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { useStepper } from "@/components/stepper"
import { Textarea } from "@/components/ui/textarea"
import { getAllGroupsTitle } from "@/lib/actions/group"

interface AddTransactionBasicDetailsProps {
    transactionData: AddTransactionDataProps;
    setTransactionData: (values: AddTransactionDataProps) => void;
}

const AddTransactionBasicDetails = ({ transactionData, setTransactionData }: AddTransactionBasicDetailsProps) => {
    const {
        nextStep,
        prevStep,
        isDisabledStep,
    } = useStepper();

    const [groupsList, setGroupsList] = useState<GroupSelectListProps[]>([]);
    const [areGroupsLoading, setAreGroupsLoading] = useState<boolean>(false);

    const form = useForm<addTransactionSchemaType>({
        resolver: zodResolver(AddTransactionSchema),
        defaultValues: transactionData.basicDetails,
    });

    const onSubmit = (values: addTransactionSchemaType) => {
        setTransactionData({ ...transactionData, basicDetails: values });
        nextStep();
    }

    useEffect(() => {
        const fetchGroups = async () => {
            setAreGroupsLoading(true);
            const { error, groups } = await getAllGroupsTitle() as { error: string | undefined, groups: GroupSelectListProps[] | undefined };
            setAreGroupsLoading(false);

            if (!error && groups) setGroupsList(groups);
        };
        fetchGroups();
    }, []);

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="min-h-[260px] space-y-6">
                <div className="grid gap-6 grid-flow-row sm:grid-flow-col">
                    {/* <div className="min-h-[30vmin] border rounded-sm relative group/editavatar flex justify-center">
                        <span className="absolute bg-accent w-full h-full flex justify-center items-center opacity-0 group-hover/editavatar:opacity-80 transition-all ease-in">
                            Change
                        </span>
                        <DumbbellIcon className="w-auto h-full text-gray-400 p-6" />
                    </div> */}
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
                                                    <h1 className="p-2 text-xs text-muted-foreground">
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
                                            />
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                </div>
                <div className="flex justify-end w-full gap-4">
                    <Button
                        disabled={isDisabledStep}
                        onClick={prevStep}
                        variant="secondary"
                    >
                        Prev
                    </Button>
                    <Button type="submit">
                        Next
                    </Button>
                </div>
            </form>
        </Form>
    )
}

export default AddTransactionBasicDetails
