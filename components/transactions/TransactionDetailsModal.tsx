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
import { Button } from "../ui/button"
import { Dot, ReceiptText } from "lucide-react";
import { ScrollArea } from "../ui/scroll-area";
import { getTransactionDetails } from "@/lib/actions/transaction";

interface TransactionDetailsModalProps {
  transactionId: string;
}

const TransactionDetailsModal = async ({ transactionId }: TransactionDetailsModalProps) => {
  const { transaction } = await getTransactionDetails(transactionId);

  if (!transaction) return;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">
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
                    <TableRow>
                      <TableCell className="text-sm">Saikiran Patil</TableCell>
                      <TableCell className="text-muted-foreground text-right">Rs. 250</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="text-sm">Mohan Kumar</TableCell>
                      <TableCell className="text-muted-foreground text-right">Rs. 250</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="text-sm">Ramesh Sharma</TableCell>
                      <TableCell className="text-muted-foreground text-right">Rs. 250</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="text-sm">Shreepad</TableCell>
                      <TableCell className="text-muted-foreground text-right">Rs. 250</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
              <div className="flex-1">
                <span className="font-medium">Recipents:</span>
                <Table>
                  <TableBody>
                    <TableRow>
                      <TableCell className="text-sm">Ramesh</TableCell>
                      <TableCell className="text-muted-foreground text-right">Rs. 200</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="text-sm">Suresh</TableCell>
                      <TableCell className="text-muted-foreground text-right">Rs. 200</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="text-sm">Ramesh</TableCell>
                      <TableCell className="text-muted-foreground text-right">Rs. 200</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="text-sm">Suresh</TableCell>
                      <TableCell className="text-muted-foreground text-right">Rs. 200</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="text-sm">Ramesh</TableCell>
                      <TableCell className="text-muted-foreground text-right">Rs. 200</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="text-sm">Suresh</TableCell>
                      <TableCell className="text-muted-foreground text-right">Rs. 200</TableCell>
                    </TableRow>
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
