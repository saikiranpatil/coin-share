import {
  Dialog,
  DialogContent,
  DialogHeader
} from "@/components/ui/dialog"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"

const ViewAvatarModal = ({ imageUrl, open, setOpen }: { imageUrl: string | undefined, open: boolean, setOpen: (params: boolean) => void }) => {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="border-none">
        <Avatar className="mx-auto h-full w-full">
          <AvatarImage src={imageUrl || "/default_user.png"} alt="@shadcn" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      </DialogContent>
    </Dialog>
  )
}

export default ViewAvatarModal
