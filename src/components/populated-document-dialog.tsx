
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
import { Loader2, FileText } from "lucide-react";
import mammoth from "mammoth";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { cn } from "@/lib/utils";

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

const knowledgeStoreDocuments = [
  {
    id: "doc1",
    title: "SR11-7 Model Validation Report Example",
    description: "A complete example of a validation report following SR11-7 guidelines.",
    url: "https://raw.githubusercontent.com/kannnan1/NIMBUS_Demo/main/document_example.docx",
  },
  {
    id: "doc2",
    title: "Q1 2024 Project Alpha Development",
    description: "Initial development documentation for the Project Alpha predictive model.",
    url: "https://raw.githubusercontent.com/kannnan1/NIMBUS_Demo/main/document_example.docx",
  }
];

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
  const [selectedKnowledgeDoc, setSelectedKnowledgeDoc] = useState<(typeof knowledgeStoreDocuments)[0] | null>(null);
  
  const [pipelines, setPipelines] = useState<{ id: string; uuid: string; versions: string[] }[]>([]);
  const [versions, setVersions] = useState<string[]>([]);
  
  const [isNavigating, setIsNavigating] = useState(false);
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

  const processAndNavigate = async (url: string, projectName: string) => {
     setIsNavigating(true);
    
    try {
        const response = await fetch(url);
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
        
        const newDoc = {
          title: documentTitle,
          lastModified: new Date().toISOString(),
          createdAt: new Date().toISOString(),
          content: htmlContent,
          sections: [], // Sections would need to be parsed from the HTML or handled differently
          comments: [],
          documentType: "Populated Document",
          projectId: projectName,
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
        console.error("Failed to load or convert document:", error);
        toast({
            title: "Error",
            description: `Could not load the document. ${error.message}`,
            variant: "destructive",
        });
    } finally {
        setIsNavigating(false);
    }
  }


  const handleGoToEditor = async (source: 'nimbus' | 'knowledge') => {
    if (source === 'nimbus') {
        const finalProjectName = selectedProjectId === 'other' ? otherProjectName.trim() : projects.find(p => p.id === selectedProjectId)?.name;
        if (!documentTitle || !finalProjectName) return;
        const defaultDocUrl = "https://raw.githubusercontent.com/kannnan1/NIMBUS_Demo/main/document_example.docx";
        await processAndNavigate(defaultDocUrl, finalProjectName);
    } else if (source === 'knowledge') {
        if (!selectedKnowledgeDoc) return;
        await processAndNavigate(selectedKnowledgeDoc.url, 'Knowledge Store');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
            <DialogTitle>Start with a Populated Document</DialogTitle>
            <DialogDescription>
                Select a source to start with a pre-filled draft for '{documentTitle}'.
            </DialogDescription>
        </DialogHeader>
        <Tabs defaultValue="nimbus-uno">
            <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="nimbus-uno">From Nimbus Uno</TabsTrigger>
                <TabsTrigger value="knowledge-store">From Knowledge Store</TabsTrigger>
            </TabsList>
            <TabsContent value="nimbus-uno">
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
                    <Button onClick={() => handleGoToEditor('nimbus')} disabled={isNavigating || (selectedProjectId !== 'other' && !selectedVersion) || (selectedProjectId === 'other' && !otherProjectName) }>
                        {isNavigating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {isNavigating ? 'Loading...' : 'Go to Editor'}
                    </Button>
                </DialogFooter>
            </TabsContent>
            <TabsContent value="knowledge-store">
                <div className="py-4 space-y-4">
                    <Label>Select a document from the Knowledge Store:</Label>
                    <div className="space-y-2 max-h-64 overflow-y-auto pr-2">
                        {knowledgeStoreDocuments.map(doc => (
                           <Card 
                             key={doc.id} 
                             onClick={() => setSelectedKnowledgeDoc(doc)} 
                             className={cn("cursor-pointer hover:bg-accent", selectedKnowledgeDoc?.id === doc.id && "bg-accent border-primary ring-2 ring-primary")}
                           >
                              <CardHeader className="p-4">
                                  <CardTitle className="text-base flex items-center gap-2">
                                     <FileText className="w-5 h-5 text-muted-foreground" />
                                     {doc.title}
                                  </CardTitle>
                                  <CardDescription className="text-xs pt-1">{doc.description}</CardDescription>
                              </CardHeader>
                           </Card>
                        ))}
                    </div>
                </div>
                 <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
                    <Button onClick={() => handleGoToEditor('knowledge')} disabled={isNavigating || !selectedKnowledgeDoc}>
                        {isNavigating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {isNavigating ? 'Loading...' : 'Go to Editor'}
                    </Button>
                </DialogFooter>
            </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
