import { groupStatusClassMap } from "@/lib/constants";

import {
    Avatar,
    AvatarFallback,
    AvatarImage
} from "@/components/ui/avatar";
import GroupSettlementModal from "./GroupSettlementModal";

const GroupMemberCard = ({ groupMember }: { groupMember: GroupMemberPageProps }) => {
    const { tag, text } = groupMember.status;
    return (
        <div
            className="flex items-center gap-4 p-4 transition-colors border-b border-gray-200 dark:border-gray-700"
        >
            <Avatar className="hidden h-12 w-12 sm:flex">
                <AvatarImage alt="Avatar" src={groupMember.imageUrl || "/default_user.png"} />
                <AvatarFallback>OM</AvatarFallback>
            </Avatar>
            <div className="grid gap-1 flex-1">
                <p className="text-sm font-medium leading-none">{groupMember.name}</p>
                <p className="text-sm text-muted-foreground">{groupMember.email}</p>
            </div>
            <div className="flex flex-col items-end gap-1">
                <span className={`text-xs font-medium ${groupStatusClassMap[tag]}`}>{text}</span>
                <GroupSettlementModal groupMember={groupMember} />
            </div>
        </div>
    )
}

export default GroupMemberCard
