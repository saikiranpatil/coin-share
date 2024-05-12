import { TooltipProvider } from "../ui/tooltip";
import { ThemeProvider } from "./ThemeProvider";

export default function AllProviders({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
        >
            <TooltipProvider>
                {children}
            </TooltipProvider>
        </ThemeProvider>
    );
}
