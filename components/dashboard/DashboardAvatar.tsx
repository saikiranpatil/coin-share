import {
    Avatar,
    AvatarFallback,
    AvatarImage
} from '@/components/ui/avatar';


interface DashboardAvatarProps {
    user: {
        name: string;
        email: string;
        imageUrl?: string;
        createdAt: string;
    }
}

const DashboardAvatar = ({ user }: DashboardAvatarProps) => (
    <div className="absolute top-0 left-[calc(50%-120px)] sm:left-8">
        <Avatar className='relative inline-block h-48 w-48 z-[1] m-6 border'>
            <AvatarImage src={user.imageUrl || "https://github.com/shadcn.png"} />
            <AvatarFallback>CN</AvatarFallback>
        </Avatar>
    </div>
)

export default DashboardAvatar