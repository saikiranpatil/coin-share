"use client"

import Link from "next/link"
import { usePathname } from "next/navigation";

import {
  CircleUser,
  Menu,
  PieChart,
} from 'lucide-react';

import { Button } from "@/components/ui/button"
import {
  SheetTrigger,
  SheetContent,
  Sheet
} from "@/components/ui/sheet"
import {
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenu
} from "@/components/ui/dropdown-menu";

import { ModeToggle } from "@/components/ModeToggle";
import { navItems } from "@/lib/constants";
import { DEFAULT_LOGIN_REDIRECT } from "@/lib/db/routes";
import { logout } from "@/lib/actions/user";

export default function Navbar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 flex h-16 items-center justify-between gap-4 border-b bg-background px-4 md:px-6 z-20">
      <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
        <Link className="flex items-center gap-2 text-lg font-semibold md:text-base" href={`${DEFAULT_LOGIN_REDIRECT}`}>
          <PieChart className="h-6 w-6" />
          <span>Coin Share</span>
        </Link>
        {navItems.map((navItem) => (
          <Link
            key={navItem.title}
            className={`transition-colors hover:text-foreground ${pathname == navItem.id ? "text-foreground" : "text-muted-foreground"}`}
            href={navItem.id}
          >
            {navItem.title}
          </Link>
        ))}
      </nav>
      <Sheet>
        <SheetTrigger asChild>
          <Button className="shrink-0 md:hidden" size="icon" variant="outline">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left">
          <nav className="grid gap-6 text-lg font-medium">
            <Link className="flex items-center gap-2 text-lg font-semibold" href="#">
              <PieChart className="h-6 w-6" />
              <span className="sr-only">Acme Inc</span>
            </Link>
            {navItems.map((navItem) => (
              <Link
                key={navItem.title}
                className={`hover:text-foreground ${pathname == navItem.id ? "" : "text-muted-foreground"}`}
                href={navItem.id}
              >
                {navItem.title}
              </Link>
            ))}
          </nav>
        </SheetContent>
      </Sheet>
      <div className="flex items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="rounded-full" size="icon" variant="secondary">
              <CircleUser className="h-5 w-5" />
              <span className="sr-only">Toggle user menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <Link href="/profile/edit">
                Edit Profile
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => logout()}
            >
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <ModeToggle />
      </div>
    </header>
  )
}