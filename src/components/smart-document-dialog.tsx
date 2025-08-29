
"use client";

import { useState, useEffect } from "react";
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
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Loader2, FileText } from "lucide-react";
import type { Section } from "@/types/document";
import type { Template } from "./template-selection-dialog";
import { correctTables } from "@/ai/flows/correct-tables-flow";

// Sample data for projects, pipelines, and versions
const projects = [
  {
    id: "proj1",
    name: "Retail Credit Risk",
    pipelines: [
      {
        id: "pipe1",
        uuid: "a4b1c2",
        versions: ["Version 1.2 (Final)", "Version 1.1 (Archived)"],
      },
      {
        id: "pipe2",
        uuid: "d3e4f5",
        versions: ["Version 1.3 (Draft)"],
      },
    ],
  },
  {
    id: "proj2",
    name: "Commercial Loan Portfolio",
    pipelines: [
      {
        id: "pipe3",
        uuid: "g6h7i8",
        versions: ["Version 2.0 (Final)", "Version 1.9 (Review)"],
      },
    ],
  },
  {
    id: "other",
    name: "Other",
    pipelines: [],
  }
];

const templates: Omit<Template, 'description'>[] = [
  {
    id: "model-val",
    name: "Model Validation Report",
    sections: [],
  },
  {
    id: "model-dev",
    name: "Model Development Report",
    sections: [],
  },
];

const populatedSR117ValidationReport: { name: string; sections: Section[]; content: string } = {
  name: "SR11-7 Validation Report",
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
  content: `# 1. Executive Summary

## 1.1. Validation Scope and Objectives

## 1.2. Overall Assessment and Rating

## 1.3. Summary of Findings and Recommendations

# 2. Validation Process Overview

## 2.1. Validation Team and Independence
The validation was conducted by the independent Model Risk Management (MRM) group, which has no involvement in the model development process, ensuring objectivity and compliance with SR 11-7.

## 2.2. Previous Validation Findings
The previous validation of RCRM v1.1 identified one minor finding related to the documentation of variable selection, which has been adequately addressed by the development team in this version's documentation.

# 3. Conceptual Soundness Evaluation

## 3.1. Review of Model Theory and Design
The logistic regression approach is appropriate for predicting the probability of default (PD) for this portfolio. The choice of predictor variables is well-justified, supported by business logic, and aligns with industry best practices for credit risk modeling.

## 3.2. Evaluation of Assumptions and Limitations
The model assumes a linear relationship between the log-odds of default and the predictor variables. This assumption was tested during development and confirmed during validation to be reasonable. A key limitation is the model's reliance on macroeconomic forecasts for stress testing, which carry inherent uncertainty.

# 4. Data Verification and Quality Assessment

## 4.1. Data Input Verification
The validation team independently sourced and replicated the development dataset from the source systems. All variables were successfully matched, and transformations were replicated with no discrepancies.

## 4.2. Representativeness of Data
The development data, covering the period from 2018 to 2022, is deemed sufficiently representative of the current portfolio. The validation team performed a population stability analysis and found no significant population drift.

# 5. Independent Testing and Analysis

## 5.1. Outcomes Analysis (Backtesting)
The model's predictive accuracy was tested on an out-of-time sample from Q1 2023 - Q4 2023. The model's rank-ordering ability remains strong.

| Metric              | Development | Out-of-Time Validation |
| ------------------- | ----------- | ---------------------- |
| Gini Coefficient    | 78.2%       | 75.4%                  |
| KS Statistic        | 55.1%       | 52.8%                  |
| Area Under ROC (AUC)| 0.891       | 0.877                  |

***Interpretation***: *The table shows a slight but acceptable degradation in model performance from development to the out-of-time validation sample. A Gini drop of 2.8 percentage points is within typical bounds, indicating the model is generalizing well to new data. The AUC of 0.877 signifies strong predictive accuracy.*

![ROC Curve for Validation Sample](https://picsum.photos/600/400?random=1)
***Interpretation***: *The ROC curve demonstrates strong model performance. The curve is positioned high in the upper-left corner, signifying a high true positive rate and a low false positive rate across all thresholds, which is indicative of a robust and accurate model.*

## 5.2. Benchmarking and Alternative Models
A simple benchmark model (a reduced-form logistic regression) was developed. The current model significantly outperforms the benchmark, justifying its complexity.

## 5.3. Stress Testing and Sensitivity Analysis
The model's sensitivity to key variables was tested. The 'debt_to_income_ratio' was identified as the most influential variable. The model was also subjected to stressed macroeconomic scenarios, and its response was directionally consistent with expectations.

![Feature Importance Plot](https://picsum.photos/600/400?random=2)
***Interpretation***: *The feature importance plot shows that 'debt_to_income_ratio' and 'credit_utilization' are the most significant predictors in the model. This aligns with financial theory and provides confidence in the model's design.*

# 6. Findings and Recommendations

## 6.1. Detailed Findings
- **Finding 1 (Minor)**: Backtesting revealed a 4% under-prediction of defaults in the highest-risk decile compared to the observed default rate. While the overall calibration is acceptable, this points to a minor model weakness in a critical segment.
- **Finding 2 (Informational)**: The use of mean imputation for the 'annual_income' variable is a simple and acceptable approach. However, it may not be optimal and could be improved.

## 6.2. Actionable Recommendations
- **Recommendation 1**: The monitoring plan for RCRM v1.2 should be updated to include tracking of actual vs. expected defaults at a decile level. Any deviation beyond 5% should trigger a formal review. (Severity: Minor, Owner: Model Monitoring Team, Due: Q3 2024)
- **Recommendation 2**: For the next planned redevelopment of the model, the development team should investigate alternative imputation methods like k-Nearest Neighbors (k-NN) or regression-based imputation for the 'annual_income' variable. (Severity: Informational, Owner: Model Development Team, Due: Q2 2025)

## 6.3. Management Response
Management agrees with the findings and recommendations presented in this report. The Model Monitoring Team and Model Development Team will take the necessary actions to address them by the specified due dates.
`
};

