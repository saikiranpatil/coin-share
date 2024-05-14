import MyCheckIcon from "@/components/MyCheckIcon";
import {
    AvatarImage,
    AvatarFallback,
    Avatar
} from "@/components/ui/avatar";

const SingleSelectionUserCard = ({ tag }: { tag: String }) => {
    return (
        <label
            htmlFor={"terms " + tag}
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex justify-between items-center space-x-2 px-6"
        >
            <div className="flex items-center">
                <Avatar className="w-12 h-12 rounded-full mr-2">
                    <AvatarImage alt="User Avatar" src="/placeholder.svg" />
                    <AvatarFallback>ED</AvatarFallback>
                </Avatar>
                <span className="text-gray-900 dark:text-gray-100">Emily Davis</span>
            </div>
            <MyCheckIcon />
        </label>
    )
}

export default SingleSelectionUserCard
