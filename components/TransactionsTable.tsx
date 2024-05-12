import {
  WalletMinimal,
  CreditCard,
} from 'lucide-react';
import {
  TableHead,
  TableRow,
  TableHeader,
  TableCell,
  TableBody,
  Table
} from "@/components/ui/table"

const TransactionsTable = () => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead></TableHead>
          <TableHead>
            <div className="flex flex-col items-start">
              <div className="font-medium">Title</div>
            </div>
          </TableHead>
          <TableHead>Description</TableHead>
          <TableHead className="text-right">Amount</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell>
            <CreditCard className="h-6 w-6" />
          </TableCell>
          <TableCell>
            <div className="flex flex-col items-start">
              <div className="font-medium">Individual</div>
              <span className="text-xs text-muted-foreground">Individual</span>
            </div>
          </TableCell>
          <TableCell>
            <div>Paid for dinner with friends</div>
            <div className="text-sm text-muted-foreground">2023-06-23, 8:30 PM</div>
          </TableCell>
          <TableCell className="text-right">$250.00</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>
            <WalletMinimal className="h-6 w-6" />
          </TableCell>
          <TableCell>
            <div className="flex flex-col items-start">
              <div className="font-medium">Acme Design Team</div>
              <span className="text-xs text-muted-foreground">Group</span>
            </div>
          </TableCell>
          <TableCell>
            <div>Shared expenses for team outing</div>
            <div className="text-sm text-muted-foreground">2023-06-24, 5:45 PM</div>
          </TableCell>
          <TableCell className="text-right">$150.00</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>
            <CreditCard className="h-6 w-6" />
          </TableCell>
          <TableCell>
            <div className="flex flex-col items-start">
              <div className="font-medium">Individual</div>
              <span className="text-xs text-muted-foreground">Individual</span>
            </div>
          </TableCell>
          <TableCell>
            <div>Paid for monthly subscription</div>
            <div className="text-sm text-muted-foreground">2023-06-25, 10:15 AM</div>
          </TableCell>
          <TableCell className="text-right">$350.00</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>
            <CreditCard className="h-6 w-6" />
          </TableCell>
          <TableCell>
            <div className="flex flex-col items-start">
              <div className="font-medium">Individual</div>
              <span className="text-xs text-muted-foreground">Individual</span>
            </div>
          </TableCell>
          <TableCell>
            <div>Purchased new laptop</div>
            <div className="text-sm text-muted-foreground">2023-06-26, 3:20 PM</div>
          </TableCell>
          <TableCell className="text-right">$450.00</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>
            <CreditCard className="h-6 w-6" />
          </TableCell>
          <TableCell>
            <div className="flex flex-col items-start">
              <div className="font-medium">Individual</div>
              <span className="text-xs text-muted-foreground">Individual</span>
            </div>
          </TableCell>
          <TableCell>
            <div>Paid for team dinner</div>
            <div className="text-sm text-muted-foreground">2023-06-27, 7:00 PM</div>
          </TableCell>
          <TableCell className="text-right">$550.00</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  )
}

export default TransactionsTable
