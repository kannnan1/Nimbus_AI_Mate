
"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { UploadCloud, FileText, Loader2, BrainCircuit, Tag, WholeWord } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { processDocument, type ProcessDocumentOutput } from '@/ai/flows/process-document';
import Link from 'next/link';
import Image from "next/image";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider
} from "@/components/ui/sidebar";
import { LayoutDashboard, Users, Settings, FolderKanban } from 'lucide-react';


type KnowledgeDocument = ProcessDocumentOutput & {
  fileName: string;
  createdAt: string;
};

export function KnowledgeStorePage() {
  const [documents, setDocuments] = useState<KnowledgeDocument[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const handleFileDrop = async (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    const files = event.dataTransfer.files;
    if (files && files.length > 0) {
      handleFileUpload(files[0]);
    }
  };
  
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const handleFileUpload = (file: File) => {
    const validTypes = ['application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain', 'text/markdown'];
    if (!validTypes.includes(file.type)) {
      toast({
        title: "Unsupported File Type",
        description: `Please upload a .docx, .txt, or .md file. You provided a ${file.type} file.`,
        variant: "destructive",
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = async (e) => {
        const content = e.target?.result as string;
        if (content) {
            setIsProcessing(true);
            try {
                const result = await processDocument({ fileName: file.name, documentContent: content });
                const newDocument: KnowledgeDocument = {
                    ...result,
                    fileName: file.name,
                    createdAt: new Date().toISOString(),
                };
                setDocuments(prev => [newDocument, ...prev]);
                toast({
                    title: "Document Processed",
                    description: `"${file.name}" has been added to the knowledge store.`,
                });
            } catch (error) {
                console.error(error);
                toast({
                    title: "Processing Failed",
                    description: "There was an error processing your document.",
                    variant: "destructive",
                });
            } finally {
                setIsProcessing(false);
            }
        }
    };
    reader.readAsText(file);
  };

  const triggerFileInput = () => {
    document.getElementById('file-input')?.click();
  };
  

  return (
     <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center gap-2">
            <Image src="https://raw.githubusercontent.com/kannnan1/NIMBUS_Demo/main/logo.png" alt="Nimbus Uno Application Logo" width={150} height={40} />
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
              <SidebarMenuButton asChild>
                 <Link href="/">
                  <LayoutDashboard />
                  AI Mate
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton>
                <Users />
                Team
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton>
                <Settings />
                Settings
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
      </Sidebar>
      <SidebarInset>
        <div className="flex flex-col min-h-screen bg-muted/20 p-4 sm:p-8">
           <header className="mb-8">
              <h1 className="text-3xl font-bold tracking-tight">Knowledge Store</h1>
              <p className="text-muted-foreground">Upload documents to build your organization's knowledge base for the AI Mate.</p>
           </header>
          
          <main className="flex-1 space-y-8">
            <Card 
              className="border-2 border-dashed border-muted-foreground/30 hover:border-primary/50 transition-colors"
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleFileDrop}
            >
              <CardContent className="p-10 text-center">
                <div className="flex flex-col items-center gap-4">
                  <div className="bg-primary/10 p-4 rounded-full">
                    <UploadCloud className="w-10 h-10 text-primary" />
                  </div>
                  <p className="text-muted-foreground">
                    Drag & drop your files here or <span className="text-primary font-semibold cursor-pointer" onClick={triggerFileInput}>browse</span>
                  </p>
                  <p className="text-xs text-muted-foreground/80">Supports: .docx, .txt, .md</p>
                  <input id="file-input" type="file" className="hidden" onChange={handleFileSelect} accept=".docx,.txt,.md" />
                </div>
              </CardContent>
            </Card>

            {isProcessing && (
                <div className="flex items-center justify-center gap-2 text-muted-foreground">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Processing document...</span>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {documents.map((doc, index) => (
                <Card key={index} className="flex flex-col">
                  <CardHeader>
                    <CardTitle className="flex items-start gap-3">
                        <FileText className="w-6 h-6 text-primary shrink-0 mt-1" />
                        <span className="truncate">{doc.title}</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex-1 space-y-4">
                    <div>
                        <h4 className="font-semibold text-sm mb-2 flex items-center gap-2"><BrainCircuit className="w-4 h-4 text-muted-foreground" />Summary</h4>
                        <p className="text-sm text-muted-foreground line-clamp-4">{doc.summary}</p>
                    </div>
                    <div>
                        <h4 className="font-semibold text-sm mb-2 flex items-center gap-2"><Tag className="w-4 h-4 text-muted-foreground" />Key Topics</h4>
                        <div className="flex flex-wrap gap-2">
                           {doc.metadata.keyTopics.map(topic => (
                               <span key={topic} className="px-2 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full">{topic}</span>
                           ))}
                        </div>
                    </div>
                     <div>
                        <h4 className="font-semibold text-sm mb-2 flex items-center gap-2"><WholeWord className="w-4 h-4 text-muted-foreground" />Metadata</h4>
                        <p className="text-sm text-muted-foreground">
                           Word Count: {doc.metadata.wordCount} | Vectorization: <span className="text-green-600 font-semibold">{doc.vectorizationStatus}</span>
                        </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </main>
        </div>
      </SidebarInset>
     </SidebarProvider>
  );
}
