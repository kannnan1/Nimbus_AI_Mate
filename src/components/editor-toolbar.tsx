
"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Feather, Save, History, MessageSquarePlus, ArrowLeft, ClipboardPlus } from "lucide-react";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import type { Section } from "@/types/document";
import { VersionHistoryDialog, type DocumentVersion } from "./version-history-dialog";
import type { Comment } from "./comments-sidebar";

interface EditorToolbarProps {
  initialTitle?: string;
  documentContent: string;
  sections: Section[];
  comments: Comment[];
  onToggleComments: () => void;
  onToggleAddResults: () => void;
}

export function EditorToolbar({ 
  initialTitle = "Untitled Document", 
  documentContent, 
  sections, 
  comments, 
  onToggleComments,
  onToggleAddResults
}: EditorToolbarProps) {
  const [documentTitle, setDocumentTitle] = useState(initialTitle);
  const [saveStatus, setSaveStatus] = useState("Not saved");
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [versionHistory, setVersionHistory] = useState<DocumentVersion[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    setDocumentTitle(initialTitle);
  }, [initialTitle]);

  const loadVersionHistory = () => {
    if (documentTitle && documentTitle !== "Untitled Document") {
      const historyString = localStorage.getItem(`doc-history-${documentTitle}`);
      const history = historyString ? JSON.parse(historyString) : [];
      setVersionHistory(history);
    }
  };
  
  const handleOpenHistory = () => {
    loadVersionHistory();
    setIsHistoryOpen(true);
  };

  const handleSave = () => {
    if (documentTitle === "Untitled Document" || !documentTitle.trim()) {
      toast({
        title: "Cannot Save",
        description: "Please enter a title for your document before saving.",
        variant: "destructive",
      });
      return;
    }

    const now = new Date();
    const lastModified = format(now, "MMM d, yyyy 'at' h:mm a");
    setSaveStatus(`Saved ${format(now, "h:mm a")}`);
    
    // --- Update main document list ---
    const storedDocsString = localStorage.getItem("myDocuments");
    const storedDocs = storedDocsString ? JSON.parse(storedDocsString) : [];
    
    const existingDocIndex = storedDocs.findIndex((doc: {title: string}) => doc.title === documentTitle);
    
    const newDocData = { 
      title: documentTitle, 
      lastModified,
      content: documentContent,
      sections: sections,
      comments: comments,
    };

    if (existingDocIndex > -1) {
      storedDocs[existingDocIndex] = newDocData;
    } else {
      storedDocs.push(newDocData);
    }
    
    storedDocs.sort((a: any, b: any) => new Date(b.lastModified).getTime() - new Date(a.lastModified).getTime());
    localStorage.setItem("myDocuments", JSON.stringify(storedDocs));

    // --- Update version history ---
    const historyKey = `doc-history-${documentTitle}`;
    const historyString = localStorage.getItem(historyKey);
    const history = historyString ? JSON.parse(historyString) : [];

    const newVersion: DocumentVersion = {
      timestamp: now.toISOString(),
      content: documentContent,
      sections: sections,
      summary: "Updated 'Introduction' section and added a new subsection 'Project Goals'.",
    };

    history.unshift(newVersion); // Add new version to the beginning
    localStorage.setItem(historyKey, JSON.stringify(history));


    toast({
      title: "Document Saved!",
      description: `"${documentTitle}" has been saved successfully.`,
    });
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDocumentTitle(e.target.value);
    setSaveStatus("Not saved");
  }

  return (
    <>
      <header className="flex h-16 items-center border-b bg-card px-4 shrink-0">
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2 text-primary font-semibold">
            <Feather className="w-5 h-5" />
            <span>Nimbus Uno</span>
          </Link>
          <Separator orientation="vertical" className="h-8" />
          <div>
            <Input 
              value={documentTitle}
              onChange={handleTitleChange}
              className="text-lg font-semibold border-none focus-visible:ring-0 focus-visible:ring-offset-0 p-0 h-auto"
              aria-label="Document Title"
            />
            <p className="text-xs text-muted-foreground">{saveStatus}</p>
          </div>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                 <Button variant="ghost" size="icon" asChild>
                  <Link href="/">
                    <ArrowLeft className="h-4 w-4" />
                    <span className="sr-only">Go Back</span>
                  </Link>
                </Button>
              </TooltipTrigger>
              <TooltipContent>Back to Documents</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" onClick={handleSave}>
                  <Save className="h-4 w-4" />
                  <span className="sr-only">Save</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>Save Document</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" onClick={handleOpenHistory}>
                  <History className="h-4 w-4" />
                  <span className="sr-only">Version History</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>Version History</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" onClick={onToggleComments}>
                  <MessageSquarePlus className="h-4 w-4" />
                  <span className="sr-only">Comments</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>Comments</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <Separator orientation="vertical" className="h-8 mx-2" />
          
          <Button onClick={onToggleAddResults}>
            <ClipboardPlus className="mr-2 h-4 w-4" />
            Add Results
          </Button>
        </div>
      </header>
      <VersionHistoryDialog 
        open={isHistoryOpen} 
        onOpenChange={setIsHistoryOpen} 
        versions={versionHistory} 
      />
    </>
  );
}
