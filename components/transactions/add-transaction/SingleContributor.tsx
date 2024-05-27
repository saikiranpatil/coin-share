"use client";

import { useEffect, useState } from "react";

import { ChevronsUpDown, Edit2 } from "lucide-react";

import {
    AvatarImage,
    AvatarFallback,
    Avatar
} from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button"

import { useStepper } from "@/components/stepper";
import SelectUser from "@/components/select-user";

interface SingleContributorProps {
    transactionData: AddTransactionDataProps;
    setTransactionData: (values: AddTransactionDataProps) => void;
    users: UserSelectListProps[];
}

const SingleContributor = ({ users, transactionData, setTransactionData }: SingleContributorProps) => {
    const {
        nextStep,
        prevStep,
        isDisabledStep,
    } = useStepper();
    const [singleContributor, setSingleContributor] = useState<UserSelectListProps | undefined>(transactionData.contributors.single);
    const [filteredSingleContributors, setFilteredSingleContributors] = useState<UserSelectListProps[]>([]);

    useEffect(() => {
        const newFilteredSingleContributors = users
            .filter(user => user.id !== singleContributor?.id);
        setFilteredSingleContributors(newFilteredSingleContributors);
    }, [users, singleContributor]);

    const onNextClick = () => {
        setTransactionData({
            ...transactionData,
            contributors: {
                ...transactionData.contributors,
                single: singleContributor,
                isMultiple: false,
            }
        });

        nextStep();
    }

    return (
        <>
            <SelectUser users={filteredSingleContributors} setClickedUser={setSingleContributor} >
                <Card
                    className="w-full justify-between"
                >
                    {singleContributor ?
                        (
                            <div className="max-w-80 mx-auto flex justify-center items-center gap-4 p-2 cursor-pointer">
                                <Avatar className="w-12 h-12 rounded-full mr-2">
                                    <AvatarImage alt="User Avatar" src="/placeholder.svg" />
                                    <AvatarFallback>ED</AvatarFallback>
                                </Avatar>
                                <span className="text-gray-900 dark:text-gray-100">{singleContributor.name}</span>
                                <Edit2 className="h-4 w-4 shrink-0 opacity-50" />
                            </div>
                        )
                        :
                        (
                            <Button
                                variant="outline"
                                className="w-full justify-between"
                            >
                                Add Contributor...
                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                        )
                    }
                </Card>
            </SelectUser>
            <div className="flex justify-end w-full gap-4 pt-4">
                <Button
                    disabled={isDisabledStep}
                    onClick={prevStep}
                    variant="secondary"
                >
                    Prev
                </Button>
                <Button
                    onClick={onNextClick}
                    disabled={!singleContributor}
                >
                    Next
                </Button>
            </div>
        </>

    )
}

export default SingleContributor
