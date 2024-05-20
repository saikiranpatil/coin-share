import Link from "next/link";

import { Plus, UserPlus } from "lucide-react";

import CardWrapper from "@/components/CardWrapper";
import GroupMembersCard from "@/components/group/GroupMembersCard";
import TransactionsTable from "@/components/transactions/TransactionsTable";

import {
  Avatar,
  AvatarFallback,
  AvatarImage
} from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";


const AddTransactionsButton = (
  <Button
    asChild
    className="ml-auto gap-1"
    size="sm"
  >
    <Link href="/transactions/add">
      <Plus className="h-4 w-4" />
      Add Transaction
    </Link>
  </Button>
)

const AddUserButton = (
  <Button asChild className="ml-auto gap-1" size="sm">
    <Link href="/groups">
      <UserPlus className="h-4 w-4" />
      Add Member
    </Link>
  </Button>
)

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
        <CardWrapper
          cardTitle="Transactions"
          cardDescription="Recent transactions from this group."
          cardHeaderButton={AddTransactionsButton}
          className="xl:col-span-2"
        >
          <TransactionsTable showGroupName={false} />
        </CardWrapper>
        <CardWrapper
          cardTitle="Group Members"
          cardDescription="All the members of the group."
          cardHeaderButton={AddUserButton}
        >
          <div className="grid gap-4">
            <GroupMembersCard />
          </div>
        </CardWrapper>
      </div>
    </main>
  )
}

export default GroupPage