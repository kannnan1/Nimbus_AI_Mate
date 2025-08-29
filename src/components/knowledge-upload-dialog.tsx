
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

export type UploadMetadata = {
  documentType: string;
  sourceProject: string;
};

interface KnowledgeUploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  fileName: string;
  onUpload: (metadata: UploadMetadata) => void;
}

const documentTypes = ["Technical Documentation", "Internal Policy", "Quarterly Report", "Methodology Guide", "Compliance Document", "Other"];
const sourceProjects = ["Regulatory Compliance", "Retail Credit Risk", "Commercial Loan Portfolio", "Marketing Analytics", "Uncategorized", "Other"];

export function KnowledgeUploadDialog({ open, onOpenChange, fileName, onUpload }: KnowledgeUploadDialogProps) {
  const [documentType, setDocumentType] = useState("");
  const [otherDocumentType, setOtherDocumentType] = useState("");
  const [sourceProject, setSourceProject] = useState("");
  const [otherSourceProject, setOtherSourceProject] = useState("");
  const { toast } = useToast();

  const handleConfirmUpload = () => {
    const finalDocumentType = documentType === "Other" ? otherDocumentType.trim() : documentType;
    const finalSourceProject = sourceProject === "Other" ? otherSourceProject.trim() : sourceProject;

    if (!finalDocumentType || !finalSourceProject) {
      toast({
        title: "Missing Information",
        description: "Please select or enter a document type and source project.",
        variant: "destructive",
      });
      return;
    }
    onUpload({ documentType: finalDocumentType, sourceProject: finalSourceProject });
    onOpenChange(false);
  };
  
  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      // Reset state when closing
      setDocumentType("");
      setOtherDocumentType("");
      setSourceProject("");
      setOtherSourceProject("");
    }
    onOpenChange(isOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Document Details</DialogTitle>
          <DialogDescription>
            Provide some additional information for the file: <strong>{fileName}</strong>.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="doc-type">Doc Type</Label>
            <Select onValueChange={setDocumentType} value={documentType}>
              <SelectTrigger id="doc-type">
                <SelectValue placeholder="Select a type..." />
              </SelectTrigger>
              <SelectContent>
                {documentTypes.map(type => (
                  <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {documentType === "Other" && (
              <Input
                id="other-doc-type"
                placeholder="Please specify..."
                value={otherDocumentType}
                onChange={(e) => setOtherDocumentType(e.target.value)}
                className="mt-2"
              />
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="source-project">Project</Label>
            <Select onValueChange={setSourceProject} value={sourceProject}>
              <SelectTrigger id="source-project">
                <SelectValue placeholder="Select a project..." />
              </SelectTrigger>
              <SelectContent>
                {sourceProjects.map(project => (
                  <SelectItem key={project} value={project}>{project}</SelectItem>
                ))}
              </SelectContent>
            </Select>
             {sourceProject === "Other" && (
              <Input
                id="other-source-project"
                placeholder="Please specify..."
                value={otherSourceProject}
                onChange={(e) => setOtherSourceProject(e.target.value)}
                className="mt-2"
              />
            )}
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleConfirmUpload}>Confirm and Process</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
