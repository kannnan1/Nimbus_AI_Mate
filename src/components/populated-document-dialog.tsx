
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
import { Loader2 } from "lucide-react";
import type { Section } from "@/types/document";

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
This report documents the independent validation of the Retail Credit Risk Model (RCRM) version 1.2. The primary objective is to assess the model's conceptual soundness, evaluate its ongoing performance, and ensure it complies with SR 11-7 guidelines for model risk management. The validation covers model design, data integrity, processing, reporting, and governance.

## 1.2. Overall Assessment and Rating
The RCRM v1.2 is assessed as **Satisfactory**. The model is conceptually sound and demonstrates strong predictive power in line with its intended use. The performance metrics are stable and within acceptable thresholds. The model development and implementation processes are well-documented.

## 1.3. Summary of Findings and Recommendations
- **Finding 1 (Minor)**: The model's performance on the out-of-time sample, while strong, showed a slight decay in the highest-risk decile.
- **Finding 2 (Informational)**: Data quality for the 'annual_income' variable was found to have a high percentage of missing values (12%), which were handled by the development team via mean imputation.
- **Recommendation 1**: Enhance model monitoring to include decile-level stability tracking for the primary performance metrics.
- **Recommendation 2**: Explore more sophisticated imputation techniques for the 'annual_income' variable in the next model redevelopment cycle.

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

![ROC Curve for Validation Sample](https://picsum.photos/600/400?random=1)

## 5.2. Benchmarking and Alternative Models
A simple benchmark model (a reduced-form logistic regression) was developed. The current model significantly outperforms the benchmark, justifying its complexity.

## 5.3. Stress Testing and Sensitivity Analysis
The model's sensitivity to key variables was tested. The 'debt_to_income_ratio' was identified as the most influential variable. The model was also subjected to stressed macroeconomic scenarios, and its response was directionally consistent with expectations.

![Feature Importance Plot](https://picsum.photos/600/400?random=2)

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


interface PopulatedDocumentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  documentTitle: string;
}

export function PopulatedDocumentDialog({ open, onOpenChange, documentTitle }: PopulatedDocumentDialogProps) {
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [selectedPipelineId, setSelectedPipelineId] = useState<string | null>(null);
  const [selectedVersion, setSelectedVersion] = useState<string | null>(null);
  
  const [pipelines, setPipelines] = useState<{ id: string; uuid: string; versions: string[] }[]>([]);
  const [versions, setVersions] = useState<string[]>([]);
  
  const [isNavigating, setIsNavigating] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (selectedProjectId) {
      const project = projects.find(p => p.id === selectedProjectId);
      setPipelines(project?.pipelines || []);
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


  const handleGoToEditor = () => {
    if (!documentTitle) return;
    setIsNavigating(true);
    
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
      content: populatedSR117ValidationReport.content,
      sections: populatedSR117ValidationReport.sections,
      comments: [],
    };
    
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
                Select a project, pipeline, and version to start with a pre-filled draft for '{documentTitle}'.
            </DialogDescription>
        </DialogHeader>
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
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="pipeline-select" className="text-right">Pipeline ID</Label>
            <Select onValueChange={setSelectedPipelineId} disabled={!selectedProjectId}>
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
            <Select onValueChange={setSelectedVersion} disabled={!selectedPipelineId}>
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
        </div>
        <DialogFooter>
            <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button onClick={handleGoToEditor} disabled={isNavigating || !selectedVersion}>
                {isNavigating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isNavigating ? 'Loading...' : 'Go to Editor'}
            </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
