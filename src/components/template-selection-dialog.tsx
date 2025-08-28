
"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FilePlus2 } from "lucide-react";
import type { Section } from "@/types/document";
import { AddTemplateDialog } from "./add-template-dialog";

export interface Template {
  id: string;
  name: string;
  description: string;
  sections: Section[];
}

const initialTemplates: Template[] = [
  {
    id: "model-dev",
    name: "Model Development Report",
    description: "A comprehensive report for documenting the model development process.",
    sections: [
      { id: "s1", title: "Introduction", subsections: [{ id: "s1-1", title: "Project Overview" }] },
      { id: "s2", title: "Data Preparation", subsections: [{ id: "s2-1", title: "Data Sourcing" }, { id: "s2-2", title: "Data Cleaning" }] },
      { id: "s3", title: "Model Building", subsections: [] },
      { id: "s4", title: "Conclusion", subsections: [] },
    ],
  },
  {
    id: "model-val",
    name: "Model Validation Report",
    description: "A standard report for validating the performance and robustness of a model.",
    sections: [
      { id: "s1", title: "Executive Summary", subsections: [] },
      { id: "s2", title: "Validation Methodology", subsections: [{ id: "s2-1", title: "Metrics" }] },
      { id: "s3", title: "Validation Results", subsections: [{ id: "s3-1", title: "Performance" }] },
      { id: "s4", title: "Recommendations", subsections: [] },
    ],
  },
  {
    id: "monitoring",
    name: "Monitoring Report",
    description: "A report for tracking model performance over time and identifying drift.",
    sections: [
      { id: "s1", title: "Reporting Period", subsections: [] },
      { id: "s2", title: "Performance Metrics", subsections: [] },
      { id: "s3", title: "Drift Analysis", subsections: [] },
      { id: "s4", title: "Alerts and Actions", subsections: [] },
    ],
  },
];

interface TemplateSelectionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function TemplateSelectionDialog({ open, onOpenChange }: TemplateSelectionDialogProps) {
  const [templates, setTemplates] = useState<Template[]>(initialTemplates);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(templates[0]);
  const [isAddTemplateOpen, setIsAddTemplateOpen] = useState(false);
  const router = useRouter();

  const handleTemplateChange = (templateId: string) => {
    const template = templates.find(t => t.id === templateId) || null;
    setSelectedTemplate(template);
  };

  const handleGoToEditor = () => {
    if (!selectedTemplate) return;
    
    const newDoc = {
      title: selectedTemplate.name,
      lastModified: new Date().toISOString(),
      content: "", // Content will be generated from sections on editor page
      sections: selectedTemplate.sections,
      comments: [],
    };
    
    // In a real app, you might create this record in a database.
    // Here we save it to localStorage to be picked up by the editor page.
    const storedDocsString = localStorage.getItem("myDocuments");
    const storedDocs = storedDocsString ? JSON.parse(storedDocsString) : [];
    storedDocs.push(newDoc);
    localStorage.setItem("myDocuments", JSON.stringify(storedDocs));

    onOpenChange(false);
    router.push(`/editor?title=${encodeURIComponent(selectedTemplate.name)}`);
  };

  const handleAddTemplate = (name: string, file: File) => {
    // In a real application, you would parse the .docx file content.
    // For this example, we'll create a dummy template.
    const newTemplate: Template = {
      id: `template-${Date.now()}`,
      name: name,
      description: `Custom template uploaded from ${file.name}`,
      sections: [
        { id: "custom-s1", title: "Uploaded Section 1", subsections: [] },
        { id: "custom-s2", title: "Uploaded Section 2", subsections: [] },
      ],
    };

    const newTemplates = [...templates, newTemplate];
    setTemplates(newTemplates);
    setSelectedTemplate(newTemplate);
  };


  return (
    <>
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-5xl">
        <DialogHeader className="flex-row items-center justify-between">
            <div className="space-y-1.5">
                <DialogTitle>Start with a Template</DialogTitle>
                <DialogDescription>
                    Select a template to kickstart your document creation process.
                </DialogDescription>
            </div>
            <Button variant="outline" onClick={() => setIsAddTemplateOpen(true)}>
                <FilePlus2 className="mr-2" />
                Add Template
            </Button>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
          <div className="space-y-4">
            <Select
              onValueChange={handleTemplateChange}
              value={selectedTemplate?.id}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a template..." />
              </SelectTrigger>
              <SelectContent>
                {templates.map((template) => (
                  <SelectItem key={template.id} value={template.id}>
                    {template.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {selectedTemplate && (
                <p className="text-sm text-muted-foreground">{selectedTemplate.description}</p>
            )}
          </div>
          <div>
            <h4 className="font-semibold mb-2">Template Preview</h4>
            <Card className="h-64">
              <ScrollArea className="h-full">
                <CardContent className="p-4">
                  {selectedTemplate ? (
                    <div className="space-y-2">
                        {selectedTemplate.sections.map((section, secIndex) => (
                            <div key={section.id}>
                                <p className="font-semibold">{secIndex + 1}. {section.title}</p>
                                {section.subsections.length > 0 && (
                                    <div className="pl-4 mt-1 space-y-1 text-sm text-muted-foreground">
                                        {section.subsections.map((sub, subIndex) => (
                                            <p key={sub.id}>{secIndex + 1}.{subIndex + 1}. {sub.title}</p>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground text-center pt-8">Select a template to see its structure.</p>
                  )}
                </CardContent>
              </ScrollArea>
            </Card>
          </div>
        </div>
        <DialogFooter>
            <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button onClick={handleGoToEditor} disabled={!selectedTemplate}>Go to Editor</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
    <AddTemplateDialog 
      open={isAddTemplateOpen} 
      onOpenChange={setIsAddTemplateOpen}
      onAddTemplate={handleAddTemplate}
    />
    </>
  );
}
