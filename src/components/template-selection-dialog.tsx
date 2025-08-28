
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
import { FilePlus2, Loader2 } from "lucide-react";
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
    description: "A comprehensive report for documenting the model development process in line with SR 11-7.",
    sections: [
      { id: "s1", title: "1. Executive Summary", subsections: [
          { id: "s1-1", title: "1.1. Model Overview & Purpose" },
          { id: "s1-2", title: "1.2. Key Findings & Recommendations" },
      ]},
      { id: "s2", title: "2. Model Identification and Information", subsections: [
          { id: "s2-1", title: "2.1. Model Name/Identifier" },
          { id: "s2-2", title: "2.2. Model Owner and Developer" },
      ]},
      { id: "s3", title: "3. Data Sourcing and Preparation", subsections: [
          { id: "s3-1", title: "3.1. Data Sources" },
          { id: "s3-2", title: "3.2. Data Quality Assessment" },
          { id: "s3-3", title: "3.3. Data Cleaning and Preprocessing" },
          { id: "s3-4", title: "3.4. Feature Engineering and Selection" },
      ]},
      { id: "s4", title: "4. Model Theory and Design", subsections: [
          { id: "s4-1", title: "4.1. Conceptual Soundness" },
          { id: "s4-2", title: "4.2. Methodology and Algorithms" },
          { id: "s4-3", title: "4.3. Assumptions and Limitations" },
      ]},
      { id: "s5", title: "5. Model Implementation and Testing", subsections: [
          { id: "s5-1", title: "5.1. Estimation and Calibration" },
          { id: "s5-2", title: "5.2. Developmental Testing" },
          { id: "s5-3", title: "5.3. Backtesting and Outcomes Analysis" },
      ]},
      { id: "s6", title: "6. Model Governance and Controls", subsections: [
          { id: "s6-1", title: "6.1. Roles and Responsibilities" },
          { id: "s6-2", title: "6.2. Change Control Process" },
      ]},
    ],
  },
  {
    id: "model-val",
    name: "Model Validation Report",
    description: "A standard report for validating model performance and robustness, adhering to SR 11-7 guidelines.",
    sections: [
      { id: "s1", title: "1. Executive Summary", subsections: [
          { id: "s1-1", title: "1.1. Validation Scope and Objectives" },
          { id: "s1-2", title: "1.2. Overall Assessment and Rating" },
          { id: "s1-3", title: "1.3. Summary of Findings and Recommendations" },
      ]},
      { id: "s2", title: "2. Validation Process Overview", subsections: [
          { id: "s2-1", title: "2.1. Validation Team and Independence" },
          { id: "s2-2", title: "2.2. Previous Validation Findings" },
      ]},
      { id: "s3", title: "3. Conceptual Soundness Evaluation", subsections: [
          { id: "s3-1", title: "3.1. Review of Model Theory and Design" },
          { id: "s3-2", title: "3.2. Evaluation of Assumptions and Limitations" },
      ]},
      { id: "s4", title: "4. Data Verification and Quality Assessment", subsections: [
          { id: "s4-1", title: "4.1. Data Input Verification" },
          { id: "s4-2", title: "4.2. Representativeness of Data" },
      ]},
      { id: "s5", title: "5. Independent Testing and Analysis", subsections: [
          { id: "s5-1", title: "5.1. Outcomes Analysis (Backtesting)" },
          { id: "s5-2", title: "5.2. Benchmarking and Alternative Models" },
          { id: "s5-3", title: "5.3. Stress Testing and Sensitivity Analysis" },
      ]},
      { id: "s6", title: "6. Findings and Recommendations", subsections: [
          { id: "s6-1", title: "6.1. Detailed Findings" },
          { id: "s6-2", title: "6.2. Actionable Recommendations" },
          { id: "s6-3", title: "6.3. Management Response" },
      ]},
    ],
  },
  {
    id: "monitoring",
    name: "Monitoring Report",
    description: "A report for tracking model performance over time and identifying drift, as per SR 11-7.",
    sections: [
      { id: "s1", title: "1. Introduction", subsections: [
          { id: "s1-1", title: "1.1. Reporting Period" },
          { id: "s1-2", title: "1.2. Model and Portfolio Overview" },
      ]},
      { id: "s2", title: "2. Key Performance Indicators (KPIs)", subsections: [
          { id: "s2-1", title: "2.1. Model Accuracy and Rank Ordering" },
          { id: "s2-2", title: "2.2. Calibration and Goodness-of-Fit" },
          { id: "s2-3", title: "2.3. Stability and Overrides" },
      ]},
      { id: "s3", title: "3. Portfolio and Data Drift Analysis", subsections: [
          { id: "s3-1", title: "3.1. Population Stability Index (PSI)" },
          { id: "s3-2", title: "3.2. Characteristic Analysis" },
      ]},
      { id: "s4", title: "4. Backtesting and Outcomes Analysis", subsections: [
          { id: "s4-1", title: "4.1. Comparison of Predicted vs. Actual" },
      ]},
      { id: "s5", title: "5. Alerts, Triggers, and Actions", subsections: [
          { id: "s5-1", title: "5.1. Monitoring Triggers Breached" },
          { id: "s5-2", title: "5.2. Escalation and Recommended Actions" },
      ]},
    ],
  },
];

