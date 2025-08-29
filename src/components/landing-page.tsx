
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Bot, User, FilePlus2, Eye, Share2, Trash2, Copy, Folder, Download, ClipboardPlus, CheckCircle, FileText, LayoutDashboard, Settings, FolderKanban } from "lucide-react";
import { ShareDialog } from "@/components/share-dialog";
import { TemplateSelectionDialog } from "./template-selection-dialog";
import type { Section } from "@/types/document";
import { PopulatedDocumentDialog } from "./populated-document-dialog";
import { SmartDocumentDialog } from "./smart-document-dialog";
import { CreateDocumentDialog } from "./create-document-dialog";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback } from "./ui/avatar";

type MyDocument = {
    title: string;
    lastModified: string;
    createdAt: string;
    projectId: string;
    documentType: string;
    content?: string;
    sections?: Section[];
    comments?: Comment[];
};

const sharedDocuments = [
    { title: "Q2 Financial Report", sharedBy: "Jane Doe" },
    { title: "Competitor Analysis", sharedBy: "Steve Miller" },
];

export function LandingPage() {
  const [isShareModalOpen, setShareModalOpen] = useState(false);
  const [isTemplateModalOpen, setTemplateModalOpen] = useState(false);
  const [isPopulatedModalOpen, setIsPopulatedModalOpen] = useState(false);
  const [isSmartModalOpen, setIsSmartModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<MyDocument | null>(null);
  const [myDocuments, setMyDocuments] = useState<MyDocument[]>([]);
  const [newDocumentTitle, setNewDocumentTitle] = useState("");
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedDocsString = localStorage.getItem("myDocuments");
      const storedDocs: any[] = storedDocsString ? JSON.parse(storedDocsString) : [];
      
      const enhancedDocs = storedDocs.map(doc => {
        const lastModifiedDate = new Date(doc.lastModified);
        const isValidDate = !isNaN(lastModifiedDate.getTime());

        return {
        ...doc,
        createdAt: doc.createdAt || (isValidDate ? new Date(lastModifiedDate.getTime() - 86400000).toISOString() : new Date().toISOString()),
        projectId: doc.projectId || Math.floor(1000 + Math.random() * 9000).toString(),
        documentType: doc.documentType || "Blank Document",
      }});

      setMyDocuments(enhancedDocs);
    }
  }, []);

  const handleShareClick = (doc: MyDocument) => {
    setSelectedDocument(doc);
    setShareModalOpen(true);
  };
  
  const handleDeleteDocument = (docTitle: string) => {
    const updatedDocs = myDocuments.filter(doc => doc.title !== docTitle);
    setMyDocuments(updatedDocs);
    localStorage.setItem("myDocuments", JSON.stringify(updatedDocs));
    localStorage.removeItem(`doc-history-${docTitle}`);
  };

  const handleOptionSelect = (option: 'blank' | 'template' | 'populated' | 'auto', title: string) => {
    setNewDocumentTitle(title);
    if (option === 'blank') {
        const newDoc = {
            title: title,
            lastModified: new Date().toISOString(),
            createdAt: new Date().toISOString(),
            content: '',
            sections: [],
            comments: [],
            documentType: "Blank Document",
            projectId: Math.floor(1000 + Math.random() * 9000).toString(),
        };
        const storedDocsString = localStorage.getItem("myDocuments");
        const storedDocs = storedDocsString ? JSON.parse(storedDocsString) : [];
        storedDocs.unshift(newDoc);
        localStorage.setItem("myDocuments", JSON.stringify(storedDocs));
        router.push(`/editor?title=${encodeURIComponent(newDoc.title)}`);
    } else {
        if (option === 'template') setTemplateModalOpen(true);
        if (option === 'populated') setIsPopulatedModalOpen(true);
        if (option === 'auto') setIsSmartModalOpen(true);
    }
  };


  const documentActions = [
    { icon: Eye, tooltip: "View Document" },
    { icon: Copy, tooltip: "Duplicate" },
    { icon: Folder, tooltip: "Move" },
    { icon: Download, tooltip: "Download" },
    { icon: ClipboardPlus, tooltip: "Add Results" },
    { icon: CheckCircle, tooltip: "Validate" },
    { icon: FileText, tooltip: "Generate Report" },
    { icon: Share2, tooltip: "Share" },
    { icon: Trash2, tooltip: "Delete" },
  ];
  
  const handleActionClick = (doc: MyDocument, action: string) => {
    if (action === "Share") {
      handleShareClick(doc);
    } else if (action === "Delete") {
      handleDeleteDocument(doc.title);
    } else if (action === "View Document") {
      router.push(`/editor?title=${encodeURIComponent(doc.title)}`);
    }
  };

  const formatDate = (dateString: string) => {
    try {
        if (!dateString || isNaN(new Date(dateString).getTime())) {
             return "Not available";
        }
        return format(new Date(dateString), "MMM d, yyyy");
    } catch (error) {
        return "Invalid date";
    }
  };

  return (
    <>
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center gap-2">
            <Image src="https://raw.githubusercontent.com/kannnan1/NIMBUS_Demo/main/logo.png" alt="Nimbus Uno Application Logo" width={180} height={48} />
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link href="/knowledge-store">
                  <FolderKanban />
                  Knowledge Store
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton isActive asChild>
                <Link href="/">
                  <LayoutDashboard />
                  AI Mate
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link href="/settings">
                  <Settings />
                  Settings
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
      </Sidebar>
      <SidebarInset>
        <div className="flex flex-col min-h-screen bg-muted/20">
          <header className="px-4 lg:px-6 h-16 flex items-center border-b bg-card">
              <div className="flex flex-col">
                <h1 className="text-xl font-semibold">AI Mate</h1>
                <p className="text-xs text-muted-foreground">Your AI-powered collaborative document editor</p>
              </div>
            <div className="ml-auto flex items-center gap-4">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="rounded-full">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback>K</AvatarFallback>
                            </Avatar>
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
          
          <main className="flex-1 p-4 sm:p-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-2xl font-bold tracking-tight">Recent Documents</h1>
                    <Button onClick={() => setIsCreateModalOpen(true)}>
                      <FilePlus2 className="mr-2 h-4 w-4" />
                      Create Document
                    </Button>
                </div>
                <Tabs defaultValue="my-documents">
                    <TabsList>
                        <TabsTrigger value="my-documents">Created by me</TabsTrigger>
                        <TabsTrigger value="shared-with-me">Shared with me</TabsTrigger>
                    </TabsList>
                    <TabsContent value="my-documents">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6 mt-4">
                            {myDocuments.length === 0 ? (
                               <p className="text-center text-muted-foreground mt-4 col-span-full">You haven't created any documents yet.</p>
                            ) : (
                              myDocuments.map((doc) => (
                                <Card key={doc.title} className="flex flex-col">
                                    <CardHeader className="bg-muted/50 p-4">
                                        <CardTitle className="text-base truncate">
                                          <Link href={`/editor?title=${encodeURIComponent(doc.title)}`} className="hover:underline">{doc.title}</Link>
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="p-4 grid grid-cols-2 gap-x-4 gap-y-2 text-sm flex-1">
                                        <div className="font-medium text-muted-foreground">Project ID</div>
                                        <div>{doc.projectId}</div>
                                        <div className="font-medium text-muted-foreground">Created at</div>
                                        <div>{formatDate(doc.createdAt)}</div>
                                        <div className="font-medium text-muted-foreground">Updated at</div>
                                        <div>{formatDate(doc.lastModified)}</div>
                                        <div className="font-medium text-muted-foreground">Document type</div>
                                        <div>{doc.documentType}</div>
                                    </CardContent>
                                    <div className="p-2 border-t flex flex-wrap justify-center gap-1">
                                        <TooltipProvider>
                                        {documentActions.map(({ icon: Icon, tooltip }) => (
                                            <Tooltip key={tooltip}>
                                                <TooltipTrigger asChild>
                                                    <Button 
                                                        variant="ghost" 
                                                        size="icon" 
                                                        className="h-8 w-8"
                                                        onClick={() => handleActionClick(doc, tooltip)}
                                                    >
                                                        <Icon className="h-4 w-4" />
                                                    </Button>
                                                </TooltipTrigger>
                                                <TooltipContent><p>{tooltip}</p></TooltipContent>
                                            </Tooltip>
                                        ))}
                                        </TooltipProvider>
                                    </div>
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
      </SidebarInset>

      {selectedDocument && (
        <ShareDialog
            open={isShareModalOpen}
            onOpenChange={setShareModalOpen}
            documentTitle={selectedDocument.title}
        />
      )}
    </SidebarProvider>
    <CreateDocumentDialog
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
        onOptionSelect={handleOptionSelect}
    />
    <TemplateSelectionDialog 
        open={isTemplateModalOpen}
        onOpenChange={setTemplateModalOpen}
        documentTitle={newDocumentTitle}
    />
    <PopulatedDocumentDialog
        open={isPopulatedModalOpen}
        onOpenChange={setIsPopulatedModalOpen}
        documentTitle={newDocumentTitle}
    />
    <SmartDocumentDialog
        open={isSmartModalOpen}
        onOpenChange={setIsSmartModalOpen}
        documentTitle={newDocumentTitle}
    />
    </>
  );
}
