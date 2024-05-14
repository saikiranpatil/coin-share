import { Pencil } from "lucide-react"

import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import {
    AvatarImage,
    AvatarFallback,
    Avatar
} from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"

const AddTransactionRecipents = () => {
    return (
        <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2" htmlFor="recipients">
                <div className="flex items-center gap-1">
                    <span className="relative">
                        Recipents
                        <div className="absolute -top-1 left-[100%] pl-1">
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Pencil
                                        className="text-gray-400 dark:text-gray-600 hover:text-gray-600 dark:hover:text-gray-400 cursor-pointer mb-4"
                                        size="16"
                                    />
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Edit Recipents</p>
                                </TooltipContent>
                            </Tooltip>
                        </div>
                    </span>
                </div>
            </label>
            <Button className="mb-4" variant="outline">
                Choose Recipents
            </Button>
            <div className="space-y-4">
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
                <div className="flex items-center justify-between">
                    <div className="flex items-center">
                        <Avatar className="w-8 h-8 rounded-full mr-2">
                            <AvatarImage alt="User Avatar" src="/placeholder.svg" />
                            <AvatarFallback>DL</AvatarFallback>
                        </Avatar>
                        <span className="text-gray-900 dark:text-gray-100">David Lee</span>
                    </div>
                    <span className="text-gray-500 dark:text-gray-400 mr-2">₹25.00</span>
                </div>
                <div className="flex items-center justify-between">
                    <div className="flex items-center">
                        <Avatar className="w-8 h-8 rounded-full mr-2">
                            <AvatarImage alt="User Avatar" src="/placeholder.svg" />
                            <AvatarFallback>SW</AvatarFallback>
                        </Avatar>
                        <span className="text-gray-900 dark:text-gray-100">Sarah Wilson</span>
                    </div>
                    <span className="text-gray-500 dark:text-gray-400 mr-2">₹25.00</span>
                </div>
            </div>
        </div>
    )
}

export default AddTransactionRecipents
