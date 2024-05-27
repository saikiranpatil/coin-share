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


export default async function TransactionsPage() {
    const { transactions, error } = await getAllTransactionsByUser();

    if (!transactions) {
        return <ErrorPage message={error} />;
    }

    return (
        <main className="w-full items-start gap-4 p-4 sm:px-6 sm:py-4 sm:gap-6 grid auto-rows-max md:gap-8">
            <Card>
                <CardHeader className="flex flex-row items-center">
                    <div className="grid gap-2">
                        <CardTitle>Transactions</CardTitle>
                        <CardDescription>All transactions made by you.</CardDescription>
                    </div>
                </CardHeader>
                <CardContent>
                    <Tabs defaultValue="week">
                        <div className="flex items-center">
                            <TabsList>
                                <TabsTrigger value="week">Week</TabsTrigger>
                                <TabsTrigger value="month">Month</TabsTrigger>
                                <TabsTrigger value="year">Year</TabsTrigger>
                            </TabsList>
                            <div className="ml-auto flex items-center gap-2 mb-4">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="h-7 gap-1 text-sm"
                                        >
                                            <ListFilter className="h-3.5 w-3.5" />
                                            <span className="sr-only sm:not-sr-only">Filter</span>
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuLabel>Filter by</DropdownMenuLabel>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuCheckboxItem checked>
                                            Fulfilled
                                        </DropdownMenuCheckboxItem>
                                        <DropdownMenuCheckboxItem>
                                            Declined
                                        </DropdownMenuCheckboxItem>
                                        <DropdownMenuCheckboxItem>
                                            Refunded
                                        </DropdownMenuCheckboxItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                                <Button
                                    size="sm"
                                    variant="outline"
                                    className="h-7 gap-1 text-sm"
                                >
                                    <File className="h-3.5 w-3.5" />
                                    <span className="sr-only sm:not-sr-only">Export</span>
                                </Button>
                            </div>
                        </div>
                        <TabsContent value="week">
                            <TransactionsTable transactions={transactions} />
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>
        </main>
    )
}