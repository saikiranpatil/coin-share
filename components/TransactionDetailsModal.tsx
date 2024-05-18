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
import { Button } from "./ui/button"
import { ReceiptText } from "lucide-react";
import { ScrollArea } from "./ui/scroll-area";

const TransactionDetailsModal = () => {
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
            <p className="text-sm pt-1 text-muted-foreground">2023-06-23, 8:30 PM</p>
          </div>
          <div className="flex flex-col space-y-4 my-4 text-sm">
            <div className="flex flex-col flex-1 justify-between">
              <span className="font-medium">Description</span>
              <p className="text-gray-500 dark:text-gray-400">Amount paid for some sample reason Lorem ipsum dolor sit amet consectetur, adipisicing elit. Soluta quod consequatur expedita veritatis deserunt ipsum laborum reprehenderit, a quasi distinctio eos consectetur, vero cum fuga vel voluptatem minima recusandae exercitationem eius blanditiis. Impedit, iure.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="flex flex-col">
                <span className="font-medium">Total Amount</span>
                <p className="text-gray-500 dark:text-gray-400">₹1,000</p>
              </div>
              <div className="flex flex-col">
                <span className="font-medium">Group Name</span>
                <p className="text-gray-500 dark:text-gray-400">Sunday Trekking</p>
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
