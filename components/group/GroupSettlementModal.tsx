"use client";

import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogFooter,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    Avatar,
    AvatarFallback,
    AvatarImage
} from "@/components/ui/avatar";
import { Input } from "@/components/ui/input"
import { redirect, useParams } from "next/navigation";
import { useState, useTransition } from "react";
import FormError from "../form/FormError";
import FormSuccess from "../form/FormSucess";
import { makePayment } from "@/lib/actions/transaction";
import { toast } from "../ui/use-toast";

const GroupSettlementModal = ({ groupMember }: { groupMember: GroupMemberPageProps }) => {
    const [open, setOpen] = useState(false);

    const [isPending, startTransation] = useTransition();

    const [formError, setFormError] = useState<string | undefined>(undefined);
    const [formSuccess, setFormSuccess] = useState<string | undefined>(undefined);

    const { tag } = groupMember.status;
    const { groupId }: { groupId: string } = useParams();

    const [amount, setAmount] = useState(0);

    const onSubmitClick = () => {
        startTransation(async () => {
            const data = await makePayment(groupId, groupMember.id, amount, tag);

            if (amount && amount > 0) {
                toast({
                    description: "creating payment"
                });
            }

            if (data?.success) {
                setOpen(false);

                toast({
                    title: "Sucess",
                    description: "Payment created Sucessfully!"
                });
                redirect("/dashboard");
            }

            setFormError(data?.error);
            setFormSuccess(data?.success);
        });
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm" disabled={tag === "settled"}>Settled</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <div className="flex flex-col text-center">
                    <div className="flex flex-col items-center space-y-4">
                        <div className="space-y-2">
                            <Avatar className="hidden h-24 w-24 sm:flex">
                                <AvatarImage alt="Avatar" src={groupMember.imageUrl || "https://github.com/shadcn.png"} />
                                <AvatarFallback>OM</AvatarFallback>
                            </Avatar>
                            <p className="text-muted-foreground">
                                {groupMember.name}
                            </p>
                        </div>
                        <div className="text-sm flex items-center gap-2">
                            <p className="text-sm font-medium text-center text-foreground">
                                {tag === "owe" ? "You paid" : "Paid you"} Rs.
                            </p>
                            <Input
                                id="name"
                                type="number"
                                min={1}
                                value={amount}
                                onChange={(e) => setAmount(Number(e.target.value))}
                                defaultValue="Pedro Duarte"
                                className="max-w-24"
                                disabled={isPending}
                            />
                        </div>
                        <div className="w-full space-y-2">
                            <FormError message={formError} />
                            <FormSuccess message={formSuccess} />
                        </div>
                    </div>
                </div>
                <div className="mx-auto">
                    <Button
                        type="submit"
                        onClick={onSubmitClick}
                        disabled={isPending}
                    >
                        Record Payment
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default GroupSettlementModal
