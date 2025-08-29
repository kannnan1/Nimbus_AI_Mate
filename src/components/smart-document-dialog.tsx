
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
import mammoth from "mammoth";
import { useToast } from "@/hooks/use-toast";

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
  const { toast } = useToast();

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
    
    // The URL for the .docx file
    const docxUrl = "https://raw.githubusercontent.com/kannnan1/NIMBUS_Demo/main/Retail%20Application%20Scorecard%20Development.docx";

    try {
        const response = await fetch(docxUrl);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const arrayBuffer = await response.arrayBuffer();

        const mammothOptions = {
            convertImage: mammoth.images.imgElement(function(image) {
                return image.read("base64").then(function(imageBuffer) {
                    return {
                        src: "data:" + image.contentType + ";base64," + imageBuffer
                    };
                });
            }),
            styleMap: [
                "p[style-name='Table'] => table > tr > td:fresh",
            ]
        };

        const result = await mammoth.convertToHtml({ arrayBuffer }, mammothOptions);
        const htmlContent = result.value;

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
          content: htmlContent,
          sections: [], // Sections are part of the HTML content, can be parsed later if needed
          comments: [],
          documentType: "Smart Generation",
          projectId: finalProjectName,
        };
        
        storedDocs.unshift(newDoc);
        localStorage.setItem("myDocuments", JSON.stringify(storedDocs));
        
        onOpenChange(false);
        const state = { 
            title: newDoc.title, 
            content: newDoc.content, 
            sections: newDoc.sections,
            comments: newDoc.comments
        };
        window.history.replaceState({ ...window.history.state, ...state }, '');
        router.push(`/editor?title=${encodeURIComponent(newDoc.title)}`);

    } catch (error: any) {
        console.error("Failed to load or convert document for smart generation:", error);
        toast({
            title: "Error",
            description: `Could not load the smart document. ${error.message}`,
            variant: "destructive",
        });
    } finally {
        // Reset state for next time
        setIsGenerating(false);
        setProgress(0);
        setCurrentStep(0);
    }
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
