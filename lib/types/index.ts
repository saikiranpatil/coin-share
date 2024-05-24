interface GroupPageProps {
    groupId: string;
}

interface GroupMemberPageProps {
    id: string;
    name: string;
    email: string;
    image: string;
}

interface TransactionTableProps {
    id: string;
    type: string;
    description: string;
    createdAt: string;
    amount: number;
    creatorName: string;
    groupName: string;
}

interface GroupSelectListProps {
    id: string;
    name: string;
}

interface UserSelectListProps {
    id: string;
    name: string;
    email: string;
    image: string;
}