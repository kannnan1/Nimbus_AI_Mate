
"use client";

import { useState, useRef } from "react";
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
import { Upload } from "lucide-react";

interface AddTemplateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddTemplate: (name: string, file: File) => void;
}

export function AddTemplateDialog({ open, onOpenChange, onAddTemplate }: AddTemplateDialogProps) {
  const [templateName, setTemplateName] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleAddClick = () => {
    if (templateName.trim() && file) {
      onAddTemplate(templateName, file);
      onOpenChange(false);
      setTemplateName("");
      setFile(null);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Template</DialogTitle>
          <DialogDescription>
            Provide a name and upload a .docx file for your new template.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="template-name" className="text-right">
              Name
            </Label>
            <Input
              id="template-name"
              value={templateName}
              onChange={(e) => setTemplateName(e.target.value)}
              className="col-span-3"
              placeholder="e.g., Quarterly Review"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="file-upload" className="text-right">
              File
            </Label>
            <div className="col-span-3">
              <Button variant="outline" onClick={() => fileInputRef.current?.click()} className="w-full justify-start">
                <Upload className="mr-2 h-4 w-4" />
                <span>{file ? file.name : "Choose a .docx file..."}</span>
              </Button>
              <input
                id="file-upload"
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept=".docx"
                className="hidden"
              />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleAddClick} disabled={!templateName.trim() || !file}>
            Add Template
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