interface TemplateSelectionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  documentTitle: string;
}

export function TemplateSelectionDialog({ open, onOpenChange, documentTitle }: TemplateSelectionDialogProps) {
  const [templates, setTemplates] = useState<Template[]>(initialTemplates);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(templates[0]);
  const [isAddTemplateOpen, setIsAddTemplateOpen] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const router = useRouter();

  const handleTemplateChange = (templateId: string) => {
    const template = templates.find(t => t.id === templateId) || null;
    setSelectedTemplate(template);
  };

  const generateContentFromSections = (sections: Section[]): string => {
    return sections
      .map(section => {
        const mainSection = `# ${section.title}\n\n`;
        const subSections = section.subsections
          .map(sub => `## ${sub.title}\n\n`)
          .join('');
        return mainSection + subSections;
      })
      .join('');
  };

  const handleGoToEditor = () => {
    if (!selectedTemplate || !documentTitle) return;
    
    setIsNavigating(true);

    const generatedContent = generateContentFromSections(selectedTemplate.sections);

    const newDoc = {
      title: documentTitle,
      lastModified: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      content: generatedContent,
      sections: selectedTemplate.sections,
      comments: [],
      documentType: "From Template",
    };
    
    const storedDocsString = localStorage.getItem("myDocuments");
    const storedDocs = storedDocsString ? JSON.parse(storedDocsString) : [];
    
    let docTitle = newDoc.title;
    let counter = 1;
    while (storedDocs.some((doc: { title: string }) => doc.title === docTitle)) {
      docTitle = `${newDoc.title} (${counter})`;
      counter++;
    }
    newDoc.title = docTitle;
    
    storedDocs.unshift(newDoc);
    localStorage.setItem("myDocuments", JSON.stringify(storedDocs));

    // A small delay to show the loading state
    setTimeout(() => {
        onOpenChange(false);
        router.push(`/editor?title=${encodeURIComponent(newDoc.title)}`);
        setIsNavigating(false);
    }, 500);
  };

  const handleAddTemplate = (name: string, file: File) => {
    const newTemplate: Template = {
      id: `template-${Date.now()}`,
      name: name,
      description: `Custom template uploaded from ${file.name}`,
      sections: [
        { id: "custom-s1", title: "1. Uploaded Section 1", subsections: [] },
        { id: "custom-s2", title: "2. Uploaded Section 2", subsections: [] },
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
                    Select a template to kickstart your document: '{documentTitle}'.
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
                                <p className="font-semibold">{section.title}</p>
                                {section.subsections.length > 0 && (
                                    <div className="pl-4 mt-1 space-y-1 text-sm text-muted-foreground">
                                        {section.subsections.map((sub) => (
                                            <p key={sub.id}>{sub.title}</p>
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
            <Button onClick={handleGoToEditor} disabled={!selectedTemplate || isNavigating}>
                {isNavigating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isNavigating ? 'Loading...' : 'Go to Editor'}
            </Button>
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
