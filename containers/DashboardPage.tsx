import Link from 'next/link';

import { ArrowUpRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

import TransactionsTable from '@/components/TransactionsTable';
import Groups from '@/app/components/Groups';
import DashboardHeader from '@/components/DashboardHeader';
import DashboardStats from '@/components/DashboardStats';
import CardWrapper from '@/components/CardWrapper';
import TransactionsCard from '@/components/TransactionsCard';

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

export default function Dashboard() {
  return (
    <main className="relative flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <DashboardHeader />
      <DashboardStats />
      <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
        <TransactionsCard
          cardTitle="Transactions"
          cardDescription="Recent transactions made by you."
          cardHeaderButton={ViewAllTransactionButton}
          className="xl:col-span-2"
        >
          <TransactionsTable />
        </TransactionsCard>
        <Groups />
      </div>
    </main>
  )
}