const generationSteps = [
    { message: "Initializing document generation..." },
    { message: "Analyzing pipeline results..." },
    { message: "Mapping results to template sections..." },
    { 
      message: "Searching reference documents for context...",
      details: [
        "Q1 2023 Model Validation: Found similar methodology...",
        "Project Alpha Docs: Details comparable data handling...",
        "SR 11-7 Guide: Outlines standards for model limitations...",
        "Q4 2022 Monitoring: Contains performance decay analysis...",
      ]
    },
    { message: "Generating interpretations for charts and tables..." },
    { message: "Checking document for quality and alignment..." },
    { message: "Finalizing document assembly..." },
    { message: "Almost there..." },
];


interface SmartDocumentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  documentTitle: string;
}

export function SmartDocumentDialog({ open, onOpenChange, documentTitle }: SmartDocumentDialogProps) {
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [otherProjectName, setOtherProjectName] = useState("");
  const [selectedPipelineId, setSelectedPipelineId] = useState<string | null>(null);
  const [selectedVersion, setSelectedVersion] = useState<string | null>(null);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null);
  
  const [pipelines, setPipelines] = useState<{ id: string; uuid: string; versions: string[] }[]>([]);
  const [versions, setVersions] = useState<string[]>([]);
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  
  const router = useRouter();

  useEffect(() => {
    if (selectedProjectId) {
      if (selectedProjectId === 'other') {
        setPipelines([]);
      } else {
        const project = projects.find(p => p.id === selectedProjectId);
        setPipelines(project?.pipelines || []);
      }
      setSelectedPipelineId(null);
      setVersions([]);
      setSelectedVersion(null);
    } else {
      setPipelines([]);
      setVersions([]);
    }
  }, [selectedProjectId]);

  useEffect(() => {
    if (selectedPipelineId) {
      const pipeline = pipelines.find(p => p.id === selectedPipelineId);
      setVersions(pipeline?.versions || []);
      setSelectedVersion(null);
    } else {
      setVersions([]);
    }
  }, [selectedPipelineId, pipelines]);

  const handleCreateDocument = () => {
    setIsGenerating(true);
    setProgress(0);
    setCurrentStep(0);

    const interval = setInterval(() => {
      setProgress(prev => {
        const nextProgress = prev + (100 / generationSteps.length);
        
        if (nextProgress >= 100) {
          clearInterval(interval);
          finishGeneration();
          return 100;
        }
        
        setCurrentStep(prevStep => prevStep + 1);
        return nextProgress;
      });
    }, 1500);
  };

  const finishGeneration = async () => {
    const finalProjectName = selectedProjectId === 'other' ? otherProjectName.trim() : projects.find(p => p.id === selectedProjectId)?.name;
    if (!documentTitle || !finalProjectName) return;

    const { correctedHtml } = await correctTables({ htmlContent: populatedSR117ValidationReport.content });

    const storedDocsString = localStorage.getItem("myDocuments");
    const storedDocs = storedDocsString ? JSON.parse(storedDocsString) : [];
    
    let docTitle = documentTitle;

    let counter = 1;
    while (storedDocs.some((doc: { title: string }) => doc.title === docTitle)) {
      docTitle = `${documentTitle} (${counter})`;
      counter++;
    }

    const newDoc = {
      title: docTitle,
      lastModified: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      content: correctedHtml,
      sections: populatedSR117ValidationReport.sections,
      comments: [],
      documentType: "Smart Generation",
      projectId: finalProjectName,
    };
    
    storedDocs.unshift(newDoc);
    localStorage.setItem("myDocuments", JSON.stringify(storedDocs));

    setTimeout(() => {
        onOpenChange(false);
        router.push(`/editor?title=${encodeURIComponent(newDoc.title)}`);
        // Reset state for next time
        setIsGenerating(false);
        setProgress(0);
        setCurrentStep(0);
    }, 500);
  };

  const isButtonDisabled = (!selectedProjectId || (selectedProjectId !== 'other' && (!selectedPipelineId || !selectedVersion)) || (selectedProjectId === 'other' && !otherProjectName) || !selectedTemplateId);
  const currentStatus = generationSteps[currentStep] || generationSteps[generationSteps.length - 1];

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isGenerating && onOpenChange(isOpen)}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
            <DialogTitle>Smart Document Generation</DialogTitle>
            <DialogDescription>
                Select your project, pipeline, and template to create a draft for '{documentTitle}'.
            </DialogDescription>
        </DialogHeader>
        {isGenerating ? (
            <div className="py-4 space-y-4">
                <Progress value={progress} className="w-full" />
                <div className="flex items-center justify-center text-sm text-muted-foreground">
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    <p>{currentStatus.message}</p>
                </div>
                {currentStatus.details && (
                    <div className="mt-4 p-4 bg-muted/50 rounded-lg space-y-2 animate-in fade-in-50">
                        <p className="text-sm font-semibold text-foreground">Sourcing from:</p>
                        {currentStatus.details.map((detail, index) => (
                           <div key={index} className="flex items-center gap-2 text-xs text-muted-foreground">
                                <FileText className="w-3 h-3 shrink-0" />
                                <span className="truncate">{detail}</span>
                           </div>
                        ))}
                    </div>
                )}
            </div>
        ) : (
          <>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="project-select" className="text-right">Project</Label>
                <Select onValueChange={setSelectedProjectId}>
                  <SelectTrigger id="project-select" className="col-span-3">
                    <SelectValue placeholder="Select a project..." />
                  </SelectTrigger>
                  <SelectContent>
                    {projects.map((project) => (
                      <SelectItem key={project.id} value={project.id}>
                        {project.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {selectedProjectId === 'other' && (
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="other-project" className="text-right">Project Name</Label>
                    <Input
                        id="other-project"
                        value={otherProjectName}
                        onChange={(e) => setOtherProjectName(e.target.value)}
                        className="col-span-3"
                        placeholder="Enter custom project name"
                    />
                </div>
              )}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="pipeline-select" className="text-right">Pipeline ID</Label>
                <Select onValueChange={setSelectedPipelineId} disabled={!selectedProjectId || selectedProjectId === 'other'}>
                  <SelectTrigger id="pipeline-select" className="col-span-3">
                    <SelectValue placeholder="Select a pipeline..." />
                  </SelectTrigger>
                  <SelectContent>
                    {pipelines.map((pipeline) => (
                      <SelectItem key={pipeline.id} value={pipeline.id}>
                        {pipeline.uuid}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                 <Label htmlFor="version-select" className="text-right">Version</Label>
                <Select onValueChange={setSelectedVersion} disabled={!selectedPipelineId || selectedProjectId === 'other'}>
                  <SelectTrigger id="version-select" className="col-span-3">
                    <SelectValue placeholder="Select a version..." />
                  </SelectTrigger>
                  <SelectContent>
                    {versions.map((version) => (
                      <SelectItem key={version} value={version}>
                        {version}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
               <div className="grid grid-cols-4 items-center gap-4">
                 <Label htmlFor="template-select" className="text-right">Template</Label>
                <Select onValueChange={setSelectedTemplateId} disabled={selectedProjectId === 'other' ? !otherProjectName : !selectedVersion}>
                  <SelectTrigger id="template-select" className="col-span-3">
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
              </div>
            </div>
            <DialogFooter>
                <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
                <Button onClick={handleCreateDocument} disabled={isButtonDisabled}>
                    Create Document
                </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
