"use client";

import Link from "next/link";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { FilePlus2, LayoutTemplate, CopyPlus, Bot, Feather } from "lucide-react";
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
      <header className="px-4 lg:px-6 h-16 flex items-center border-b">
        <Link href="#" className="flex items-center justify-center gap-2" prefetch={false}>
          <Feather className="h-6 w-6 text-primary" />
          <span className="text-lg font-semibold text-primary">Nimbus AI Mate</span>
        </Link>
      </header>
      <main className="flex-1 flex items-center justify-center p-4 sm:p-8">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-primary">
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
                     <div className="bg-accent p-3 rounded-md">
                        <option.Icon className="w-6 h-6 text-primary" />
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
      <footer className="flex items-center justify-center py-4 border-t">
        <p className="text-sm text-muted-foreground">© 2024 Nimbus Uno. All rights reserved.</p>
      </footer>
    </div>
  );
}
