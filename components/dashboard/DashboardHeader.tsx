import React from 'react'

import { Calendar } from 'lucide-react'

import { Card } from '../ui/card'
import { Button } from '../ui/button'
import Link from 'next/link'
import EditAvatar from '../edit-avatar/edit-avatar'

interface DashboardHeaderProps {
    user: UserSelectListProps
}

const DashboardHeader = ({ user }: DashboardHeaderProps) => {
    return (
        <>
            <EditAvatar className="absolute top-0 left-[calc(50%-120px)] sm:left-8" user={user} />
            <Card className='flex flex-col sm:flex-row gap-4 justify-between items-center sm:items-end relative sm:text-left text-center p-6 mt-28 pt-24'>
                <div>
                    <h4 className="whitespace-nowrap text-3xl font-semibold tracking-tight">
                        {user.name}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                        {user.email}
                    </p>
                    <div className="flex justify-start pt-4">
                        <Calendar className="mr-2 h-4 w-4 opacity-70" />{" "}
                        <span className="text-xs text-muted-foreground">
                            Joined on {user.createdAt}
                        </span>
                    </div>
                </div>
                <Button>
                    <Link href="/profile/edit">
                        Edit Profile
                    </Link>
                </Button>
            </Card>
        </>
    )
}

export default DashboardHeader
