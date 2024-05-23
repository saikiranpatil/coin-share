import Link from 'next/link';

import { ArrowUpRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  CardTitle,
  CardHeader,
  CardContent,
  Card,
  CardDescription
} from "@/components/ui/card"

import TransactionsTable from '@/components/transactions/TransactionsTable';
import Groups from '@/components/dashboard/DashboardGoupCard';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import DashboardStats from '@/components/dashboard/DashboardStats';
import TransactionsCard from '@/components/transactions/TransactionsCard';

import { getUserDetails } from '@/lib/actions/user';
import DashboardGoupCard from '@/components/dashboard/DashboardGoupCard';

export default async function Dashboard() {
  const { user } = await getUserDetails();

  if (!user) return;
  const { transactions, groups } = user;

  return (
    <main className="relative flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <DashboardHeader user={user} />
      <DashboardStats />
      <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
        <TransactionsCard
          cardTitle="Transactions"
          cardDescription="Recent transactions made by you."
          cardHeaderButton={ViewAllTransactionButton}
          className="xl:col-span-2"
        >
          <TransactionsTable transactions={transactions} />
        </TransactionsCard>
        <Card>
          <CardHeader className="flex flex-row items-center">
            <div className="grid gap-2">
              <CardTitle>Recent Groups</CardTitle>
              <CardDescription>Recent groups you were part of.</CardDescription>
            </div>
            <Button asChild className="ml-auto gap-1" size="sm">
              <Link href="/groups">
                View All
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent className="grid gap-4">
            {
              groups && groups?.length>0 ?
                groups.map(group => <DashboardGoupCard key={group.id} group={group} />) :
                <CardDescription className="text-center">No Groups</CardDescription>
            }
          </CardContent>
        </Card>
      </div>
    </main>
  )
}

const ViewAllTransactionButton = (
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
);