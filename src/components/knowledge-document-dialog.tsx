
"use client";

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
import { BrainCircuit, Tag, WholeWord, FileText, CheckCircle2, Calendar, Folder } from "lucide-react";

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

  // Simple renderer for text content. In a real app, you might handle different file types (PDF, DOCX).
  const renderPreview = (content: string) => {
    return (
        <div className="prose prose-sm max-w-none dark:prose-invert h-full">
            <pre className="whitespace-pre-wrap break-words text-xs font-sans bg-transparent p-0 m-0 h-full">{content}</pre>
        </div>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-start gap-3">
             <FileText className="w-6 h-6 text-primary shrink-0 mt-1" />
             <span>{document.title}</span>
          </DialogTitle>
          <DialogDescription>
            High-level summary, metadata, and preview of the document.
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4 overflow-hidden h-full">
            <ScrollArea className="pr-4 h-full">
                <div className="space-y-6">
                    <div>
                        <h4 className="font-semibold text-base mb-2 flex items-center gap-2"><BrainCircuit className="w-4 h-4 text-muted-foreground" />Summary</h4>
                        <p className="text-base text-foreground/90">{document.summary}</p>
                    </div>
                    <div>
                        <h4 className="font-semibold text-base mb-2 flex items-center gap-2"><Tag className="w-4 h-4 text-muted-foreground" />Key Topics</h4>
                        <div className="flex flex-wrap gap-2">
                           {document.metadata.keyTopics.map(topic => (
                               <Badge key={topic} variant="secondary">{topic}</Badge>
                           ))}
                        </div>
                    </div>
                    <div>
                        <h4 className="font-semibold text-base mb-2 flex items-center gap-2"><WholeWord className="w-4 h-4 text-muted-foreground" />Metadata</h4>
                        <div className="text-sm text-muted-foreground grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 items-center">
                            <CheckCircle2 className="w-4 h-4" />
                            <span><span className="font-medium text-foreground/80">Vectorization:</span> <span className="font-semibold text-green-600">{document.vectorizationStatus}</span></span>

                            <Folder className="w-4 h-4" />
                            <span><span className="font-medium text-foreground/80">Source Project:</span> <span className="font-medium text-foreground">{document.sourceProject}</span></span>

                            <FileText className="w-4 h-4" />
                            <span><span className="font-medium text-foreground/80">Document Type:</span> <span className="font-medium text-foreground">{document.documentType}</span></span>

                            <Calendar className="w-4 h-4" />
                            <span><span className="font-medium text-foreground/80">Created Date:</span> <span className="font-medium text-foreground">{new Date(document.createdAt).toLocaleDateString()}</span></span>
                            
                            <WholeWord className="w-4 h-4" />
                            <span><span className="font-medium text-foreground/80">Word Count:</span> <span className="font-medium text-foreground">{document.metadata.wordCount}</span></span>
                        </div>
                    </div>
                </div>
            </ScrollArea>
            <div className="rounded-lg border bg-muted/30 p-4 h-full flex flex-col">
                 <h4 className="font-semibold text-base mb-2 flex-shrink-0">Content Preview</h4>
                 <ScrollArea className="flex-1">
                    {renderPreview(document.documentContent)}
                 </ScrollArea>
            </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
