import {
    File,
    ListFilter,
} from "lucide-react"

import TransactionsTable from "@/components/transactions/TransactionsTable"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"
import {
    CardTitle,
    CardHeader,
    CardContent,
    Card,
    CardDescription
} from "@/components/ui/card"
import { getAllTransactionsByUser } from "@/lib/actions/transaction"
import ErrorPage from "../error-page"
import TransactionsCard from "./TransactionsCard"


export default async function TransactionsPage() {
    const { transactions, error } = await getAllTransactionsByUser();

    if (!transactions) {
        return <ErrorPage message={error} />;
    }

    return (
        <main className="w-full items-start gap-4 p-4 sm:px-6 sm:py-4 sm:gap-6 grid auto-rows-max md:gap-8">
            <TransactionsCard
                title="Transactions"
                description="Recent transactions made by you."
                transactions={transactions}
            />
        </main>
    )
}