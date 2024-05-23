import {
  CreditCard,
  Users,
} from 'lucide-react';
import {
  TableHead,
  TableRow,
  TableHeader,
  TableCell,
  TableBody,
  Table
} from "@/components/ui/table"

import TransactionDetailsModal from './TransactionDetailsModal';
import { CardDescription } from '../ui/card';

const TransactionsTable = ({ transactions }) => {
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
            transactions && transactions.length>0 && transactions.map(transaction => {
              const shareClassName = transaction.amount ? transaction.amount > 0 ? "text-blue-500" : "text-red-500" : "text-gray-500";
              return (
                <TableRow key={transaction.id}>
                  <TableCell>
                    <CreditCard className="h-6 w-6" />
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col items-start">
                      <div className="font-medium">{transaction.description}</div>
                      <span className="text-xs text-muted-foreground">{transaction.type}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>Paid for dinner with friends</div>
                    <div className="text-sm text-muted-foreground">{transaction.createdAt}</div>
                  </TableCell>
                  <TableCell className="text-right">{transaction.amount}</TableCell>
                  <TableCell className="text-right">
                    <span className={`text-xs font-medium ${shareClassName}`}>You borrowed Rs.500</span>
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
        !transactions?.length > 0 &&
        <CardDescription className="text-center py-4">
          No Transactions
        </CardDescription>
      }
    </>
  )
}

export default TransactionsTable
