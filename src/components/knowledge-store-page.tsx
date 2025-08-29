
"use client";

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { UploadCloud, FileText, Loader2 } from 'lucide-react';
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
import { KnowledgeUploadDialog, type UploadMetadata } from './knowledge-upload-dialog';
import { Progress } from './ui/progress';

// Dynamically import the dialog to prevent SSR issues with react-pdf
const KnowledgeDocumentDialog = dynamic(() => import('./knowledge-document-dialog').then(mod => mod.KnowledgeDocumentDialog), {
  ssr: false,
  loading: () => <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center"><Loader2 className="w-8 h-8 text-white animate-spin" /></div>
});


type KnowledgeDocument = ProcessDocumentOutput & {
  fileName: string;
  createdAt: string;
  documentContent: string;
  documentType: string;
  sourceProject: string;
};

const sampleDocuments: KnowledgeDocument[] = [
  {
    fileName: "SR11-7_Compliance_Guide.pdf",
    title: "SR 11-7 Compliance Guide (Internal)",
    summary: "This guide provides a detailed framework for ensuring adherence to the Federal Reserve's SR 11-7 guidance on model risk management. It outlines standards for documenting model design, theory, and limitations. The document serves as a critical resource for validation teams, developers, and stakeholders, covering best practices for validation, monitoring, and governance. Key sections address independent review, conceptual soundness, data verification, and outcomes analysis. This guide is essential for mitigating model risk and ensuring regulatory compliance.",
    metadata: {
      keyTopics: ["Compliance", "SR 11-7", "Risk Management", "Validation", "Governance", "Model Theory", "Data Quality"],
      wordCount: 3450,
    },
    vectorizationStatus: "Completed",
    createdAt: "2024-07-21T10:00:00Z",
    documentContent: "https://raw.githubusercontent.com/kannnan1/NIMBUS_Demo/main/sr1107.pdf", // Using a sample PDF URL
    documentType: "Internal Policy",
    sourceProject: "Regulatory Compliance",
  },
  {
    fileName: "Project_Alpha_Methodology.txt",
    title: "Project Alpha Development Methodology",
    summary: "This document details the technical methodology for Project Alpha's predictive model, a logistic regression for assessing probability of default (PD). It explores the data handling strategy, focusing on k-NN imputation for missing income variables. The report covers the variable selection process, outlining the statistical tests and business logic behind each predictor. It also presents a comprehensive breakdown of the model's performance metrics, including Gini, AUC, and KS statistics from training and validation samples, ensuring transparent and replicable model construction.",
    metadata: {
      keyTopics: ["Project Alpha", "Methodology", "Data Handling", "Logistic Regression", "PD Models", "Imputation"],
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
    summary: "This report analyzes production model performance for Q2 2024, focusing on performance decay in high-risk segments. It presents key metrics like the Gini coefficient, KS statistic, and Population Stability Index (PSI), comparing them against established thresholds. Findings indicate a moderate drift in the underlying population and a slight degradation in the model's discriminatory power. The report concludes with a recommendation to trigger a model recalibration cycle to ensure the model remains accurate, reliable, and fit for purpose.",
    metadata: {
      keyTopics: ["Monitoring", "Q2 2024", "Performance Decay", "PSI", "Recalibration", "Model Risk"],
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
  const [processingStatus, setProcessingStatus] = useState("");
  const [processingProgress, setProcessingProgress] = useState(0);
  
  const [selectedDocument, setSelectedDocument] = useState<KnowledgeDocument | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [fileToUpload, setFileToUpload] = useState<File | null>(null);

  const { toast } = useToast();

  const handleFileDrop = async (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    const files = event.dataTransfer.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  };
  
  const handleFileInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleFileSelect = (file: File) => {
    const validTypes = ['application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain', 'text/markdown', 'application/pdf'];
    if (!validTypes.includes(file.type) && !file.name.endsWith('.md') && !file.name.endsWith('.txt') && !file.name.endsWith('.pdf')) {
      toast({
        title: "Unsupported File Type",
        description: `Please upload a .pdf, .docx, .txt, or .md file. You provided a ${file.type || 'file with no type'}.`,
        variant: "destructive",
      });
      return;
    }
    setFileToUpload(file);
    setIsUploadModalOpen(true);
  };

  const handleProcessDocument = async (file: File, metadata: UploadMetadata) => {
    setIsProcessing(true);
    setProcessingProgress(0);
    setProcessingStatus("Preparing to upload...");

    const fileReader = new FileReader();
    fileReader.readAsArrayBuffer(file);

    fileReader.onload = async (e) => {
        const arrayBuffer = e.target?.result as ArrayBuffer;
        if (!arrayBuffer) {
             toast({ title: "File Read Error", description: "Could not read the selected file.", variant: "destructive" });
             setIsProcessing(false);
             return;
        }

        try {
            // Step 1: Count Pages
            let numPages = 0;
            if (file.type === 'application/pdf') {
                const { pdfjs } = await import('react-pdf');
                pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

                setProcessingStatus("Reading PDF metadata...");
                setProcessingProgress(10);
                const pdf = await pdfjs.getDocument(arrayBuffer).promise;
                numPages = pdf.numPages;
                setProcessingStatus(`Processing ${numPages} pages...`);
            } else {
                setProcessingStatus(`Processing document...`);
            }
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Step 2: Generate Embeddings
            setProcessingProgress(40);
            setProcessingStatus("Generating embeddings...");
            await new Promise(resolve => setTimeout(resolve, 1500));

            // Step 3: Store in Vector DB
            setProcessingProgress(75);
            setProcessingStatus("Storing chunks in Vector DB...");
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            // Step 4: Call Genkit for Summary/Metadata
            const content = `Simulated content for ${file.name}. Actual content would be extracted here.`;
            const result = await processDocument({ fileName: file.name, documentContent: content });
            
            const newDocument: KnowledgeDocument = {
                ...result,
                fileName: file.name,
                createdAt: new Date().toISOString(),
                documentContent: file.type === 'application/pdf' ? URL.createObjectURL(file) : content,
                documentType: metadata.documentType,
                sourceProject: metadata.sourceProject,
            };
            setDocuments(prev => [newDocument, ...prev]);
            
            setProcessingProgress(100);
            setProcessingStatus("Processing complete!");
            await new Promise(resolve => setTimeout(resolve, 500));

            toast({
                title: "Document Processed Successfully",
                description: "Please see the repository for your uploaded document.",
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
            setProcessingProgress(0);
            setProcessingStatus("");
        }
    };
  };

  const triggerFileInput = () => {
    document.getElementById('file-input')?.click();
  };

  const handleRowClick = (doc: KnowledgeDocument) => {
    setSelectedDocument(doc);
    setIsDetailsModalOpen(true);
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
                          <p className="text-xs text-muted-foreground/80">Supports: .pdf, .docx, .txt, .md</p>
                          <input id="file-input" type="file" className="hidden" onChange={handleFileInputChange} accept=".pdf,.docx,.txt,.md,application/vnd.openxmlformats-officedocument.wordprocessingml.document" />
                        </div>
                      </CardContent>
                    </Card>
                    {isProcessing && (
                        <div className="mt-4 space-y-2 text-center">
                            <Progress value={processingProgress} className="w-full" />
                            <div className="flex items-center justify-center gap-2 text-muted-foreground text-sm">
                                <Loader2 className="w-4 h-4 animate-spin" />
                                <span>{processingStatus}</span>
                            </div>
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
                                                    {doc.metadata.keyTopics.slice(0, 4).map(topic => (
                                                        <Badge key={topic} variant="secondary">{topic}</Badge>
                                                    ))}
                                                    {doc.metadata.keyTopics.length > 4 && <Badge variant="outline">+{doc.metadata.keyTopics.length - 4}</Badge>}
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
            open={isDetailsModalOpen}
            onOpenChange={setIsDetailsModalOpen}
            document={selectedDocument}
        />
     )}
     {fileToUpload && (
        <KnowledgeUploadDialog
            open={isUploadModalOpen}
            onOpenChange={setIsUploadModalOpen}
            fileName={fileToUpload.name}
            onUpload={(metadata) => {
                if (fileToUpload) {
                    handleProcessDocument(fileToUpload, metadata);
                }
            }}
        />
     )}
    </>
  );
}
