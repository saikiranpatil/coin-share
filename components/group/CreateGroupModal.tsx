"use client"

import { useState, useTransition } from "react"
import { MdOutlineGroupAdd } from "react-icons/md"

import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"

import { createGroup } from "@/lib/actions/group"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { CreateGroupSchema, type createGroupSchemaType } from "@/lib/schemas/group"

import FormError from "../form/FormError"
import FormSuccess from "../form/FormSucess"

import { redirect } from "next/navigation"

const CreateGroupModal = () => {
    const [isPending, startTransation] = useTransition();

    const [formError, setFormError] = useState<string | undefined>(undefined);
    const [formSuccess, setFormSuccess] = useState<string | undefined>(undefined);

    const form = useForm<createGroupSchemaType>({
        resolver: zodResolver(CreateGroupSchema),
        defaultValues: {
            name: "",
            image: ""
        }
    });

    const onSubmit = (values: createGroupSchemaType) => {
        setFormError(undefined);
        setFormSuccess(undefined);

        startTransation(async () => {
            const res = await createGroup(values);
            const { error, success, groupId } = res;

            if (success) {
                redirect("/group/" + groupId);
            }

            setFormError(error);
            setFormSuccess(success);
        });
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button>
                    <MdOutlineGroupAdd size="18" className="mr-2" />
                    Create Group
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Create Group</DialogTitle>
                    <DialogDescription>
                        Fill the details below to create group
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <div className="space-y-4">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Group Name</FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                type="text"
                                                placeholder="Goa Trip"
                                                disabled={isPending}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="image"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Image</FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                type="file"
                                                disabled={isPending}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <FormError message={formError} />
                        <FormSuccess message={formSuccess} />
                        <Button
                            type="submit"
                            className="w-full"
                            disabled={isPending}
                        >
                            Login
                        </Button>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}

export default CreateGroupModal
