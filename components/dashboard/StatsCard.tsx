import React from 'react';
import { IconKey, icons } from '../../lib/constants/icons';
import {
    CardTitle,
    CardHeader,
    CardContent,
    Card,
} from "@/components/ui/card";

interface StatsCardProps extends React.HTMLAttributes<HTMLDivElement> {
    statsTitle: string;
    statsIcon: IconKey;
    statsValue: string;
    statsDescription: string;
}

const StatsCard = React.forwardRef<HTMLDivElement, StatsCardProps>(({
    statsTitle,
    statsValue,
    statsIcon,
    statsDescription,
    ...props
}, ref) => {
    const StatsIcon = icons[statsIcon];
    return (
        <Card
            ref={ref}
            {...props}
        >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{statsTitle}</CardTitle>
                <StatsIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{statsValue}</div>
                {/* <p className="text-xs text-muted-foreground">{statsDescription}</p> */}
            </CardContent>
        </Card>
    )
});

StatsCard.displayName = "StatsCard";

export default StatsCard
