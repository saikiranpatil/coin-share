import Link from 'next/link';

import {
  WalletMinimal,
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
import { Button } from '../ui/button';

import TransactionDetailsModal from '../TransactionDetailsModal';

const TransactionsTable = ({ showGroupName = true }) => {
  return (
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
        <TableRow>
          <TableCell>
            <CreditCard className="h-6 w-6" />
          </TableCell>
          <TableCell>
            <div className="flex flex-col items-start">
              <div className="font-medium">Ramesh</div>
              {showGroupName &&
                <div className="grid grid-flow-col gap-2">
                  <Users size={12} />
                  <span className="text-xs text-muted-foreground">Sunday Trekking Group</span>
                </div>}
            </div>
          </TableCell>
          <TableCell>
            <div>Paid for dinner with friends</div>
            <div className="text-sm text-muted-foreground">2023-06-23, 8:30 PM</div>
          </TableCell>
          <TableCell className="text-right">$250.00</TableCell>
          <TableCell className="text-right">
            <span className="text-xs font-medium text-red-500">You borrowed Rs.500</span>
          </TableCell>
          <TableCell className="text-right">
            <TransactionDetailsModal />
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>
            <WalletMinimal className="h-6 w-6" />
          </TableCell>
          <TableCell>
            <div className="flex flex-col items-start">
              <div className="flex">
                <div className="font-medium">You</div>
              </div>
              <span className="text-xs text-muted-foreground">Individual</span>
            </div>
          </TableCell>
          <TableCell>
            <div>Shared expenses for team outing</div>
            <div className="text-sm text-muted-foreground">2023-06-24, 5:45 PM</div>
          </TableCell>
          <TableCell className="text-right">$150.00</TableCell>
          <TableCell className="text-right">
            <span className="text-xs font-medium text-green-500">You lent $200</span>
          </TableCell>
          <TableCell className="text-right">
            <Button variant="outline">
              <Link href="/transaction/sadasdads">
                View Details
              </Link>
            </Button>
          </TableCell>
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
          <TableCell className="text-right">
            <span className="text-xs font-medium text-blue-500">You returned ₹561</span>
          </TableCell>
          <TableCell className="text-right">
            <Button variant="outline">
              <Link href="/transaction/sadasdads">
                View Details
              </Link>
            </Button>
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>
            <CreditCard className="h-6 w-6" />
          </TableCell>
          <TableCell>
            <div className="flex flex-col items-start">
              <div className="font-medium">Saikiran Patil</div>
              <span className="text-xs text-muted-foreground">Individual</span>
            </div>
          </TableCell>
          <TableCell>
            <div>Settled Money for this month</div>
            <div className="text-sm text-muted-foreground">2023-06-26, 3:20 PM</div>
          </TableCell>
          <TableCell className="text-right">$450.00</TableCell>
          <TableCell className="text-right">
            <span className="text-xs font-medium text-gray-500">Not Involved</span>
          </TableCell>
          <TableCell className="text-right">
            <Button variant="outline">
              <Link href="/transaction/sadasdads">
                View Details
              </Link>
            </Button>
          </TableCell>
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
          <TableCell className="text-right">
            <span className="text-xs font-medium text-gray-500">Not Involved</span>
          </TableCell>
          <TableCell className="text-right">
            <Button variant="outline">
              <Link href="/transaction/sadasdads">
                View Details
              </Link>
            </Button>
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  )
}

export default TransactionsTable
