import GroupCard from '@/components/GroupCard'

const GroupsPage = () => {
  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <div className="flex flex-col sm:gap-4 sm:py-4">
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0">
          <div className="grid auto-rows-max items-start gap-2 lg:col-span-2">
            <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
              Groups
            </h1>
            <p className="text-sm text-muted-foreground">List of all the groups are shown here.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            <GroupCard />
          </div>
        </main>
      </div>
    </div>
  )
}

export default GroupsPage
