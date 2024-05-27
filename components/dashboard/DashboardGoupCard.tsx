import Link from "next/link"

import {
    AvatarImage,
    AvatarFallback,
    Avatar
} from "@/components/ui/avatar";

interface DashboardGoupCardProps {
    id: string;
    name: string;
    image: string | null;
    membersCount: number;
}

const DashboardGoupCard = ({ group }: { group: DashboardGoupCardProps }) => {
    return (
        <Link
            className="flex items-center gap-4 rounded-md bg-gray-100 p-4 transition-colors hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700"
            href={`/group/${group.id}`}
        >
            <Avatar className="hidden h-12 w-12 sm:flex">
                <AvatarImage alt="Avatar" src="https://github.com/shadcn.png" />
                <AvatarFallback>OM</AvatarFallback>
            </Avatar>
            <div className="grid gap-1 flex-1">
                <p className="text-sm font-medium leading-none">{group.name}</p>
                <p className="text-sm text-muted-foreground">{group.membersCount} members</p>
            </div>
            <div className="flex flex-col items-end gap-1">
                <span className="text-xs font-medium text-red-500">You owe $500</span>
            </div>
        </Link>
    )
}

export default DashboardGoupCard