
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FilePlus2, ChevronDown } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type CreationOption = "blank" | "template" | "populated" | "auto";

interface CreateDocumentDropdownProps {
  onOptionSelect: (option: CreationOption, title: string) => void;
}

export function CreateDocumentDropdown({ onOptionSelect }: CreateDocumentDropdownProps) {
  const [documentName, setDocumentName] = useState("");
  const [selectedOption, setSelectedOption] = useState<CreationOption | "">("");
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
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

    // Close the dropdown first
    setIsOpen(false);

    // Use a timeout to allow the dropdown to close before triggering the modal
    setTimeout(() => {
        onOptionSelect(selectedOption, documentName.trim());
        // Reset state after triggering
        setDocumentName("");
        setSelectedOption("");
    }, 100);
  };

  const handleSelection = (value: string) => {
    const option = value as CreationOption;
    if (option === 'blank') {
         if (!documentName.trim()) {
          toast({
            title: "Validation Error",
            description: "Please enter a name for the document.",
            variant: "destructive",
          });
          return;
        }
        setIsOpen(false);
        const newDoc = {
            title: documentName.trim(),
            lastModified: new Date().toISOString(),
            content: `# ${documentName.trim()}\n\n`,
            sections: [],
            comments: [],
        };
        const storedDocsString = localStorage.getItem("myDocuments");
        const storedDocs = storedDocsString ? JSON.parse(storedDocsString) : [];
        storedDocs.unshift(newDoc);
        localStorage.setItem("myDocuments", JSON.stringify(storedDocs));
        router.push(`/editor?title=${encodeURIComponent(newDoc.title)}`);

    } else {
        setSelectedOption(option);
    }
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button>
          <FilePlus2 className="mr-2 h-4 w-4" />
          Create Document
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80 p-4" align="end">
        <div className="space-y-4">
          <div>
            <Label htmlFor="doc-name">Document Name</Label>
            <Input
              id="doc-name"
              placeholder="e.g., Q3 Model Validation..."
              value={documentName}
              onChange={(e) => setDocumentName(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="creation-method">Creation Method</Label>
            <Select onValueChange={handleSelection} value={selectedOption || ""}>
              <SelectTrigger id="creation-method">
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
           {selectedOption && selectedOption !== 'blank' && (
            <div className="flex justify-end">
                <Button onClick={handleCreate}>Continue</Button>
            </div>
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
