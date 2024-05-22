import { Pencil } from "lucide-react";

import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip";

import AddTransactionContributersModal from "./AddContributersModal";
import UsersCardWithAmount from "@/components/transactions/UserCard";

const AddContributers = () => {
    return (
        <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2" htmlFor="recipients">
                <div className="flex items-center gap-1">
                    <span className="relative">
                        Contributors
                        <div className="absolute top-0 left-[100%] pl-1">
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Pencil
                                        className="text-gray-400 dark:text-gray-600 hover:text-gray-600 dark:hover:text-gray-400 cursor-pointer"
                                        size="16"
                                    />
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Edit Contributers</p>
                                </TooltipContent>
                            </Tooltip>
                        </div>
                    </span>
                </div>
            </label>
            <AddTransactionContributersModal />
            <div className="space-y-4">
                <UsersCardWithAmount />
            </div>
        </div>
    )
}

export default AddContributers
