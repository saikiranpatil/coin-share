import Link from 'next/link';

import {
  IndianRupee,
  ReceiptText,
  Activity,
  ArrowUpRight,
} from 'lucide-react';

import {
  CardTitle,
  CardHeader,
  CardContent,
  Card,
  CardDescription,
} from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import TransactionsTable from '@/components/TransactionsTable';

import Groups from './components/Groups';

export default function Dashboard() {
  return (
    <main className="relative flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="absolute top-0">
        <Avatar className='relative inline-block h-48 w-48 z-[1] m-6'>
          <AvatarImage src="https://github.com/shadcn.png" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      </div>
      <Card className='flex flex-col sm:flex-row gap-4 justify-between items-center relative sm:text-left text-center p-6 mt-28 pt-24'>
        <div className="space-y-1.5">
          <h1 className="whitespace-nowrap text-3xl font-semibold tracking-tight">
            Saikiran Patil
          </h1>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">patilrsaikiran@gmail.com</p>
            <p className="text-xs text-muted-foreground">Joined on 26 July 2022</p>
          </div>
        </div>
        <Button>
          Edit Profile
        </Button>
      </Card>
      <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-3">
        <Card x-chunk="dashboard-01-chunk-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Totally, you owe </CardTitle>
            <IndianRupee className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹ 5,452</div>
            <p className="text-xs text-muted-foreground">+20.1% from last month</p>
          </CardContent>
        </Card>
        <Card x-chunk="dashboard-01-chunk-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Expense</CardTitle>
            <ReceiptText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹ 10,452</div>
            <p className="text-xs text-muted-foreground">+20% from last month</p>
          </CardContent>
        </Card>
        <Card x-chunk="dashboard-01-chunk-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Transaction</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">154</div>
            <p className="text-xs text-muted-foreground">+19% from last month</p>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
        <Card className="xl:col-span-2" x-chunk="dashboard-01-chunk-4">
          <CardHeader className="flex flex-row items-center">
            <div className="grid gap-2">
              <CardTitle>Transactions</CardTitle>
              <CardDescription>Recent transactions made by you.</CardDescription>
            </div>
            <Button
              asChild
              className="ml-auto gap-1"
              size="sm"
            >
              <Link href="/transactions">
                View All
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <TransactionsTable />
          </CardContent>
        </Card>
        <Groups />
      </div>
    </main>
  )
}