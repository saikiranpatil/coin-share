import Link from "next/link"

import { ArrowUpRight } from 'lucide-react';

import { Button } from "@/components/ui/button"
import {
    AvatarImage,
    AvatarFallback,
    Avatar
} from "@/components/ui/avatar";
import CardWrapper from "./CardWrapper";

const GroupsCard = () => {
    const ViewAllGroupsButton = (
        <Button asChild className="ml-auto gap-1" size="sm">
            <Link href="/groups">
                View All
                <ArrowUpRight className="h-4 w-4" />
            </Link>
        </Button>
    );

    return (
        <CardWrapper
            cardTitle="Recent Groups"
            cardDescription="Recent groups you were part of."
            cardHeaderButton={ViewAllGroupsButton}
            className="col-span-1"
        >
            <div className="grid gap-4">
                <Link
                    className="flex items-center gap-4 rounded-md bg-gray-100 p-4 transition-colors hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700"
                    href="/group/asdasdasdsaads"
                >
                    <Avatar className="hidden h-9 w-9 sm:flex">
                        <AvatarImage alt="Avatar" src="https://github.com/shadcn.png" />
                        <AvatarFallback>OM</AvatarFallback>
                    </Avatar>
                    <div className="grid gap-1 flex-1">
                        <p className="text-sm font-medium leading-none">Acme Design Team</p>
                        <p className="text-sm text-muted-foreground">5 members</p>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                        <span className="text-xs font-medium text-red-500">You owe $500</span>
                    </div>
                </Link>
                <Link
                    className="flex items-center gap-4 rounded-md bg-gray-100 p-4 transition-colors hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700"
                    href="/group/asdasdasdsaads"
                >
                    <Avatar className="hidden h-9 w-9 sm:flex">
                        <AvatarImage alt="Avatar" src="https://github.com/shadcn.png" />
                        <AvatarFallback>JL</AvatarFallback>
                    </Avatar>
                    <div className="grid gap-1 flex-1">
                        <p className="text-sm font-medium leading-none">Marketing Mavens</p>
                        <p className="text-sm text-muted-foreground">8 members</p>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                        <span className="text-xs font-medium text-green-500">You get $200</span>
                    </div>
                </Link>
                <Link
                    className="flex items-center gap-4 rounded-md bg-gray-100 p-4 transition-colors hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700"
                    href="/group/asdasdasdsaads"
                >
                    <Avatar className="hidden h-9 w-9 sm:flex">
                        <AvatarImage alt="Avatar" src="https://github.com/shadcn.png" />
                        <AvatarFallback>IN</AvatarFallback>
                    </Avatar>
                    <div className="grid gap-1 flex-1">
                        <p className="text-sm font-medium leading-none">Product Pioneers</p>
                        <p className="text-sm text-muted-foreground">12 members</p>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                        <span className="text-xs font-medium text-gray-500">All settled</span>
                    </div>
                </Link>
            </div>
        </CardWrapper>
        // <Card>
        //     <CardHeader className="flex flex-row items-center">
        //         <div className="grid gap-2">
        //             <CardTitle>Recent Groups</CardTitle>
        //             <CardDescription>Recent groups you were part of.</CardDescription>
        //         </div>
        //         <Button asChild className="ml-auto gap-1" size="sm">
        //             <Link href="/groups">
        //                 View All
        //                 <ArrowUpRight className="h-4 w-4" />
        //             </Link>
        //         </Button>
        //     </CardHeader>
        //     <CardContent className="grid gap-4">
        //         <Link
        //             className="flex items-center gap-4 rounded-md bg-gray-100 p-4 transition-colors hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700"
        //             href="/group/asdasdasdsaads"
        //         >
        //             <Avatar className="hidden h-9 w-9 sm:flex">
        //                 <AvatarImage alt="Avatar" src="https://github.com/shadcn.png" />
        //                 <AvatarFallback>OM</AvatarFallback>
        //             </Avatar>
        //             <div className="grid gap-1 flex-1">
        //                 <p className="text-sm font-medium leading-none">Acme Design Team</p>
        //                 <p className="text-sm text-muted-foreground">5 members</p>
        //             </div>
        //             <div className="flex flex-col items-end gap-1">
        //                 <span className="text-xs font-medium text-red-500">You owe $500</span>
        //             </div>
        //         </Link>
        //         <Link
        //             className="flex items-center gap-4 rounded-md bg-gray-100 p-4 transition-colors hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700"
        //             href="/group/asdasdasdsaads"
        //         >
        //             <Avatar className="hidden h-9 w-9 sm:flex">
        //                 <AvatarImage alt="Avatar" src="https://github.com/shadcn.png" />
        //                 <AvatarFallback>JL</AvatarFallback>
        //             </Avatar>
        //             <div className="grid gap-1 flex-1">
        //                 <p className="text-sm font-medium leading-none">Marketing Mavens</p>
        //                 <p className="text-sm text-muted-foreground">8 members</p>
        //             </div>
        //             <div className="flex flex-col items-end gap-1">
        //                 <span className="text-xs font-medium text-green-500">You get $200</span>
        //             </div>
        //         </Link>
        //         <Link
        //             className="flex items-center gap-4 rounded-md bg-gray-100 p-4 transition-colors hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700"
        //             href="/group/asdasdasdsaads"
        //         >
        //             <Avatar className="hidden h-9 w-9 sm:flex">
        //                 <AvatarImage alt="Avatar" src="https://github.com/shadcn.png" />
        //                 <AvatarFallback>IN</AvatarFallback>
        //             </Avatar>
        //             <div className="grid gap-1 flex-1">
        //                 <p className="text-sm font-medium leading-none">Product Pioneers</p>
        //                 <p className="text-sm text-muted-foreground">12 members</p>
        //             </div>
        //             <div className="flex flex-col items-end gap-1">
        //                 <span className="text-xs font-medium text-gray-500">All settled</span>
        //             </div>
        //         </Link>
        //     </CardContent>
        // </Card>
    )
}

export default GroupsCard
