
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Bot, Feather, User, FilePlus2, LayoutTemplate, CopyPlus, Eye, Share2, MoreVertical, Trash2 } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { ShareDialog } from "@/components/share-dialog";

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

type MyDocument = {
    title: string;
    lastModified: string;
    content?: string;
};

const sharedDocuments = [
    { title: "Q2 Financial Report", sharedBy: "Jane Doe" },
    { title: "Competitor Analysis", sharedBy: "Steve Miller" },
];

export function LandingPage() {
  const [isShareModalOpen, setShareModalOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<{ title: string } | null>(null);
  const [myDocuments, setMyDocuments] = useState<MyDocument[]>([]);

  useEffect(() => {
    // We need to check for `window` because this component is rendered on the server first.
    if (typeof window !== "undefined") {
      const storedDocs = localStorage.getItem("myDocuments");
      if (storedDocs) {
        setMyDocuments(JSON.parse(storedDocs));
      }
    }
  }, []);

  const handleShareClick = (doc: { title: string }) => {
    setSelectedDocument(doc);
    setShareModalOpen(true);
  };
  
  const handleDeleteDocument = (docTitle: string) => {
    const updatedDocs = myDocuments.filter(doc => doc.title !== docTitle);
    setMyDocuments(updatedDocs);
    localStorage.setItem("myDocuments", JSON.stringify(updatedDocs));
  };

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
        <main className="flex-1 flex flex-col justify-between p-4 sm:p-8 bg-background">
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

          <div className="mt-12 max-w-4xl mx-auto w-full">
             <h2 className="text-2xl font-bold tracking-tight mb-4">Recent Documents</h2>
             <Tabs defaultValue="my-documents">
                <TabsList>
                    <TabsTrigger value="my-documents">Created by me</TabsTrigger>
                    <TabsTrigger value="shared-with-me">Shared with me</TabsTrigger>
                </TabsList>
                <TabsContent value="my-documents">
                    <div className="grid gap-4 mt-4">
                        {myDocuments.length === 0 ? (
                           <p className="text-center text-muted-foreground mt-4">You haven't created any documents yet.</p>
                        ) : (
                          myDocuments.map((doc) => (
                            <Card key={doc.title}>
                                <CardContent className="p-4 flex items-center justify-between">
                                    <div>
                                        <h3 className="font-semibold">{doc.title}</h3>
                                        <p className="text-sm text-muted-foreground">Last modified: {doc.lastModified}</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <TooltipProvider>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <Button variant="ghost" size="icon" asChild>
                                                        <Link href={`/editor?title=${encodeURIComponent(doc.title)}`}><Eye className="h-4 w-4" /></Link>
                                                    </Button>
                                                </TooltipTrigger>
                                                <TooltipContent><p>Open document</p></TooltipContent>
                                            </Tooltip>
                                             <Tooltip>
                                                <TooltipTrigger asChild><Button variant="ghost" size="icon" onClick={() => handleShareClick(doc)}><Share2 className="h-4 w-4" /></Button></TooltipTrigger>
                                                <TooltipContent><p>Share</p></TooltipContent>
                                            </Tooltip>
                                            <Tooltip>
                                                <TooltipTrigger asChild><Button variant="ghost" size="icon" onClick={() => handleDeleteDocument(doc.title)}><Trash2 className="h-4 w-4 text-destructive/70" /></Button></TooltipTrigger>
                                                <TooltipContent><p>Delete</p></TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild><Button variant="ghost" size="icon"><MoreVertical className="h-4 w-4" /></Button></DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem>Rename</DropdownMenuItem>
                                                <DropdownMenuItem>Make a copy</DropdownMenuItem>
                                                <DropdownMenuItem>Download</DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                </CardContent>
                            </Card>
                          ))
                        )}
                    </div>
                </TabsContent>
                <TabsContent value="shared-with-me">
                     <div className="grid gap-4 mt-4">
                        {sharedDocuments.map((doc) => (
                            <Card key={doc.title}>
                                <CardContent className="p-4 flex items-center justify-between">
                                    <div>
                                        <h3 className="font-semibold">{doc.title}</h3>
                                        <p className="text-sm text-muted-foreground">Shared by: {doc.sharedBy}</p>
                                    </div>
                                     <div className="flex items-center gap-2">
                                        <TooltipProvider>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <Button variant="ghost" size="icon" asChild>
                                                        <Link href="/editor"><Eye className="h-4 w-4" /></Link>
                                                    </Button>
                                                </TooltipTrigger>
                                                <TooltipContent><p>Open document</p></TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </TabsContent>
             </Tabs>
          </div>
        </main>
      </div>
      <footer className="flex items-center justify-center py-4 border-t">
        <p className="text-sm text-muted-foreground">© 2024 Nimbus Uno. All rights reserved.</p>
      </footer>

      {selectedDocument && (
        <ShareDialog
            open={isShareModalOpen}
            onOpenChange={setShareModalOpen}
            documentTitle={selectedDocument.title}
        />
      )}
    </div>
  );
}
