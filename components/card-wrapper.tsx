import React from "react";

import {
    CardTitle,
    CardHeader,
    CardContent,
    Card,
    CardDescription,
} from "@/components/ui/card";

interface CardWrapperProps extends React.HTMLAttributes<HTMLDivElement> {
    cardTitle: string;
    cardDescription: string;
    cardHeaderButton?: React.ReactNode;
    children: React.ReactNode;
}

const CardWrapper = React.forwardRef<HTMLDivElement, CardWrapperProps>(({
    cardTitle,
    cardDescription,
    cardHeaderButton,
    children,
    ...props
}, ref) => (
    <Card
        ref={ref}
        {...props}
    >
        <CardHeader className="flex flex-row items-center justify-between">
            <div className="grid gap-2">
                <CardTitle>{cardTitle}</CardTitle>
                <CardDescription>{cardDescription}</CardDescription>
            </div>
            {cardHeaderButton && <div>{cardHeaderButton}</div>}
        </CardHeader>
        <CardContent>
            {children}
        </CardContent>
    </Card>
));

CardWrapper.displayName = "CardWrapper";

export default CardWrapper
