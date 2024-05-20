import { CiWarning } from "react-icons/ci";

interface formErrorProps {
    message?: string;
}
const FormError = ({
    message
}: formErrorProps) => {
    if (!message) {
        return null;
    }
    return (
        <div className="bg-destructive/15 p-3 rounded-md flex items-center gap-x-2 text-sm text-destructive">
            <CiWarning className="h-4 w-4" />
            <p>{message}</p>
        </div>
    )
}

export default FormError
