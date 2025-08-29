
"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import type { ProcessDocumentOutput } from "@/ai/flows/process-document";
import { BrainCircuit, Tag, WholeWord, FileText, CheckCircle2, Calendar, Folder, Loader2, ZoomIn, ZoomOut, ChevronLeft, ChevronRight } from "lucide-react";
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";

// PDF.js worker configuration
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

type KnowledgeDocument = ProcessDocumentOutput & {
  fileName: string;
  createdAt: string;
  documentContent: string;
  documentType: string;
  sourceProject: string;
};

interface KnowledgeDocumentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  document: KnowledgeDocument;
}

export function KnowledgeDocumentDialog({ open, onOpenChange, document }: KnowledgeDocumentDialogProps) {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [scale, setScale] = useState(1.0);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
    setPageNumber(1);
  }

  const isPdf = document.fileName.toLowerCase().endsWith('.pdf') || document.documentContent.startsWith('http');

  const renderPreview = () => {
    if (isPdf) {
      return (
        <div className="flex flex-col items-center justify-center h-full bg-gray-700 p-2">
          <Document
            file={document.documentContent}
            onLoadSuccess={onDocumentLoadSuccess}
            loading={<div className="flex items-center gap-2 text-white"><Loader2 className="w-5 h-5 animate-spin" /> Loading preview...</div>}
            error="Failed to load PDF file."
            className="flex justify-center"
          >
            <Page pageNumber={pageNumber} scale={scale} renderTextLayer={false} />
          </Document>
        </div>
      );
    }
    
    // Fallback for text content
    return (
        <div className="prose prose-sm max-w-none dark:prose-invert h-full">
            <pre className="whitespace-pre-wrap break-words text-xs font-sans bg-transparent p-0 m-0 h-full">{document.documentContent}</pre>
        </div>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-start gap-3">
             <FileText className="w-6 h-6 text-primary shrink-0 mt-1" />
             <span>{document.title}</span>
          </DialogTitle>
          <DialogDescription>
            High-level summary, metadata, and preview of the document.
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-4 overflow-hidden h-full">
            <ScrollArea className="pr-4 h-full md:col-span-1">
                <div className="space-y-6">
                    <div>
                        <h4 className="font-semibold text-lg mb-2 flex items-center gap-2"><BrainCircuit className="w-5 h-5 text-muted-foreground" />Summary</h4>
                        <p className="text-base text-foreground/90">{document.summary}</p>
                    </div>
                     <Separator />
                    <div>
                        <h4 className="font-semibold text-lg mb-3 flex items-center gap-2"><Tag className="w-5 h-5 text-muted-foreground" />Key Topics</h4>
                        <div className="flex flex-wrap gap-2">
                           {document.metadata.keyTopics.map(topic => (
                               <Badge key={topic} variant="secondary" className="text-sm py-1 px-3">{topic}</Badge>
                           ))}
                        </div>
                    </div>
                    <Separator />
                    <div>
                        <h4 className="font-semibold text-lg mb-3 flex items-center gap-2"><WholeWord className="w-5 h-5 text-muted-foreground" />Metadata</h4>
                        <div className="text-sm grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 items-center">
                            <CheckCircle2 className="w-4 h-4 text-green-600" />
                            <span><span className="font-medium text-foreground/80">Vectorization:</span> <span className="font-semibold text-green-600">{document.vectorizationStatus}</span></span>

                            <Folder className="w-4 h-4 text-muted-foreground" />
                            <span><span className="font-medium text-foreground/80">Source Project:</span> <span className="font-medium text-foreground">{document.sourceProject}</span></span>

                            <FileText className="w-4 h-4 text-muted-foreground" />
                            <span><span className="font-medium text-foreground/80">Document Type:</span> <span className="font-medium text-foreground">{document.documentType}</span></span>

                            <Calendar className="w-4 h-4 text-muted-foreground" />
                            <span><span className="font-medium text-foreground/80">Created Date:</span> <span className="font-medium text-foreground">{new Date(document.createdAt).toLocaleDateString()}</span></span>
                            
                            <WholeWord className="w-4 h-4 text-muted-foreground" />
                            <span><span className="font-medium text-foreground/80">Word Count:</span> <span className="font-medium text-foreground">{document.metadata.wordCount.toLocaleString()}</span></span>
                        </div>
                    </div>
                </div>
            </ScrollArea>
            <div className="rounded-lg border bg-muted/30 p-0 h-full flex flex-col md:col-span-2 overflow-hidden">
                 {isPdf && numPages && (
                   <div className="flex items-center justify-center gap-4 p-2 border-b bg-background/50">
                       <Button variant="ghost" size="icon" onClick={() => setPageNumber(p => Math.max(1, p - 1))} disabled={pageNumber <= 1}>
                           <ChevronLeft className="w-5 h-5" />
                       </Button>
                       <span className="text-sm font-medium">Page {pageNumber} of {numPages}</span>
                       <Button variant="ghost" size="icon" onClick={() => setPageNumber(p => Math.min(numPages, p + 1))} disabled={pageNumber >= numPages}>
                           <ChevronRight className="w-5 h-5" />
                       </Button>
                       <Separator orientation="vertical" className="h-6" />
                        <Button variant="ghost" size="icon" onClick={() => setScale(s => s - 0.1)} disabled={scale <= 0.5}>
                           <ZoomOut className="w-5 h-5" />
                       </Button>
                       <span className="text-sm font-medium w-12 text-center">{(scale * 100).toFixed(0)}%</span>
                        <Button variant="ghost" size="icon" onClick={() => setScale(s => s + 0.1)} disabled={scale >= 2.0}>
                           <ZoomIn className="w-5 h-5" />
                       </Button>
                   </div>
                 )}
                 <ScrollArea className="flex-1">
                    {renderPreview()}
                 </ScrollArea>
            </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
