import {
  AvatarImage,
  AvatarFallback,
  Avatar
} from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { X } from "lucide-react";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { Label } from "../ui/label";

const UserCardWithAmount = ({ tag }: { tag: String }) => {
  return (
    <div className="max-w-80 mx-auto">
      <Label className="flex justify-between items-center space-x-2">
        <Avatar className="w-12 h-12 rounded-full mr-2">
          <AvatarImage alt="User Avatar" src="/placeholder.svg" />
          <AvatarFallback>ED</AvatarFallback>
        </Avatar>
        <span className="text-gray-900 dark:text-gray-100">Emily Davis</span>
        <Input className="w-24" placeholder="Amount" type="number" min="0" />
        <Button size="icon" variant="secondary"><X size="16" /></Button>
      </Label>
      <Separator className="my-4" />
    </div>
  )
}

export default UserCardWithAmount
