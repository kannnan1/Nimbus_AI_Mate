
"use client";

import { useState } from "react";
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
import { Loader2 } from "lucide-react";
import type { Section } from "@/types/document";

// Sample data for pipelines and versions
const pipelines = [
  { id: "pipe1", name: "Retail Credit Risk Q2 2024" },
  { id: "pipe2", name: "Commercial Loan Portfolio Q1 2024" },
];

const documentVersions = [
  { id: "ver1", name: "Version 1.0 (Latest)" },
  { id: "ver2", name: "Version 0.9 (Draft)" },
];

const populatedSR117ValidationReport: { name: string; sections: Section[]; content: string } = {
  name: "SR11-7 Validation Report (Populated)",
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
  ],
  content: `# 1. Executive Summary

## 1.1. Validation Scope and Objectives
This report documents the independent validation of the Retail Credit Risk Model (RCRM) version 2.1. The primary objective is to assess the model's conceptual soundness, evaluate its performance, and ensure it complies with SR 11-7 guidelines.

## 1.2. Overall Assessment and Rating
The RCRM v2.1 is assessed as **Satisfactory**. The model is conceptually sound and demonstrates strong predictive power. Some minor limitations were identified, which are detailed in Section 6.

## 1.3. Summary of Findings and Recommendations
- **Finding 1**: The model's performance on the out-of-time sample was robust, with a Gini coefficient of 75.4%.
- **Finding 2**: Data quality for the 'income' variable was found to have a high percentage of missing values (15%).
- **Recommendation 1**: Implement the suggested data imputation strategy for the 'income' variable.
- **Recommendation 2**: Retrain the model on an annual basis to account for portfolio drift.

# 2. Validation Process Overview

## 2.1. Validation Team and Independence
The validation was conducted by the independent Model Risk Management (MRM) group, which has no involvement in the model development process.

## 2.2. Previous Validation Findings
The previous validation of RCRM v2.0 identified a need for improved documentation of variable selection, which has been adequately addressed in this version.

# 3. Conceptual Soundness Evaluation

## 3.1. Review of Model Theory and Design
The logistic regression approach is appropriate for predicting probability of default. The choice of variables is well-justified and aligns with industry best practices.

## 3.2. Evaluation of Assumptions and Limitations
The model assumes a linear relationship between the log-odds of default and the predictor variables. This assumption was tested and found to be reasonable. A key limitation is the model's reliance on macroeconomic forecasts, which carry inherent uncertainty.
`
};


interface PopulatedDocumentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PopulatedDocumentDialog({ open, onOpenChange }: PopulatedDocumentDialogProps) {
  const [selectedPipeline, setSelectedPipeline] = useState(pipelines[0].id);
  const [selectedVersion, setSelectedVersion] = useState(documentVersions[0].id);
  const [isNavigating, setIsNavigating] = useState(false);
  const router = useRouter();

  const handleGoToEditor = () => {
    setIsNavigating(true);

    const newDoc = {
      title: `${populatedSR117ValidationReport.name} - ${new Date().toLocaleTimeString()}`,
      lastModified: new Date().toISOString(),
      content: populatedSR117ValidationReport.content,
      sections: populatedSR117ValidationReport.sections,
      comments: [],
    };
    
    const storedDocsString = localStorage.getItem("myDocuments");
    const storedDocs = storedDocsString ? JSON.parse(storedDocsString) : [];
    
    storedDocs.unshift(newDoc);
    localStorage.setItem("myDocuments", JSON.stringify(storedDocs));

    setTimeout(() => {
        onOpenChange(false);
        router.push(`/editor?title=${encodeURIComponent(newDoc.title)}`);
        setIsNavigating(false);
    }, 500);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
            <DialogTitle>Start with a Populated Document</DialogTitle>
            <DialogDescription>
                Select a pipeline and document version to start with a pre-filled draft.
            </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="pipeline-select" className="text-right">Pipeline</label>
            <Select value={selectedPipeline} onValueChange={setSelectedPipeline}>
              <SelectTrigger id="pipeline-select" className="col-span-3">
                <SelectValue placeholder="Select a pipeline..." />
              </SelectTrigger>
              <SelectContent>
                {pipelines.map((pipeline) => (
                  <SelectItem key={pipeline.id} value={pipeline.id}>
                    {pipeline.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
             <label htmlFor="version-select" className="text-right">Version</label>
            <Select value={selectedVersion} onValueChange={setSelectedVersion}>
              <SelectTrigger id="version-select" className="col-span-3">
                <SelectValue placeholder="Select a version..." />
              </SelectTrigger>
              <SelectContent>
                {documentVersions.map((version) => (
                  <SelectItem key={version.id} value={version.id}>
                    {version.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
            <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button onClick={handleGoToEditor} disabled={isNavigating}>
                {isNavigating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isNavigating ? 'Loading...' : 'Go to Editor'}
            </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
