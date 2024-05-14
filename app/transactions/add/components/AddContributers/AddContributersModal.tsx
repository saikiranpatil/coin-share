import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"   

import UserCardWithAmount from "../UserCards/UserCardWithAmount";
import UserCombobox from "../UserCombobox";

const tags = Array.from({ length: 10 }).map(
    (_, i, a) => `v1.2.0-beta.${a.length - i}`
)

export function AddContributersModal() {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button className="text-muted-foreground font-normal text-xs mb-4" variant="outline" size="sm">
                    Choose Contributers
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[450px]">
                <DialogHeader>
                    <DialogTitle>Choose Contributers</DialogTitle>
                    <DialogDescription>
                        Choose appropriate Contributers type and click save when youre done.
                    </DialogDescription>
                </DialogHeader>
                <UserCombobox />
                <ScrollArea className="max-h-40 rounded-md border">
                    <div className="space-y-4 p-4">
                        {tags.map((tag) => (
                            <>
                                <UserCardWithAmount key={"usercardcontributers" + tag} tag={tag} />
                                <Separator className="my-2" />
                            </>
                        ))}
                    </div>
                </ScrollArea>
                <div className="flex flex-col gap-4 my-4 text-sm">
                    <div className="flex items-center justify-between">
                        <span className="text-gray-500 dark:text-gray-400">Total Amount:</span>
                        <span className="font-medium">₹1,000</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-gray-500 dark:text-gray-400">Selected Total:</span>
                        <span className="font-medium">₹1,500</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-red-500">Left Amount:</span>
                        <span className="text-red-500 font-medium">₹500</span>
                    </div>
                </div>
                <DialogFooter>
                    <Button className="w-full" type="submit">
                        Save changes
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default AddContributersModal
