import { CreditCard } from 'lucide-react';

import TransactionDetailsModal from '@/components/transactions/TransactionDetailsModal';

import {
  TableHead,
  TableRow,
  TableHeader,
  TableCell,
  TableBody,
  Table
} from "@/components/ui/table"
import { CardDescription } from '@/components/ui/card';

interface TransactionsTableProps {
  transactions: TransactionTableProps[];
}

const TransactionsTable = ({ transactions }: TransactionsTableProps) => {
  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead></TableHead>
            <TableHead>
              <div className="flex flex-col items-start">
                <div className="font-medium">From</div>
              </div>
            </TableHead>
            <TableHead>Description</TableHead>
            <TableHead className="text-right">Amount</TableHead>
            <TableHead className="text-right">Share</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {
            transactions && transactions.length > 0 && transactions.map(transaction => {
              const { tag, text } = transaction.status;
              const statusClassMap: { [K in TransactionsStatusTagProps]: string } = {
                "credit": "text-green-500",
                "debit": "text-red-500",
                "return": "text-blue-500",
                "collect": "text-blue-500",
                "uninvolved": "text-gray-500",
              };

              return (
                <TableRow key={transaction.id}>
                  <TableCell>
                    <CreditCard className="h-6 w-6" />
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col items-start">
                      <div className="font-medium">{transaction.creatorName}</div>
                      <span className="text-xs text-muted-foreground">{transaction.type}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>{transaction.description}</div>
                    <div className="text-sm text-muted-foreground">{transaction.createdAt}</div>
                  </TableCell>
                  <TableCell className="text-right">{transaction.amount}</TableCell>
                  <TableCell className="text-right">
                    <span className={`text-xs font-medium ${statusClassMap[tag]}`}>{text}</span>
                  </TableCell>
                  <TableCell className="text-right">
                    <TransactionDetailsModal transactionId={transaction.id} />
                  </TableCell>
                </TableRow>)
            }
            )
          }
        </TableBody>
      </Table>
      {
        transactions?.length == 0 &&
        <CardDescription className="text-center py-4">
          No Transactions
        </CardDescription>
      }
    </>
  )
}

export default TransactionsTable
