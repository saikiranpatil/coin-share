import {
  AvatarImage,
  AvatarFallback,
  Avatar
} from "@/components/ui/avatar";

const UserCardForAddRecipents = () => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center">
        <Avatar className="w-8 h-8 rounded-full mr-2">
          <AvatarImage alt="User Avatar" src="/placeholder.svg" />
          <AvatarFallback>ED</AvatarFallback>
        </Avatar>
        <span className="text-gray-900 dark:text-gray-100">Emily Davis</span>
      </div>
      <span className="text-gray-500 dark:text-gray-400 mr-2">₹25.00</span>
    </div>
  )
}

export default UserCardForAddRecipents
