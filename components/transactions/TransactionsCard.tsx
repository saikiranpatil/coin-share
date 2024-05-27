import React from "react";

import {
    File,
    ListFilter,
} from "lucide-react"

import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"

import { Button } from "../ui/button";
import CardWrapper from "../CardWrapper"
import TransactionsTable from "./TransactionsTable";

interface TransactionsCardProps extends React.HTMLAttributes<HTMLDivElement> {
    title: string;
    description: string;
    headerButton?: React.ReactNode;
    transactions: any;
}

const TransactionsCard = React.forwardRef<HTMLDivElement, TransactionsCardProps>(({
    title,
    description,
    headerButton,
    transactions,
    ...props
}, ref) => {
    return (
        <CardWrapper
            ref={ref}
            cardTitle={title}
            cardDescription={description}
            cardHeaderButton={headerButton}
            {...props}
        >
            <Tabs defaultValue="week">
                <div className="flex items-center">
                    <TabsList>
                        <TabsTrigger value="week">Week</TabsTrigger>
                        <TabsTrigger value="month">Month</TabsTrigger>
                        <TabsTrigger value="year">Year</TabsTrigger>
                    </TabsList>
                    <div className="ml-auto flex items-center gap-2 mb-4">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="h-7 gap-1 text-sm"
                                >
                                    <ListFilter className="h-3.5 w-3.5" />
                                    <span className="sr-only sm:not-sr-only">Filter</span>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Filter by</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuCheckboxItem checked>
                                    Fulfilled
                                </DropdownMenuCheckboxItem>
                                <DropdownMenuCheckboxItem>
                                    Declined
                                </DropdownMenuCheckboxItem>
                                <DropdownMenuCheckboxItem>
                                    Refunded
                                </DropdownMenuCheckboxItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                        <Button
                            size="sm"
                            variant="outline"
                            className="h-7 gap-1 text-sm"
                        >
                            <File className="h-3.5 w-3.5" />
                            <span className="sr-only sm:not-sr-only">Export</span>
                        </Button>
                    </div>
                </div>
                <TabsContent value="week">
                    <TransactionsTable transactions={transactions} />
                </TabsContent>
            </Tabs>
        </CardWrapper>
    )
});

TransactionsCard.displayName = "TransactionsCard";

export default TransactionsCard
