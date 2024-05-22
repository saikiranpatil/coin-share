import React from 'react'

import { Calendar } from 'lucide-react'

import DashboardAvatar from './DashboardAvatar'
import { Card } from '../ui/card'
import { Button } from '../ui/button'

const DashboardHeader = ({ user }) => {
    return (
        <>
            <DashboardAvatar />
            <Card className='flex flex-col sm:flex-row gap-4 justify-between items-center sm:items-end relative sm:text-left text-center p-6 mt-28 pt-24'>
                <div>
                    <h4 className="whitespace-nowrap text-3xl font-semibold tracking-tight">
                        {user?.name}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                        {user?.email}
                    </p>
                    <div className="flex items-center pt-4">
                        <Calendar className="mr-2 h-4 w-4 opacity-70" />{" "}
                        <span className="text-xs text-muted-foreground">
                            Joined on {user?.createdAt}
                        </span>
                    </div>
                </div>
                <Button>
                    Edit Profile
                </Button>
            </Card>
        </>
    )
}

export default DashboardHeader
