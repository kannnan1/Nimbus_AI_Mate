"use client";

import Link from "next/link";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Bot, Feather, User, FilePlus2, LayoutTemplate, CopyPlus } from "lucide-react";
import type { LucideIcon } from "lucide-react";

const options: {
  title: string;
  description: string;
  href: string;
  Icon: LucideIcon;
}[] = [
  {
    title: "Start Blank Document",
    description: "Begin with a clean slate and build your document from scratch.",
    href: "/editor",
    Icon: FilePlus2,
  },
  {
    title: "Start with Template",
    description: "Choose from a library of pre-built templates to get started faster.",
    href: "/editor",
    Icon: LayoutTemplate,
  },
  {
    title: "Start with Populated Document",
    description: "Use data from another module to partially create your document.",
    href: "/editor",
    Icon: CopyPlus,
  },
  {
    title: "Select Auto Document",
    description: "Combine a data pipeline and a template to generate a document automatically.",
    href: "/editor",
    Icon: Bot,
  },
];

export function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-4 lg:px-6 h-16 flex items-center" style={{ backgroundColor: '#272d55' }}>
        <Link href="#" className="flex items-center justify-center gap-2" prefetch={false}>
          <Feather className="h-6 w-6 text-white" />
          <span className="text-lg font-semibold text-white">Nimbus Uno</span>
        </Link>
        <div className="ml-auto">
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="rounded-full">
                        <User className="h-5 w-5 text-white" />
                        <span className="sr-only">User Menu</span>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>Profile</DropdownMenuItem>
                    <DropdownMenuItem>Settings</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>Logout</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
      </header>
      <div className="flex flex-1">
        <aside className="w-64 border-r p-4 bg-[hsl(var(--sidebar-background))]">
            <nav className="flex flex-col gap-2">
                <Link href="#" className="flex items-center gap-2 p-2 rounded-md bg-accent text-accent-foreground" prefetch={false}>
                    <Bot className="w-5 h-5" />
                    <span>AI Mate</span>
                </Link>
            </nav>
        </aside>
        <main className="flex-1 flex items-center justify-center p-4 sm:p-8 bg-background">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Welcome to Nimbus AI Mate
            </h1>
            <p className="mt-4 text-muted-foreground md:text-xl">
              Your intelligent assistant for collaborative document creation.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
              {options.map((option) => (
                <Link href={option.href} key={option.title}>
                  <Card className="p-4 h-full text-left hover:shadow-lg hover:border-primary/50 transition-all duration-300 transform hover:-translate-y-1 cursor-pointer">
                    <CardHeader className="flex flex-row items-center gap-4 space-y-0">
                       <div className="bg-muted p-3 rounded-md">
                          <option.Icon className="w-6 h-6 text-foreground" />
                       </div>
                       <div>
                          <CardTitle>{option.title}</CardTitle>
                          <CardDescription className="mt-1">{option.description}</CardDescription>
                       </div>
                    </CardHeader>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </main>
      </div>
      <footer className="flex items-center justify-center py-4 border-t">
        <p className="text-sm text-muted-foreground">© 2024 Nimbus Uno. All rights reserved.</p>
      </footer>
    </div>
  );
}
