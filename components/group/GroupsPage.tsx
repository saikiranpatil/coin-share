import { getAllGroups } from '@/lib/actions/group';

import GroupCard from '@/components/group/GroupCard'
import CreateGroupModal from "@/components/group/CreateGroupModal";
import ErrorPage from '@/components/error-page';

const GroupsPage = async () => {
  const { groups, error } = await getAllGroups();

  if (error) {
    return <ErrorPage message={error} />;
  }

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <div className="flex flex-col sm:gap-4 sm:py-4">
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0">
          <div className="flex sm:flex-row flex-col justify-between sm:items-end items-center text-center sm:text-left gap-4">
            <div>
              <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
                Groups
              </h1>
              <p className="text-sm text-muted-foreground">List of all the groups are shown here.</p>
            </div>
            <CreateGroupModal />
          </div>
          {
            groups && groups.length
              ?
              <div className="grid gap-8 grid-cols-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 justify-between">
                {groups.map(group => <GroupCard key={group.id} groupData={group} />)}
              </div>
              :
              <h1 className='text-sm text-center'>
                No groups to show here
              </h1>
          }
        </main>
      </div>
    </div>
  )
}

export default GroupsPage
