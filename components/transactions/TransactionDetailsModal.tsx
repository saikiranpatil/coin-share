import { Dot, ReceiptText } from "lucide-react";

import { getTransactionDetails } from "@/lib/actions/transaction";

import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  TableRow,
  TableCell,
  TableBody,
  Table
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area";

interface TransactionDetailsModalProps {
  transactionId: string;
}

const TransactionDetailsModal = async ({ transactionId }: TransactionDetailsModalProps) => {
  const { transaction, error } = await getTransactionDetails(transactionId);

  if (!transaction || error) {
    return;
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          View Details
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[750px]">
        <ScrollArea className="w-full p-4 max-h-[100vh]">
          <ReceiptText size="48" className="mb-4" />
          <div>
            <h3 className="text-xl font-semibold leading-none tracking-tight">Transacrion Details</h3>
            <p className="flex items-center pt-1 text-xs text-muted-foreground">
              {transaction.type}
              <Dot size="16" />
              {transaction.createdAt}
            </p>
          </div>
          <div className="flex flex-col space-y-4 my-4 text-sm">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="flex flex-col">
                <span className="font-medium">Description</span>
                <p className="text-gray-500 dark:text-gray-400">{transaction.description}</p>
              </div>
              <div className="flex flex-col">
                <span className="font-medium">Total Amount</span>
                <p className="text-gray-500 dark:text-gray-400">₹{transaction.amount}</p>
              </div>
              <div className="flex flex-col">
                <span className="font-medium">Created By</span>
                <p className="text-gray-500 dark:text-gray-400">{transaction.creatorName}</p>
              </div>
              <div className="flex flex-col">
                <span className="font-medium">Group</span>
                <p className="text-gray-500 dark:text-gray-400">{transaction.groupName}</p>
              </div>
              <div>
                <span className="font-medium">Contributors:</span>
                <Table>
                  <TableBody>
                    {
                      transaction.contributors.map((contributer, index) => (
                        <TableRow key={transaction.id + "-transaction-contributer-" + index}>
                          <TableCell className="text-sm">{contributer.name}</TableCell>
                          <TableCell className="text-muted-foreground text-right">Rs. {" "} {contributer.amount}</TableCell>
                        </TableRow>
                      ))
                    }
                  </TableBody>
                </Table>
              </div>
              <div className="flex-1">
                <span className="font-medium">Recipients:</span>
                <Table>
                  <TableBody>
                    {
                      transaction.recipients.map((recipient, index) => (
                        <TableRow key={transaction.id + "-transaction-recipient-" + index}>
                          <TableCell className="text-sm">{recipient.name}</TableCell>
                          <TableCell className="text-muted-foreground text-right">Rs. {" "} {recipient.amount}</TableCell>
                        </TableRow>
                      ))
                    }
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}

export default TransactionDetailsModal
