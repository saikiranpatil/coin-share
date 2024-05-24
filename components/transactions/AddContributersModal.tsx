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
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator"

import UserCardWithAmount from "./UserCardWithAmount";
import UserCombobox from "./UserCombobox";
import { ScrollArea } from "@/components/ui/scroll-area";
import SelectUser from "../select-user";

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
                <Tabs defaultValue="contributers" className="w-[400px] space-y-4">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="single">
                            Single
                        </TabsTrigger>
                        <TabsTrigger value="multiple">
                            Multiple
                        </TabsTrigger>
                    </TabsList>
                    <TabsContent value="single">
                        <SelectUser />
                    </TabsContent>
                    <TabsContent value="multiple">
                        <div className="py-4">
                            <UserCombobox />
                        </div>
                        <ScrollArea className="h-40 rounded-md border p-4">
                            {tags.map((tag, idx) => (
                                <>
                                    <UserCardWithAmount key={"usercardcontributers" + idx} tag={tag} />
                                    {idx !== tags.length - 1 && <Separator className="my-4" />}
                                </>
                            ))}
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
                        <Button className="w-full" type="submit">
                            Save changes
                        </Button>
                    </TabsContent>
                </Tabs>
            </DialogContent>
        </Dialog>
    )
}

export default AddContributersModal
