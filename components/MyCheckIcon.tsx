import { CheckIcon } from "@radix-ui/react-icons"

const MyCheckIcon = ({ active = false }: { active?: boolean }) => {
    if (active) return (<CheckIcon className="mr-4" />)
    return (<CheckIcon className="text-muted-foreground opacity-30 mr-4" />)
}

export default MyCheckIcon
