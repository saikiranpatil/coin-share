interface GroupPageProps {
    groupId: string;
}

interface GroupMemberPageProps {
    id: string;
    name: string;
    email: string;
    image: string | null;
}

interface GroupSelectListProps {
    id: string;
    name: string;
}