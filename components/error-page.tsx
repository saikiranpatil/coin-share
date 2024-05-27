import { TriangleAlertIcon } from "lucide-react";
import Link from "next/link";

interface ErrorPageProps {
    message?: string;
}

const ErrorPage: React.FC<ErrorPageProps> = ({ message }) => {
    return (
        <div className="flex flex-col items-center justify-center min-h-[100dvh] px-4 md:px-6">
            <div className="max-w-md space-y-4 text-center">
                <TriangleAlertIcon className="mx-auto h-10 w-10 text-red-500" />
                <h1 className="text-2xl font-bold">Something went wrong</h1>
                <p className="text-gray-500 dark:text-gray-400">{message ?? "Something went wrong while loading this page."}</p>
                <Link
                    className="inline-flex h-10 items-center justify-center rounded-md bg-gray-900 px-6 text-sm font-medium text-gray-50 shadow transition-colors hover:bg-gray-900/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50 dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-50/90 dark:focus-visible:ring-gray-300"
                    href="/"
                >
                    Go back home
                </Link>
            </div>
        </div>
    );
}

export default ErrorPage;