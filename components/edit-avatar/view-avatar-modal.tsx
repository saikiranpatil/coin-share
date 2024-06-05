import {
  Dialog,
  DialogContent,
  DialogHeader
} from "../ui/dialog"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"

const ViewAvatarModal = ({ user, open, setOpen }: { user: UserSelectListProps, open: boolean, setOpen: (params: boolean) => void }) => {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="border-none bg-transaparent">
        <Avatar className="mx-auto h-full w-full">
          <AvatarImage src={user.imageUrl || "https://github.com/shadcn.png"} alt="@shadcn" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      </DialogContent>
    </Dialog>
  )
}

export default ViewAvatarModal
