"use client";

import { useParams } from "next/navigation"
import { useEffect, useState } from "react"

import {
    addUserToGroup,
    allAddGroupMembers
} from "@/lib/actions/user"

import { UserPlus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/use-toast"
import SelectUser from "@/components/select-user"

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

