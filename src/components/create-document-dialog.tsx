
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

type CreationOption = "blank" | "template" | "populated" | "auto";

interface CreateDocumentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onOptionSelect: (option: CreationOption, title: string) => void;
}

export function CreateDocumentDialog({ open, onOpenChange, onOptionSelect }: CreateDocumentDialogProps) {
  const [documentName, setDocumentName] = useState("");
  const [selectedOption, setSelectedOption] = useState<CreationOption | "">("");
  const { toast } = useToast();

  const handleCreate = () => {
    if (!documentName.trim()) {
      toast({
        title: "Validation Error",
        description: "Please enter a name for the document.",
        variant: "destructive",
      });
      return;
    }
    if (!selectedOption) {
      toast({
        title: "Validation Error",
        description: "Please select a creation method.",
        variant: "destructive",
      });
      return;
    }

    onOpenChange(false);
    
    // Use a timeout to allow the dialog to close before triggering the next one
    setTimeout(() => {
        onOptionSelect(selectedOption, documentName.trim());
        // Reset state
        setDocumentName("");
        setSelectedOption("");
    }, 150);
  };
  
  // Reset state when dialog is closed
  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
        setDocumentName("");
        setSelectedOption("");
    }
    onOpenChange(isOpen);
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Document</DialogTitle>
          <DialogDescription>
            Give your new document a name and choose how you'd like to start.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="doc-name" className="text-right">
              Name
            </Label>
            <Input
              id="doc-name"
              placeholder="e.g., Q3 Model Validation..."
              value={documentName}
              onChange={(e) => setDocumentName(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="creation-method" className="text-right">
              Method
            </Label>
            <Select onValueChange={(value) => setSelectedOption(value as CreationOption)} value={selectedOption}>
              <SelectTrigger id="creation-method" className="col-span-3">
                <SelectValue placeholder="Select a method..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="blank">Start Blank Document</SelectItem>
                <SelectItem value="template">Start with Template</SelectItem>
                <SelectItem value="populated">Start with Populated Document</SelectItem>
                <SelectItem value="auto">Smart Document Generation</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleCreate}>Continue</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
