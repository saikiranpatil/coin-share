import { getAllTransactionsByUser } from "@/lib/actions/transaction"

import ErrorPage from "@/components/error-page"
import TransactionsCard from "@/components/my-ui/transactions-card/TransactionsCard"
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus } from "lucide-react";

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
                headerButton={AddTransactionsButton}
                transactions={transactions}
            />
        </main>
    )
}

const AddTransactionsButton = (
    <Button
      asChild
      className="ml-auto gap-1"
      size="sm"
    >
      <Link href="/transactions/add">
        <Plus className="h-4 w-4" />
        Add Transaction
      </Link>
    </Button>
  )