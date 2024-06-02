interface UserSelectListProps {
    id: string;
    name: string;
    email: string;
    image: ImageProps | null;
}

interface ImageProps {
    secure_id: string;
    public_url: string;
}