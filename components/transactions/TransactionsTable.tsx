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
import { transactionStatusClassMap } from '@/lib/constants';

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
            <TableHead className="text-left">Amount</TableHead>
            <TableHead className="text-right">Share</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {
            transactions && transactions.length > 0 && transactions.map(transaction => {
              const { tag, text } = transaction.status;
              return (
                <TableRow key={transaction.id}>
                  <TableCell>
                    <CreditCard className="h-6 w-6" />
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col items-start">
                      <div className="font-medium">{transaction.creatorName}</div>
                      <span className="text-xs text-muted-foreground">{transaction.groupName}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>{transaction.description}</div>
                    <div className="text-xs text-muted-foreground">{transaction.createdAt}</div>
                  </TableCell>
                  <TableCell className="text-left flex flex-col items-start">
                    <span>Rs.{transaction.amount}</span>
                    <span className="text-xs text-muted-foreground">{transaction.type}</span>
                  </TableCell>
                  <TableCell className="text-right">
                    <span className={`text-xs font-medium ${transactionStatusClassMap[tag]}`}>{text}</span>
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
