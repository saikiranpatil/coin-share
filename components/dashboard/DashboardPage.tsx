import Link from 'next/link';

import { ArrowUpRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CardDescription } from "@/components/ui/card"

import DashboardHeader from '@/components/dashboard/DashboardHeader';
import DashboardStats from '@/components/dashboard/DashboardStats';
import TransactionsCard from '@/components/transactions/TransactionsCard';

import { getUserDetails } from '@/lib/actions/user';
import DashboardGoupCard from '@/components/dashboard/DashboardGoupCard';
import NotFound from '@/components/not-found';
import ErrorPage from '@/components/error-page';
import CardWrapper from '../card-wrapper';

export default async function Dashboard() {
  const { user, error } = await getUserDetails();

  if (error) {
    return <ErrorPage message={error} />;
  }

  if (!user) {
    return <NotFound />
  }

  const { transactions, groups, ...remainingUserDetails } = user;

  return (
    <main className="relative flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <DashboardHeader user={remainingUserDetails} />
      <DashboardStats />
      <div className="grid gap-4 md:gap-8 grid-cols lg:grid-cols-2 xl:grid-cols-3">
        <TransactionsCard
          title="Transactions"
          description="Recent transactions made by you."
          headerButton={ViewAllTransactionButton}
          transactions={transactions}
          className="xl:col-span-2"
        />
        <CardWrapper
          cardTitle="Recent Groups"
          cardDescription="Recent groups you were part of"
          cardHeaderButton={ViewAllGroupsButton}
        >
          <div className="space-y-4">
            {
              groups && groups?.length > 0 ?
                groups.map(group => <DashboardGoupCard key={group.id} group={group} />)
                :
                <CardDescription className="text-center">No Groups</CardDescription>
            }
          </div>
        </CardWrapper>
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

const ViewAllGroupsButton = (
  <Button asChild className="ml-auto gap-1" size="sm">
    <Link href="/groups">
      View All
      <ArrowUpRight className="h-4 w-4" />
    </Link>
  </Button>
);