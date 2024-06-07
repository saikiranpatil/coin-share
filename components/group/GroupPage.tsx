import Link from "next/link";

import { getGroupDetails } from "@/lib/actions/group";

import { Plus } from "lucide-react";

import ErrorPage from "@/components/error-page";
import CardWrapper from "@/components/my-ui/card-wrapper";
import GroupMemberCard from "@/components/group/GroupMemberCard";
import AddGroupMemberModal from "@/components/group/AddGroupMemberModal";

import {
  Card,
  CardDescription
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import NotFound from "../not-found";
import TransactionsCard from "../my-ui/transactions-card/TransactionsCard";
import EditAvatar from "@/components/my-ui/edit-avatar/edit-avatar";

const GroupPage = async ({ params }: { params: GroupPageProps }) => {
  const { groupId } = params;
  const { group, error } = await getGroupDetails(groupId);

  if (error) {
    return <ErrorPage message={error} />;
  }

  if (!group) {
    return <NotFound />;
  }

  return (
    <main className="flex flex-col justify-center gap-4 p-4 md:gap-8 md:p-8">
      <div className="flex flex-col sm:flex-row items-center justify-center">
        <EditAvatar id={groupId} type="group" imageUrl={group.imageUrl} />
        <Card className='space-y-4 p-6 text-center sm:text-left'>
          <h1 className="whitespace-nowrap text-3xl font-semibold tracking-tight">
            {group.name}
          </h1>
          <p className="text-sm text-muted-foreground">{group.statusText}</p>
        </Card>
      </div>
      <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
        <TransactionsCard
          title="Transactions"
          description="Recent transactions made by you."
          headerButton={AddTransactionsButton}
          transactions={group.transactions}
          className="xl:col-span-2"
        />
        <CardWrapper
          cardTitle="Group Members"
          cardDescription="All the members of the group."
          cardHeaderButton={<AddGroupMemberModal />}
        >
          <div className="grid">
            {
              group && group?.members?.length > 0 ?
                group.members.map((groupMember: GroupMemberPageProps) => <GroupMemberCard key={groupMember.id} groupMember={groupMember} />) :
                <CardDescription className="text-center">No Members</CardDescription>
            }
          </div>
        </CardWrapper>
      </div>
    </main>
  )
}

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

export default GroupPage