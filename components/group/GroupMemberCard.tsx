import {
    Avatar,
    AvatarFallback,
    AvatarImage
} from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

const GroupMemberCard = ({ groupMember }: { groupMember: GroupMemberPageProps }) => {
    const refundAmount = 200;
    const settleClass = refundAmount > 0 ? "text-green-500" : refundAmount < 0 ? "text-red-500" : "text-gray-500";
    return (
        <div
            className="flex items-center gap-4 rounded-md bg-gray-100 p-4 transition-colors dark:bg-gray-800"
        >
            <Avatar className="hidden h-12 w-12 sm:flex">
                <AvatarImage alt="Avatar" src="https://github.com/shadcn.png" />
                <AvatarFallback>OM</AvatarFallback>
            </Avatar>
            <div className="grid gap-1 flex-1">
                <p className="text-sm font-medium leading-none">{groupMember.name}</p>
                <p className="text-sm text-muted-foreground">{groupMember.email}</p>
            </div>
            <div className="flex flex-col items-end gap-1">
                <span className={`text-xs font-medium ${settleClass}`}>You owe $500</span>
                <Button variant="outline" size="sm">Remind</Button>
            </div>
        </div>
    )
}

export default GroupMemberCard
