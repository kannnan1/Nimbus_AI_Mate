
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
import { Loader2 } from "lucide-react";
import type { Section } from "@/types/document";
import { fetchAndProcessDocx } from "@/ai/flows/fetch-and-process-docx";
import { correctTables } from "@/ai/flows/correct-tables-flow";
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

const documentUrl = "https://raw.githubusercontent.com/kannnan1/NIMBUS_Demo/main/document_example.docx";


interface PopulatedDocumentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  documentTitle: string;
}

export function PopulatedDocumentDialog({ open, onOpenChange, documentTitle }: PopulatedDocumentDialogProps) {
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [otherProjectName, setOtherProjectName] = useState("");
  const [selectedPipelineId, setSelectedPipelineId] = useState<string | null>(null);
  const [selectedVersion, setSelectedVersion] = useState<string | null>(null);
  
  const [pipelines, setPipelines] = useState<{ id: string; uuid: string; versions: string[] }[]>([]);
  const [versions, setVersions] = useState<string[]>([]);
  
  const [isNavigating, setIsNavigating] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    if (selectedProjectId) {
      if (selectedProjectId === 'other') {
          setPipelines([]); // Or you could have some default pipelines for 'Other'
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


  const handleGoToEditor = async () => {
    const finalProjectName = selectedProjectId === 'other' ? otherProjectName.trim() : projects.find(p => p.id === selectedProjectId)?.name;
    if (!documentTitle || !finalProjectName) return;

    setIsNavigating(true);
    
    try {
        const initialResult = await fetchAndProcessDocx({ url: documentUrl });
        
        if (initialResult.html.includes("Error processing document")) {
            throw new Error(initialResult.html);
        }

        const { correctedHtml } = await correctTables({ htmlContent: initialResult.html });

        const storedDocsString = localStorage.getItem("myDocuments");
        const storedDocs = storedDocsString ? JSON.parse(storedDocsString) : [];
        
        const newDoc = {
          title: documentTitle,
          lastModified: new Date().toISOString(),
          createdAt: new Date().toISOString(),
          content: correctedHtml,
          sections: [], // Sections would need to be parsed from the HTML or handled differently
          comments: [],
          documentType: "Populated Document",
          projectId: finalProjectName,
        };
        
        storedDocs.unshift(newDoc);
        localStorage.setItem("myDocuments", JSON.stringify(storedDocs));

        onOpenChange(false);
        router.push(`/editor?title=${encodeURIComponent(newDoc.title)}`);

    } catch (error: any) {
        console.error(error);
        toast({
            title: "Error",
            description: `Could not load the document. ${error.message}`,
            variant: "destructive",
        });
    } finally {
        setIsNavigating(false);
    }
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
        </div>
        <DialogFooter>
            <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button onClick={handleGoToEditor} disabled={isNavigating || (selectedProjectId !== 'other' && !selectedVersion) || (selectedProjectId === 'other' && !otherProjectName) }>
                {isNavigating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isNavigating ? 'Loading...' : 'Go to Editor'}
            </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
