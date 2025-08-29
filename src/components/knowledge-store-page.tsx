
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { KnowledgeDocumentDialog } from './knowledge-document-dialog';


type KnowledgeDocument = ProcessDocumentOutput & {
  fileName: string;
  createdAt: string;
  documentContent: string;
  documentType: string;
  sourceProject: string;
};

const sampleDocuments: KnowledgeDocument[] = [
  {
    fileName: "SR11-7_Compliance_Guide.txt",
    title: "SR 11-7 Compliance Guide (Internal)",
    summary: "An internal guide outlining the standards and procedures for documenting model limitations and ensuring compliance with SR 11-7 regulations. Covers best practices for risk assessment, reporting, and independent validation.",
    metadata: {
      keyTopics: ["Compliance", "SR 11-7", "Risk Management", "Validation", "Governance"],
      wordCount: 3450,
    },
    vectorizationStatus: "Completed",
    createdAt: "2024-07-21T10:00:00Z",
    documentContent: "This document provides a detailed walkthrough of SR 11-7 requirements...\n\nSection 1: Introduction to Model Risk Management...\nSection 2: Documentation Standards...\nSection 3: Independent Validation...\nSection 4: Governance and Oversight...",
    documentType: "Internal Policy",
    sourceProject: "Regulatory Compliance",
  },
  {
    fileName: "Project_Alpha_Methodology.txt",
    title: "Project Alpha Development Methodology",
    summary: "Details the development methodology for Project Alpha, focusing on the approach for handling missing data in income variables and the use of logistic regression for PD models. It also covers variable selection and model performance metrics.",
    metadata: {
      keyTopics: ["Project Alpha", "Methodology", "Data Handling", "Logistic Regression", "PD Models"],
      wordCount: 5210,
    },
    vectorizationStatus: "Completed",
    createdAt: "2024-06-15T14:30:00Z",
    documentContent: "The methodology for Project Alpha is grounded in robust statistical techniques...\n\nData Imputation: We utilize a k-NN imputation model for missing income data...\nModel Specification: The primary model is a logistic regression...\nPerformance Metrics: Gini, AUC, and KS statistics are used for evaluation.",
    documentType: "Technical Documentation",
    sourceProject: "Retail Credit Risk",
  },
  {
    fileName: "Q2_2024_Monitoring_Report.txt",
    title: "Q2 2024 Model Monitoring Report",
    summary: "Contains analysis of model performance decay in high-risk segments for the second quarter of 2024. Includes Gini, KS, and Population Stability Index (PSI) metrics and recommends model recalibration.",
    metadata: {
      keyTopics: ["Monitoring", "Q2 2024", "Performance", "PSI", "Recalibration"],
      wordCount: 2100,
    },
    vectorizationStatus: "Completed",
    createdAt: "2024-07-05T09:00:00Z",
    documentContent: "This report summarizes the monitoring results for Q2 2024...\n\nKey Metrics:\n- Gini Coefficient: 0.72 (down from 0.75)\n- Population Stability Index: 0.18 (Moderate drift observed)...\n- Recommendation: Recalibrate the model in Q3 2024.",
    documentType: "Quarterly Report",
    sourceProject: "Retail Credit Risk",
  }
];


export function KnowledgeStorePage() {
  const [documents, setDocuments] = useState<KnowledgeDocument[]>(sampleDocuments);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<KnowledgeDocument | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
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
    if (!validTypes.includes(file.type) && !file.name.endsWith('.md') && !file.name.endsWith('.txt')) {
      toast({
        title: "Unsupported File Type",
        description: `Please upload a .docx, .txt, or .md file. You provided a ${file.type || 'file with no type'}.`,
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
                    documentContent: content,
                    documentType: "Uploaded Document",
                    sourceProject: "Uncategorized",
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

  const handleRowClick = (doc: KnowledgeDocument) => {
    setSelectedDocument(doc);
    setIsModalOpen(true);
  };
  

  return (
    <>
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
              <SidebarMenuButton asChild isActive>
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
              <p className="text-muted-foreground">Upload and manage documents to build your organization's knowledge base for the AI Mate.</p>
           </header>
          
          <main className="flex-1">
            <Tabs defaultValue="repository">
                <TabsList>
                    <TabsTrigger value="upload">Upload Document</TabsTrigger>
                    <TabsTrigger value="repository">Repository</TabsTrigger>
                </TabsList>
                <TabsContent value="upload" className="mt-6">
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
                          <input id="file-input" type="file" className="hidden" onChange={handleFileSelect} accept=".docx,.txt,.md,application/vnd.openxmlformats-officedocument.wordprocessingml.document" />
                        </div>
                      </CardContent>
                    </Card>
                    {isProcessing && (
                        <div className="flex items-center justify-center gap-2 text-muted-foreground mt-4">
                            <Loader2 className="w-5 h-5 animate-spin" />
                            <span>Processing document...</span>
                        </div>
                    )}
                </TabsContent>
                <TabsContent value="repository" className="mt-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Document Repository</CardTitle>
                            <CardDescription>Browse and manage all uploaded documents.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Title</TableHead>
                                        <TableHead>Key Topics</TableHead>
                                        <TableHead>Status</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {documents.length > 0 ? documents.map((doc) => (
                                        <TableRow key={doc.fileName} onClick={() => handleRowClick(doc)} className="cursor-pointer">
                                            <TableCell className="font-medium">{doc.title}</TableCell>
                                            <TableCell>
                                                <div className="flex flex-wrap gap-1">
                                                    {doc.metadata.keyTopics.map(topic => (
                                                        <Badge key={topic} variant="secondary">{topic}</Badge>
                                                    ))}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                 <Badge className={doc.vectorizationStatus === 'Completed' ? 'bg-green-100 text-green-800' : ''}>
                                                    {doc.vectorizationStatus}
                                                </Badge>
                                            </TableCell>
                                        </TableRow>
                                    )) : (
                                        <TableRow>
                                            <TableCell colSpan={3} className="h-24 text-center">
                                                No documents uploaded yet.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
          </main>
        </div>
      </SidebarInset>
     </SidebarProvider>
     {selectedDocument && (
        <KnowledgeDocumentDialog
            open={isModalOpen}
            onOpenChange={setIsModalOpen}
            document={selectedDocument}
        />
     )}
    </>
  );
}
