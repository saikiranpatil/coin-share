"use client";
import React, { useState } from 'react';

import { cn } from '@/lib/utils';

import {
    Edit,
    Edit2,
    Eye,
    Trash
} from 'lucide-react';

import { changeUserAvatar } from '@/lib/actions/user';

import {
    Avatar,
    AvatarImage
} from '@/components/ui/avatar';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from '../ui/use-toast';

import ViewAvatarModal from './view-avatar-modal';

interface EditAvatarProps extends React.HTMLAttributes<HTMLDivElement> {
    id: string;
    type: editAvatarType;
    imageUrl: string | undefined;
}

const EditAvatar = React.forwardRef<HTMLDivElement, EditAvatarProps>(({ id, type, imageUrl, children, className, ...props }, ref) => {
    const [open, setOpen] = useState(false);

    const onUpdateAvatarClick = async (image: string | undefined) => {
        toast({
            description: "Updating User Avatar..."
        })

        const { error, success } = await changeUserAvatar(id, type, image);
        if (error) {
            toast({
                title: "Error",
                description: error
            })
        }

        if (success) {
            toast({
                title: "Sucess",
                description: success
            })
        }
    }

    const onChangeAvatarClick = () => {
        let input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.onchange = (e) => handleImageFileChange(e as unknown as React.ChangeEvent<HTMLInputElement>);
        input.click();
    }

    const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target && e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            if (!file.type.startsWith("image/")) {
                return toast({
                    title: "Error",
                    description: "Inlvalid Image Format"
                });
            }

            const reader = new FileReader();
            reader.onload = async () => {
                if (reader.readyState === 2) {
                    const result = reader.result as string;
                    await onUpdateAvatarClick(result);
                }
            };

            reader.readAsDataURL(file);
        }
    }

    return (
        <Avatar
            ref={ref}
            className={cn("relative inline-block h-48 w-48 z-[1] m-6 border group/editavatar", className)}
            {...props}
        >
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <div className="absolute top-0 w-full h-full bg-accent flex justify-center items-center opacity-0 group-hover/editavatar:opacity-80 transition-all ease-in cursor-pointer">
                        <Edit2 size="24" />
                    </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    {
                        imageUrl &&
                        <>
                            <DropdownMenuItem onClick={() => onUpdateAvatarClick(undefined)}>
                                <Trash className="mr-2 h-4 w-4" />
                                <span>Remove Image</span>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                        </>
                    }
                    <DropdownMenuItem onClick={() => setOpen(true)}>
                        <Eye className="mr-2 h-4 w-4" />
                        <span>View Image</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={onChangeAvatarClick}>
                        <Edit className="mr-2 h-4 w-4" />
                        <span>Change Image</span>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
            <ViewAvatarModal imageUrl={imageUrl} open={open} setOpen={setOpen} />
            <AvatarImage className="absolute top-0 -z-40" src={imageUrl || "/default_user.png"} />
        </Avatar>
    )
});

EditAvatar.displayName = "EditAvatar";

export default EditAvatar