import { CreditCard } from 'lucide-react';
import { PiMoneyDuotone } from "react-icons/pi";

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
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';

interface TransactionsTableProps {
  transactions: TransactionTableProps[];
}

const TransactionsTable = ({ transactions }: TransactionsTableProps) => {
  return (
    <>
      <ScrollArea className="w-[70vw] sm:w-full pb-4 ">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead></TableHead>
              <TableHead>
                <div className="flex flex-col items-center">
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
                      {
                        transaction.type === "Payment" ?
                          <CreditCard className="h-6 w-6" /> :
                          <PiMoneyDuotone className="h-6 w-6" />
                      }
                    </TableCell>
                    <TableCell className="flex flex-col items-center">
                      <div className="font-medium">{transaction.creatorName}</div>
                      <span className="text-xs text-muted-foreground">{transaction.groupName}</span>
                    </TableCell>
                    <TableCell>
                      <div>{transaction.description}</div>
                      <div className="text-xs text-muted-foreground">{transaction.createdAt}</div>
                    </TableCell>
                    <TableCell className="text-left flex flex-col items-start">
                      <span>Rs.{transaction.amount}</span>
                      <span className="text-xs text-muted-foreground">{transaction.type}</span>
                    </TableCell>
                    <TableCell className={`text-right text-xs font-medium ${transactionStatusClassMap[tag]}`}>
                      {text}
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
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
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
