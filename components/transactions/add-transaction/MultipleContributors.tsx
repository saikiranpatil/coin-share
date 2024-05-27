"use client";

import { Button } from "@/components/ui/button"
import {
    AvatarImage,
    AvatarFallback,
    Avatar
} from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { ChevronsUpDown, X } from "lucide-react";

import { ScrollArea } from "@/components/ui/scroll-area";
import { useStepper } from "@/components/stepper";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useEffect, useState } from "react";
import SelectUser from "@/components/select-user";
import { Card } from "@/components/ui/card";
import FormError from "@/components/form/FormError";

const MultipleContributors = ({ users, transactionData, setTransactionData }) => {
    const {
        nextStep,
        prevStep,
        isDisabledStep,
    } = useStepper();

    const totalAmount = transactionData.basicDetails?.amount || 0;
    const [selectedAmount, setSelectedAmount] = useState(0);
    const [leftAmount, setLeftAmount] = useState(0);

    const [errorState, setErrorState] = useState<string | undefined>(undefined);

    const [amountErrors, setAmountErrors] = useState({});
    const [multipleContributors, setMultipleContributors] = useState(transactionData.contributors.multiple);

    const [filteredMultipleContributors, setFilteredMultipleContributors] = useState([]);

    const onMultipleUserSelect = (user) => {
        if (!multipleContributors.some(contributor => contributor.id === user.id)) {
            setMultipleContributors([...multipleContributors, { ...user, amount: 0 }]);
        }
    }

    const onUserRemoveClick = (userId) => {
        const updatedMultipleContributors = multipleContributors.filter(contributor => contributor.id !== userId);
        setMultipleContributors(updatedMultipleContributors);
    }

    const handleAmountChange = (userId, amount) => {
        const updatedContributors = multipleContributors.map(contributor =>
            contributor.id === userId ? { ...contributor, amount: parseFloat(amount) || 0 } : contributor
        );
        setMultipleContributors(updatedContributors);
    }

    const onNextClick = () => {
        let hasError = false;
        const errors = {};

        multipleContributors.forEach(contributor => {
            if (contributor.amount <= 0) {
                errors[contributor.id] = "Amount cannot be 0";
                hasError = true;
            }
        });

        setAmountErrors(errors);

        if (!hasError) {
            if (leftAmount) {
                setErrorState("Total Amount is not Equal to Selected Amount");
                return;
            }

            setTransactionData({
                ...transactionData,
                contributors: {
                    ...transactionData.contributors,
                    multiple: multipleContributors,
                    isMultiple: true
                }
            });
            nextStep();
        }
    }

    useEffect(() => {
        const totalSelected = multipleContributors.reduce((total, contributor) => total + contributor.amount, 0);
        setSelectedAmount(totalSelected);
        setLeftAmount(totalAmount - totalSelected);
    }, [multipleContributors, totalAmount, leftAmount]);

    useEffect(() => {
        const newFilteredMultipleContributors = users.filter(user =>
            !multipleContributors.some(contributor => contributor.id === user.id)
        );
        setFilteredMultipleContributors(newFilteredMultipleContributors);
    }, [users, multipleContributors]);

    

    return (
        <div className="space-y-4">
            <SelectUser users={filteredMultipleContributors} setClickedUser={onMultipleUserSelect} >
                <Card className="w-full justify-between">
                    <Button
                        variant="outline"
                        className="w-full justify-between"
                    >
                        Add Contributor...
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                </Card>
            </SelectUser>
            {multipleContributors.length > 0 &&
                <ScrollArea className="h-40 rounded-md border py-1 pt-4 mt-4">
                    <div className="w-[max-content] mx-auto">
                        {multipleContributors.map((contributor, idx) => (
                            <div key={"usercardcontributors" + idx} className="w-full">
                                <Label className="flex justify-between items-center gap-4">
                                    <div className="flex items-center gap-2">
                                        <Avatar className="w-12 h-12 rounded-full mr-2">
                                            <AvatarImage alt="User Avatar" src="/placeholder.svg" />
                                            <AvatarFallback>ED</AvatarFallback>
                                        </Avatar>
                                        <span className="text-gray-900 dark:text-gray-100">{contributor.name}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Input
                                            className="w-24"
                                            placeholder="Amount"
                                            type="number"
                                            min="0"
                                            value={contributor.amount}
                                            onChange={(e) => handleAmountChange(contributor.id, e.target.value)}
                                        />
                                        <Button size="icon" variant="secondary" onClick={() => onUserRemoveClick(contributor.id)}><X size="16" /></Button>
                                    </div>
                                </Label>
                                {amountErrors[contributor.id] && (
                                    <div className="pt-2">
                                        <FormError message={amountErrors[contributor.id]} />
                                    </div>
                                )}
                                <Separator className="my-4" />
                            </div>
                        ))}
                    </div>
                </ScrollArea>
            }
            <div className="flex flex-col gap-4 my-4 text-sm">
                <div className="flex items-center justify-between">
                    <span className="text-gray-500 dark:text-gray-400">Total Amount:</span>
                    <span className="font-medium">₹{totalAmount}</span>
                </div>
                <div className="flex items-center justify-between">
                    <span className="text-gray-500 dark:text-gray-400">Selected Total:</span>
                    <span className="font-medium">₹{selectedAmount}</span>
                </div>
                <div className={`flex items-center justify-between ${leftAmount ? "text-red-500" : "text-muted-foreground"}`}>
                    <span>Left Amount:</span>
                    <span className="font-medium">₹{leftAmount}</span>
                </div>
            </div>
            <FormError message={errorState} />
            <div className="flex justify-end w-full gap-4">
                <Button
                    disabled={isDisabledStep}
                    onClick={prevStep}
                    variant="secondary"
                >
                    Prev
                </Button>
                <Button onClick={onNextClick}>
                    Next
                </Button>
            </div>
        </div>
    )
}

export default MultipleContributors;