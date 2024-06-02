interface GroupPageProps {
    groupId: string;
}

interface GroupMemberPageProps {
    id: string;
    name: string;
    email: string;
    imageUrl: string | null;
    status: {
        tag: GroupStatusTagProps;
        text: string;
    }
}

interface GroupSelectListProps {
    id: string;
    name: string;
}