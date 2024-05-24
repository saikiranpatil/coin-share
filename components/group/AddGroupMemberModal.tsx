"use client";

import { useEffect, useState, useTransition } from "react"
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
    addUserToGroup,
    allAddGroupMembers
} from "@/lib/actions/user"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { toast } from "../ui/use-toast";
import { useParams } from "next/navigation";

interface AddGroupUsersProps {
    id: string;
    email: string;
    name: string;
    image: string;
}

const AddGroupMemberModal = () => {
    const { groupId }: { groupId: string } = useParams();

    const [users, setUsers] = useState<AddGroupUsersProps[]>([]);
    const [open, setOpen] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            const { users: usersData } = await allAddGroupMembers(groupId);

            if (usersData) {
                setUsers(usersData as AddGroupUsersProps[]);
            }
        }
        fetchData();
    }, [groupId]);

    const onAddUserToGroup = async (addMemberUserId: string) => {
        setOpen(false);
        toast({
            description: "Adding User to group"
        });

        const { success, error } = await addUserToGroup(groupId, addMemberUserId);

        if (success) {
            toast({
                title: "Success",
                description: "User Successfully added to the group"
            });
        }

        if (error) {
            toast({
                variant: "destructive",
                description: error
            })
        }
    }

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button>
                    <UserPlus size="16" className="mr-2" />
                    Add Member
                </Button>
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
                                            <AvatarImage className="rounded-full" src={user.image || "https://github.com/shadcn.png"} />
                                            <AvatarFallback>CN</AvatarFallback>
                                        </Avatar>
                                        <div
                                            className="flex flex-col"
                                            onClick={() => onAddUserToGroup(user.id)}
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

export default AddGroupMemberModal

