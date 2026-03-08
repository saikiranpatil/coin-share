interface GroupPageProps {
    groupId: string;
}

interface GroupSummary {
  id: string;
  name: string;
  image: { id: string; url: string; publicId: string; createdAt: Date } | null;
  status: { tag: GroupStatusTagProps; text: string };
  membersCount: number;
}

interface GroupTitle {
  id: string;
  name: string;
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