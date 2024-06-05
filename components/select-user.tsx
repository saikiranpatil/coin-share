"use client";

import { Button } from "@/components/ui/button"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import {
    UserPlus,
} from "lucide-react"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { useState } from "react";

interface SelectUserProps {
    users: UserSelectListProps[],
    setClickedUser: (user: UserSelectListProps) => void,
    children: React.ReactNode;
}

const SelectUser = ({ users, setClickedUser, children }: SelectUserProps) => {
    const [open, setOpen] = useState(false);
    const onUserClick = (user: UserSelectListProps) => {
        setOpen(false);
        setClickedUser(user);
    }

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                {children}
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0 bg-transparent border-none shadow-none">
                <Command className="rounded-lg border shadow-md">
                    <CommandInput placeholder="Type name or email of user to search..." />
                    <CommandList>
                        <CommandEmpty>No users found.</CommandEmpty>
                        <CommandGroup>
                            {
                                users.map(user => (
                                    <CommandItem key={user.id}>
                                        <Avatar className='mr-4 h-12 w-12'>
                                            <AvatarImage className="rounded-full" src={user.imageUrl || "https://github.com/shadcn.png"} />
                                            <AvatarFallback>CN</AvatarFallback>
                                        </Avatar>
                                        <div
                                            className="flex flex-col"
                                            onClick={() => onUserClick(user)}
                                        >
                                            <span>
                                                {user.name}
                                            </span>
                                            <span className="text-xs text-muted-foreground">
                                                {user.email}
                                            </span>
                                        </div>
                                        <span></span>
                                    </CommandItem>
                                ))
                            }
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    )
}

export default SelectUser

