"use client";

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogFooter, DialogTrigger } from "@/components/ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
                toast({ description: "Creating payment..." });
            }

            if (data?.success) {
                setOpen(false);
                toast({ title: "Success", description: "Payment recorded successfully!" });
                redirect("/dashboard");
            }

            setFormError(data?.error);
            setFormSuccess(data?.success);
        });
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm" disabled={tag === "settled"}>
                    Settle Up
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[380px]">
                <div className="flex flex-col items-center gap-4 pt-2 text-center">
                    <Avatar className="h-20 w-20">
                        <AvatarImage alt="Avatar" src={groupMember.imageUrl || "/default_user.png"} />
                        <AvatarFallback>OM</AvatarFallback>
                    </Avatar>
                    <div>
                        <p className="font-medium">{groupMember.name}</p>
                        <p className="text-xs text-muted-foreground">{groupMember.email}</p>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                        <span className="text-foreground font-medium">
                            {tag === "owe" ? "You paid" : "Paid you"} ₹
                        </span>
                        <Input
                            type="number"
                            min={1}
                            value={amount}
                            onChange={(e) => setAmount(Number(e.target.value))}
                            className="max-w-24"
                            disabled={isPending}
                        />
                    </div>
                    <div className="w-full space-y-2">
                        <FormError message={formError} />
                        <FormSuccess message={formSuccess} />
                    </div>
                </div>
                <DialogFooter className="sm:justify-center">
                    <Button onClick={onSubmitClick} disabled={isPending} className="w-full">
                        Record Payment
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default GroupSettlementModal