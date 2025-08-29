
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
import { BrainCircuit, Tag, WholeWord, FileText } from "lucide-react";

type KnowledgeDocument = ProcessDocumentOutput & {
  fileName: string;
  createdAt: string;
  documentContent: string;
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
      <div className="prose prose-sm max-w-none dark:prose-invert rounded-lg border bg-muted/30 p-4 h-64 overflow-auto">
        <pre className="whitespace-pre-wrap break-words text-xs font-sans">{content}</pre>
      </div>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-start gap-3">
             <FileText className="w-6 h-6 text-primary shrink-0 mt-1" />
             <span>{document.title}</span>
          </DialogTitle>
          <DialogDescription>
            High-level summary, metadata, and preview of the document.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[70vh]">
          <div className="py-4 pr-6 space-y-6">
            <div>
                <h4 className="font-semibold text-base mb-2 flex items-center gap-2"><BrainCircuit className="w-4 h-4 text-muted-foreground" />Summary</h4>
                <p className="text-sm text-muted-foreground">{document.summary}</p>
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
                <div className="text-sm text-muted-foreground grid grid-cols-2 gap-x-4 gap-y-1">
                    <span>Word Count:</span> <span className="font-medium text-foreground">{document.metadata.wordCount}</span>
                    <span>Vectorization:</span> <span className="font-semibold text-green-600">{document.vectorizationStatus}</span>
                    <span>Original Filename:</span> <span className="font-medium text-foreground truncate">{document.fileName}</span>
                </div>
            </div>
            <div>
                <h4 className="font-semibold text-base mb-2">Content Preview</h4>
                {renderPreview(document.documentContent)}
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
