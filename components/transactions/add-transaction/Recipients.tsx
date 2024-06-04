"use client";

import { useRouter } from "next/navigation";
import { createTransaction } from "@/lib/actions/transaction";

import { useEffect, useState, useTransition } from "react";

import { Button } from "@/components/ui/button"
import {
  AvatarImage,
  AvatarFallback,
  Avatar
} from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ChevronsUpDown, X } from "lucide-react";
import SelectUser from "@/components/select-user";
import { useStepper } from "@/components/stepper";
import { toast } from "@/components/ui/use-toast";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";

import FormError from "@/components/form/FormError";

interface RecipientsProps {
  transactionData: AddTransactionDataProps;
  setTransactionData: (values: AddTransactionDataProps) => void;
  users: UserSelectListProps[];
}

const Recipients = ({ users, transactionData, setTransactionData }: RecipientsProps) => {
  const router = useRouter();

  const [isPending, startTransation] = useTransition();

  const {
    prevStep,
    isDisabledStep,
  } = useStepper();

  const totalAmount: number = transactionData.basicDetails?.amount ? Number(transactionData.basicDetails.amount) : 0;
  const [selectedAmount, setSelectedAmount] = useState(0);
  const [leftAmount, setLeftAmount] = useState(0);

  const [errorState, setErrorState] = useState<string | undefined>(undefined);

  const [amountErrors, setAmountErrors] = useState<{ [key: string]: string }>({});
  const [recipients, setRecipients] = useState<AddTransactionDataMembersProps[]>([]);

  const [filteredRecipients, setFilteredRecipients] = useState<UserSelectListProps[]>([]);

  useEffect(() => {
    const selectedUsers = transactionData.contributors.isMultiple
      ? transactionData.contributors.multiple ?? []
      : transactionData.contributors.single
        ? [transactionData.contributors.single]
        : [];

    const filteredUsers = users
      .filter(user => !selectedUsers.some(selectedUser => selectedUser.id === user.id))
      .filter(user => !recipients.some(recipient => recipient.id === user.id));

    setFilteredRecipients(filteredUsers);
  }, [users, transactionData, recipients]);

  const onUserSelect = (user: UserSelectListProps) => {
    if (!recipients.some(recipients => recipients.id === user.id)) {
      setRecipients([...recipients, { ...user, amount: 0 }]);
    }
  }

  const onUserRemoveClick = (userId: string) => {
    const updatedMultipleContributors = recipients.filter(recipients => recipients.id !== userId);
    setRecipients(updatedMultipleContributors);
  }

  const handleAmountChange = (userId: string, amount: string) => {
    const updatedRecipients = recipients.map(recipients =>
      recipients.id === userId ? { ...recipients, amount: parseFloat(amount) || 0 } : recipients
    );
    setRecipients(updatedRecipients);
  }

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    let hasError = false;
    const errors: { [key: string]: string } = {};

    recipients.forEach(recipient => {
      if (recipient.amount <= 0) {
        errors[recipient.id] = "Amount cannot be 0";
        hasError = true;
      }
    });

    setAmountErrors(errors);

    if (!hasError) {
      if (leftAmount) {
        setErrorState("Total Amount is not Equal to Selected Amount");
        return;
      }

      const finalTransactionData = {
        ...transactionData,
        recipients
      };
      setTransactionData(finalTransactionData);

      startTransation(async () => {
        const res = await createTransaction(finalTransactionData);

        if (res.success) {
          router.push("/group/" + res.transaction.groupId);

          toast({
            title: "Success",
            description: "Transaction created sucessfully",
          });
        }

        if (res.error) {
          setErrorState(res.error);
        }
      });
    }
  }

  useEffect(() => {
    let hasError = false;
    const errors: { [key: string]: string } = {};

    recipients.forEach(recipient => {
      if (recipient.amount <= 0) {
        errors[recipient.id] = "Amount cannot be 0";
        hasError = true;
      }
    });

    setAmountErrors(errors);

    if (leftAmount) {
      setErrorState("Total Amount is not Equal to Selected Amount");
    } else {
      setErrorState(undefined);
    }
  }, [transactionData, recipients, leftAmount])


  useEffect(() => {
    const totalSelected = recipients.reduce((total, contributor) => total + contributor.amount, 0);
    setSelectedAmount(totalSelected);
    setLeftAmount(totalAmount - totalSelected);
  }, [recipients, totalAmount, leftAmount]);

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <SelectUser users={filteredRecipients} setClickedUser={onUserSelect} >
        <Card className="w-full justify-between">
          <Button
            variant="outline"
            className="w-full justify-between"
            disabled={isPending}
          >
            Add Contributor...
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </Card>
      </SelectUser>
      {recipients.length > 0 &&
        <ScrollArea className="h-40 rounded-md border py-1 pt-4 mt-4">
          <div className="w-[max-content] mx-auto">
            {recipients.map((recipient, idx) => (
              <div key={"usercardcontributors" + idx} className="w-full">
                <Label className="flex justify-between items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Avatar className="w-12 h-12 rounded-full mr-2">
                      <AvatarImage alt="User Avatar" src="/placeholder.svg" />
                      <AvatarFallback>ED</AvatarFallback>
                    </Avatar>
                    <span className="text-gray-900 dark:text-gray-100">{recipient.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Input
                      className="w-24"
                      placeholder="Amount"
                      type="number"
                      min="0"
                      value={recipient.amount}
                      onChange={(e) => handleAmountChange(recipient.id, e.target.value)}
                      disabled={isPending}
                    />
                    <Button size="icon" variant="secondary" onClick={() => onUserRemoveClick(recipient.id)}><X size="16" /></Button>
                  </div>
                </Label>
                {amountErrors[recipient.id] && (
                  <div className="pt-2">
                    <FormError message={amountErrors[recipient.id]} />
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
      <FormError message={selectedAmount && errorState} />
      <div className="flex justify-end w-full gap-4">
        <Button
          disabled={isDisabledStep}
          onClick={prevStep}
          variant="secondary"
        >
          Prev
        </Button>
        <Button
          type="submit"
          disabled={isPending}
        >
          Next
        </Button>
      </div>
    </form>
  )
}

export default Recipients;