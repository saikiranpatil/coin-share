import TransactionsTable from "@/components/TransactionsTable";
import {
  Avatar,
  AvatarFallback,
  AvatarImage
} from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Plus, UserPlus } from "lucide-react";
import Link from "next/link";

const GroupPage = () => {
  return (
    <main className="flex flex-col justify-center gap-4 p-4 md:gap-8 md:p-8">
      <div className="flex flex-col sm:flex-row items-center justify-center">
        <Avatar className='inline-block h-48 w-48 z-[1] m-6'>
          <AvatarImage src="https://github.com/shadcn.png" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <Card className='space-y-4 p-6 text-center sm:text-left'>
          <h1 className="whitespace-nowrap text-3xl font-semibold tracking-tight">
            Sunday Trekking
          </h1>
          <p className="text-sm text-muted-foreground">you owe a total of Rs.256</p>
        </Card>
      </div>
      <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
        <Card className="xl:col-span-2" x-chunk="dashboard-01-chunk-4">
          <CardHeader className="flex flex-row items-center">
            <div className="grid gap-2">
              <CardTitle>Transactions</CardTitle>
              <CardDescription>Recent transactions from this group.</CardDescription>
            </div>
            <Button
              asChild
              className="ml-auto gap-1"
              size="sm"
            >
              <Link href="/transactions">
                <Plus className="h-4 w-4" />
                Add Transaction
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <TransactionsTable />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center">
            <div className="grid gap-2">
              <CardTitle>Group Members</CardTitle>
              <CardDescription>All the members of the group.</CardDescription>
            </div>
            <Button asChild className="ml-auto gap-1" size="sm">
              <Link href="/groups">
                <UserPlus className="h-4 w-4" />
                Add Member
              </Link>
            </Button>
          </CardHeader>
          <CardContent className="grid gap-4">
            <Link
              className="flex items-center gap-4 rounded-md bg-gray-100 p-4 transition-colors hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700"
              href="#"
            >
              <Avatar className="hidden h-9 w-9 sm:flex">
                <AvatarImage alt="Avatar" src="https://github.com/shadcn.png" />
                <AvatarFallback>OM</AvatarFallback>
              </Avatar>
              <div className="grid gap-1 flex-1">
                <p className="text-sm font-medium leading-none">Acme Design Team</p>
                <p className="text-sm text-muted-foreground">sample@sample.com</p>
              </div>
              <div className="flex flex-col items-end gap-1">
                <span className="text-xs font-medium text-red-500">You owe $500</span>
                <Button variant="outline" size="sm">Remind</Button>
              </div>
            </Link>
            <Link
              className="flex items-center gap-4 rounded-md bg-gray-100 p-4 transition-colors hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700"
              href="#"
            >
              <Avatar className="hidden h-9 w-9 sm:flex">
                <AvatarImage alt="Avatar" src="https://github.com/shadcn.png" />
                <AvatarFallback>JL</AvatarFallback>
              </Avatar>
              <div className="grid gap-1 flex-1">
                <p className="text-sm font-medium leading-none">Marketing Mavens</p>
                <p className="text-sm text-muted-foreground">sample@sample.com</p>
              </div>
              <div className="flex flex-col items-end gap-1">
                <span className="text-xs font-medium text-green-500">You get $200</span>
                <Button variant="outline" size="sm">Settle</Button>
              </div>
            </Link>
            <Link
              className="flex items-center gap-4 rounded-md bg-gray-100 p-4 transition-colors hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700"
              href="#"
            >
              <Avatar className="hidden h-9 w-9 sm:flex">
                <AvatarImage alt="Avatar" src="https://github.com/shadcn.png" />
                <AvatarFallback>IN</AvatarFallback>
              </Avatar>
              <div className="grid gap-1 flex-1">
                <p className="text-sm font-medium leading-none">Product Pioneers</p>
                <p className="text-sm text-muted-foreground">sample@sample.com</p>
              </div>
              <div className="flex flex-col items-end gap-1">
                <span className="text-xs font-medium text-gray-500">All settled</span>
              </div>
            </Link>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}

export default GroupPage
