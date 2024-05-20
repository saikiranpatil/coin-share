import {
  Avatar,
  AvatarFallback,
  AvatarImage
} from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const GroupMembersCard = () => {
    return (
        <>
            <Link
                className="flex items-center gap-4 rounded-md bg-gray-100 p-4 transition-colors hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700"
                href="#"
            >
                <Avatar className="hidden h-9 w-9 sm:flex">
                    <AvatarImage alt="Avatar" src="https://github.com/shadcn.png" />
                    <AvatarFallback>OM</AvatarFallback>
                </Avatar>
                <div className="grid gap-1 flex-1">
                    <p className="text-sm font-medium leading-none">Acme Design Team</p>
                    <p className="text-sm text-muted-foreground">sample@sample.com</p>
                </div>
                <div className="flex flex-col items-end gap-1">
                    <span className="text-xs font-medium text-red-500">You owe $500</span>
                    <Button variant="outline" size="sm">Remind</Button>
                </div>
            </Link>
            <Link
                className="flex items-center gap-4 rounded-md bg-gray-100 p-4 transition-colors hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700"
                href="#"
            >
                <Avatar className="hidden h-9 w-9 sm:flex">
                    <AvatarImage alt="Avatar" src="https://github.com/shadcn.png" />
                    <AvatarFallback>JL</AvatarFallback>
                </Avatar>
                <div className="grid gap-1 flex-1">
                    <p className="text-sm font-medium leading-none">Marketing Mavens</p>
                    <p className="text-sm text-muted-foreground">sample@sample.com</p>
                </div>
                <div className="flex flex-col items-end gap-1">
                    <span className="text-xs font-medium text-green-500">You get $200</span>
                    <Button variant="outline" size="sm">Settle</Button>
                </div>
            </Link>
            <Link
                className="flex items-center gap-4 rounded-md bg-gray-100 p-4 transition-colors hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700"
                href="#"
            >
                <Avatar className="hidden h-9 w-9 sm:flex">
                    <AvatarImage alt="Avatar" src="https://github.com/shadcn.png" />
                    <AvatarFallback>IN</AvatarFallback>
                </Avatar>
                <div className="grid gap-1 flex-1">
                    <p className="text-sm font-medium leading-none">Product Pioneers</p>
                    <p className="text-sm text-muted-foreground">sample@sample.com</p>
                </div>
                <div className="flex flex-col items-end gap-1">
                    <span className="text-xs font-medium text-gray-500">All settled</span>
                </div>
            </Link>
        </>

    )
}

export default GroupMembersCard
