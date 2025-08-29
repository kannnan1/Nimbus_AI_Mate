
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
const sourceProjects = ["Regulatory Compliance", "Retail Credit Risk", "Commercial Loan Portfolio", "Marketing Analytics", "Uncategorized"];

export function KnowledgeUploadDialog({ open, onOpenChange, fileName, onUpload }: KnowledgeUploadDialogProps) {
  const [documentType, setDocumentType] = useState("");
  const [sourceProject, setSourceProject] = useState("");
  const { toast } = useToast();

  const handleConfirmUpload = () => {
    if (!documentType || !sourceProject) {
      toast({
        title: "Missing Information",
        description: "Please select a document type and source project.",
        variant: "destructive",
      });
      return;
    }
    onUpload({ documentType, sourceProject });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Document Details</DialogTitle>
          <DialogDescription>
            Provide some additional information for the file: <strong>{fileName}</strong>.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="doc-type" className="text-right">
              Doc Type
            </Label>
            <Select onValueChange={setDocumentType} value={documentType}>
              <SelectTrigger id="doc-type" className="col-span-3">
                <SelectValue placeholder="Select a type..." />
              </SelectTrigger>
              <SelectContent>
                {documentTypes.map(type => (
                  <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="source-project" className="text-right">
              Project
            </Label>
            <Select onValueChange={setSourceProject} value={sourceProject}>
              <SelectTrigger id="source-project" className="col-span-3">
                <SelectValue placeholder="Select a project..." />
              </SelectTrigger>
              <SelectContent>
                {sourceProjects.map(project => (
                  <SelectItem key={project} value={project}>{project}</SelectItem>
                ))}
              </SelectContent>
            </Select>
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
