"use client";

import { useEffect, useState } from "react";
import { allGroupMembers } from "@/lib/actions/user";

import Recipients from "@/components/transactions/add-transaction/Recipients";
import BasicDetails from "@/components/transactions/add-transaction/BasicDetails";
import Contributors from "@/components/transactions/add-transaction/Contributors";

import {
    Step,
    Stepper,
    type StepItem,
} from "@/components/my-ui/stepper"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle
} from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";


const steps = [
    { label: "Basic Details" },
    { label: "Contributors" },
    { label: "Recipents" },
] satisfies StepItem[]

const AddTransactionPage = ({ groupId }: { groupId: string | undefined }) => {
    const [transactionData, setTransactionData] = useState<AddTransactionDataProps>({
        basicDetails: groupId ? { groupId } : undefined,
        contributors: { isMultiple: false },
        recipients: []
    });
    const [users, setUsers] = useState<UserSelectListProps[]>([]);

    useEffect(() => {
        const fetchUsers = async () => {
            if (!transactionData.basicDetails?.groupId) return;

            const { users: usersData, error } = await allGroupMembers(transactionData.basicDetails.groupId);

            if (error) {
                toast({
                    title: "Error",
                    description: error,
                })
            }
            if (usersData) {
                setUsers(usersData);
            }
        }

        fetchUsers();
    }, [transactionData.basicDetails?.groupId]);

    return (
        <div className="container mx-auto px-4 py-8 md:py-12 lg:py-16 max-w-xl">
            <Card>
                <CardHeader>
                    <CardTitle>Add Transaction</CardTitle>
                    <CardDescription>Record a new transaction for your group.</CardDescription>
                </CardHeader>
                <CardContent className="flex w-full flex-col gap-4 space-y-4">
                    <Stepper initialStep={0} steps={steps} variant="circle-alt">
                        <Step label="Basic Details">
                            <BasicDetails transactionData={transactionData} setTransactionData={setTransactionData} />
                        </Step>
                        <Step label="Contributors">
                            <Contributors transactionData={transactionData} setTransactionData={setTransactionData} users={users} />
                        </Step>
                        <Step label="Recipents">
                            <Recipients transactionData={transactionData} setTransactionData={setTransactionData} users={users} />
                        </Step>
                    </Stepper>
                </CardContent>
            </Card>
        </div>
    )
}

export default AddTransactionPage
