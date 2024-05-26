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
        <div className="bg-red-500/15 p-3 rounded-md flex items-center gap-x-2 text-sm text-red-500">
            <CiWarning className="h-4 w-4" />
            <p>{message}</p>
        </div>
    )
}

export default FormError
