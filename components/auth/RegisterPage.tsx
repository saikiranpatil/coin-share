"use client"

import { useState, useTransition } from "react";

import { useForm } from 'react-hook-form'
import { zodResolver } from "@hookform/resolvers/zod"
import { RegisterSchema, type registerType } from "@/lib/schemas/register";

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"

import AuthenticationCard from "@/components/auth-card/AuthCard";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import FormError from "../form/FormError";
import FormSuccess from "../form/FormSucess";

import { register } from "@/lib/actions/register";
import { redirect } from "next/navigation";

const RegisterPage = () => {
    const [isPending, startTransation] = useTransition();

    const [formError, setFormError] = useState<string | undefined>("");
    const [formSuccess, setFormSuccess] = useState<string | undefined>("");

    const form = useForm<registerType>({
        resolver: zodResolver(RegisterSchema),
        defaultValues: {
            email: "",
            password: ""
        }
    });

    const onSubmit = (values: registerType) => {
        setFormError("");
        setFormSuccess("");

        startTransation(async () => {
            const { error, success } = await register(values);

            if (!error && success) {
                redirect("/dashboard");
            }
            
            setFormError(error);
            setFormSuccess(success);
        });
    }

    return (
        <main className="flex flex-1 justify-center items-center">
            <AuthenticationCard
                headerLabel="Create account"
                backButtonLabel="Already have an account?"
                backButtonHref="/auth/login"
                showSocial
            >
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <div className="space-y-4">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Name</FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                type="text"
                                                placeholder="Mahesh Kumar"
                                                disabled={isPending}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                type="email"
                                                placeholder="sample@sample.com"
                                                disabled={isPending}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Password</FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                type="password"
                                                placeholder="******"
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
                            Create Account
                        </Button>
                    </form>
                </Form>
            </AuthenticationCard>
        </main>
    )
}

export default RegisterPage
