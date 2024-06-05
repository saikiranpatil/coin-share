"use client";

import {
    Avatar,
    AvatarImage
} from '@/components/ui/avatar';
import {
    Edit,
    Edit2,
    Eye,
    Trash
} from 'lucide-react';

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from '@/lib/utils';
import React, { useState } from 'react';
import ViewAvatarModal from './view-avatar-modal';
import { changeUserAvatar } from '@/lib/actions/user';

interface EditAvatarProps extends React.HTMLAttributes<HTMLDivElement> {
    user: UserSelectListProps;
}

const onRemoveClick = async () => {
    await changeUserAvatar(undefined);
}

const EditAvatar = React.forwardRef<HTMLDivElement, EditAvatarProps>(({ user, children, className, ...props }, ref) => {
    const [open, setOpen] = useState(false);

    return (
        <Avatar
            ref={ref}
            className={cn("relative inline-block h-48 w-48 z-[1] m-6 border group/editavatar", className)}
            {...props}
        >
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <div className="absolute top-0 w-full h-full bg-accent flex justify-center items-center opacity-0 group-hover/editavatar:opacity-80 transition-all ease-in">
                        <Edit2 size="24" />
                    </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={onRemoveClick}>
                        <Trash className="mr-2 h-4 w-4" />
                        <span>Remove Image</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => setOpen(true)}>
                        <Eye className="mr-2 h-4 w-4" />
                        <span>View Image</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                        <Edit className="mr-2 h-4 w-4" />
                        <span>Change Image</span>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
            <ViewAvatarModal user={user} open={open} setOpen={setOpen} />
            <AvatarImage className="absolute top-0 -z-40" src={user.imageUrl || "https://github.com/shadcn.png"} />
        </Avatar>
    )
});

EditAvatar.displayName = "EditAvatar";

export default EditAvatar
