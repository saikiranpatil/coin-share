"use client";

import { Button } from "@/components/ui/button"
import {
    AvatarImage,
    AvatarFallback,
    Avatar
} from "@/components/ui/avatar";
import { ChevronsUpDown, Edit2 } from "lucide-react";

import { useStepper } from "@/components/stepper";
import { useEffect, useState } from "react";
import SelectUser from "@/components/select-user";
import { Card } from "@/components/ui/card";

const SingleContributer = ({ users, transactionData, setTransactionData }) => {
    const {
        nextStep,
        prevStep,
        isDisabledStep,
    } = useStepper();
    const [singleContributer, setSingleContributer] = useState<UserSelectListProps | undefined>(transactionData.contributers.single);
    const [filteredSingleContributers, setFilteredSingleContributers] = useState<UserSelectListProps[]>([]);

    useEffect(() => {
        const newFilteredSingleContributers = users
            .filter(user => user.id !== singleContributer?.id);
        setFilteredSingleContributers(newFilteredSingleContributers);
    }, [users, singleContributer]);

    const onNextClick = () => {
        setTransactionData({
            ...transactionData,
            contributers: {
                ...transactionData.contributers,
                single: singleContributer,
                isMultiple: false,
            }
        });

        nextStep();
    }

    return (
        <>
            <SelectUser users={filteredSingleContributers} setClickedUser={setSingleContributer} >
                <Card
                    className="w-full justify-between"
                >
                    {singleContributer ?
                        (
                            <div className="max-w-80 mx-auto flex justify-center items-center gap-4 p-2 cursor-pointer">
                                <Avatar className="w-12 h-12 rounded-full mr-2">
                                    <AvatarImage alt="User Avatar" src="/placeholder.svg" />
                                    <AvatarFallback>ED</AvatarFallback>
                                </Avatar>
                                <span className="text-gray-900 dark:text-gray-100">{singleContributer.name}</span>
                                <Edit2 className="h-4 w-4 shrink-0 opacity-50" />
                            </div>
                        )
                        :
                        (
                            <Button
                                variant="outline"
                                className="w-full justify-between"
                            >
                                Add Contributer...
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
                    disabled={!singleContributer}
                >
                    Next
                </Button>
            </div>
        </>

    )
}

export default SingleContributer
