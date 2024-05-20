import {
    Avatar,
    AvatarFallback,
    AvatarImage
} from '@/components/ui/avatar';

const DashboardAvatar = () => (
    <div className="absolute top-0">
        <Avatar className='relative inline-block h-48 w-48 z-[1] m-6'>
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>CN</AvatarFallback>
        </Avatar>
    </div>
)

export default DashboardAvatar
