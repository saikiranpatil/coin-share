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
import SelectUser from "../select-user";

const AddGroupMemberModal = () => {
    const { groupId }: { groupId: string } = useParams();

    const [users, setUsers] = useState<UserSelectListProps[]>([]);
    const [selectedUser, setSelectedUser] = useState<UserSelectListProps | undefined>();

    useEffect(() => {
        const fetchData = async () => {
            const { users: usersData } = await allAddGroupMembers(groupId);

            if (usersData) {
                setUsers(usersData);
            }
        }
        fetchData();
    }, [groupId]);

    useEffect(() => {
        if (!selectedUser) return;

        const onAddUserToGroup = async (addMemberUserId: string) => {
            toast({
                description: "Adding User to group....."
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

        onAddUserToGroup(selectedUser.id);

        setSelectedUser(undefined);
    }, [selectedUser, groupId]);

    return (
        <SelectUser users={users} setClickedUser={setSelectedUser}>
            <Button size="sm">
                <UserPlus size="16" className="mr-2" />
                Add Member
            </Button>
        </SelectUser>
    )
}

export default AddGroupMemberModal

