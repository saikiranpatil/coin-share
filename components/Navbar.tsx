"use client"

import Link from "next/link"
import { usePathname } from "next/navigation";

import {
  CircleUser,
  Search,
  Menu,
  Package,
} from 'lucide-react';

import { Button } from "@/components/ui/button"
import {
  SheetTrigger,
  SheetContent,
  Sheet
} from "@/components/ui/sheet"
import { Input } from "@/components/ui/input"
import {
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenu
} from "@/components/ui/dropdown-menu";

import { ModeToggle } from "@/components/ModeToggle";
import { navItems } from "@/constants";

export default function Navbar() {
  const pathname = usePathname();

  console.log(pathname);

  return (
    <header className="sticky top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
      <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
        <Link className="flex items-center gap-2 text-lg font-semibold md:text-base" href="/">
          <Package className="h-6 w-6" />
          <span className="sr-only">Acme Inc</span>
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
              <Package className="h-6 w-6" />
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
      <div className="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
        <form className="ml-auto flex-1 sm:flex-initial">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              className="pl-8 sm:w-[300px] md:w-[200px] lg:w-[300px]"
              placeholder="Search products..."
              type="search"
            />
          </div>
        </form>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="rounded-full" size="icon" variant="secondary">
              <CircleUser className="h-5 w-5" />
              <span className="sr-only">Toggle user menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuItem>Support</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <ModeToggle />
      </div>
    </header>
  )
}