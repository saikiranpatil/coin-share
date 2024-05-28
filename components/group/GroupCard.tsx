import Link from "next/link"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardTitle } from "@/components/ui/card"

interface groupDataProps {
    id: string
    name: string;
    image: string | null;
    membersCount: number;
}

const GroupCard = ({ groupData }: { groupData: groupDataProps }) => {
    return (
        <Link href={"/group/" + groupData.id}>
            <Card className="flex flex-col text-center items-center justify-between space-y-0 gap-2 sm:gap-4 p-6">
                <Avatar className='h-20 w-20'>
                    <AvatarImage src={groupData.image || "https://github.com/shadcn.png"} />
                    <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <div className="grid gap-2">
                    <CardTitle className="font-semibold leading-none tracking-tight">{groupData.name} </CardTitle>
                    <div className='grid'>
                        <p className="text-xs text-muted-foreground"> {groupData.membersCount} Members</p>
                        <span className="text-xs font-medium text-red-500">You owe $500</span>
                    </div>
                </div>
            </Card>
        </Link>
    )
}

export default GroupCard
