"use client"

import { redirect } from "next/navigation"
import { useState, useTransition } from "react"

import { createGroup } from "@/lib/actions/group"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { CreateGroupSchema, type createGroupSchemaType } from "@/lib/schemas/group"

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

import FormError from "@/components/form/FormError"
import FormSuccess from "@/components/form/FormSucess"

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

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const reader = new FileReader();

            reader.onload = () => {
                if (reader.readyState === 2) {
                    const result = reader.result as string;
                    form.setValue('image', result);
                }
            };

            reader.readAsDataURL(file);
        }
    };

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
                                render={({ field: { value, onChange, ...fieldProps } }) => (
                                    <FormItem>
                                        <FormLabel>Avatar</FormLabel>
                                        <FormControl>
                                            <Input
                                                {...fieldProps}
                                                type="file"
                                                placeholder="Group Image"
                                                accept="image/*"
                                                onChange={handleFileChange}
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
                            Submit
                        </Button>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}

export default CreateGroupModal
