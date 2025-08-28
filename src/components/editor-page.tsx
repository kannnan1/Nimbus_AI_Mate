
"use client";

import { useState, useEffect, useRef } from "react";
import { DocumentSidebar } from "@/components/document-sidebar";
import { EditorToolbar } from "@/components/editor-toolbar";
import { AiChatbot } from "@/components/ai-chatbot";
import { CommentsSidebar, type Comment } from "@/components/comments-sidebar";
import { AddResultsSidebar } from "@/components/add-results-sidebar";
import { Card, CardContent } from "@/components/ui/card";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { RichTextEditor } from "./rich-text-editor";
import { AddSectionDialog } from "@/components/add-section-dialog";
import { RenameSectionDialog } from "@/components/rename-section-dialog";
import type { Section, SubSection } from "@/types/document";
import { Button } from "./ui/button";
import { Bot } from "lucide-react";
import { cn } from "@/lib/utils";
import { PreviewSidebar } from "./preview-sidebar";

interface EditorPageProps {
  initialTitle?: string;
  initialContent?: string;
  initialSections?: Section[];
  initialComments?: Comment[];
}

export function EditorPage({ initialTitle = "Untitled Document", initialContent = "", initialSections = [], initialComments = [] }: EditorPageProps) {
  const [documentContent, setDocumentContent] = useState(initialContent);
  const [documentTitle, setDocumentTitle] = useState(initialTitle);
  const [sections, setSections] = useState<Section[]>(initialSections);
  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(null);
  const [isAddSectionOpen, setIsAddSectionOpen] = useState(false);
  const [isAddSubsectionOpen, setIsAddSubsectionOpen] = useState(false);
  const [isRenameDialogOpen, setIsRenameDialogOpen] = useState(false);
  const [itemToRename, setItemToRename] = useState<{ id: string; currentTitle: string; type: 'section' | 'subsection', sectionId?: string } | null>(null);
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);
  const [isAddResultsOpen, setIsAddResultsOpen] = useState(false);
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [selectedText, setSelectedText] = useState<string | null>(null);
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStartPos = useRef({ x: 0, y: 0 });
  const hasSetInitialPosition = useRef(false);

  useEffect(() => {
    // If there are comments loaded with the document, open the sidebar automatically.
    if (initialComments && initialComments.length > 0) {
      setIsCommentsOpen(true);
    }
  }, [initialComments]);


  useEffect(() => {
    if (!hasSetInitialPosition.current) {
       setPosition({ x: window.innerWidth - 80, y: window.innerHeight - 80 });
       hasSetInitialPosition.current = true;
    }

    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        setPosition({
          x: e.clientX - dragStartPos.current.x,
          y: e.clientY - dragStartPos.current.y,
        });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  const handleMouseDown = (e: React.MouseEvent<HTMLButtonElement>) => {
    setIsDragging(true);
    dragStartPos.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    };
  };

  const handleAddSection = (title: string) => {
    const newSection: Section = {
      id: `sec-${Date.now()}`,
      title,
      subsections: [],
    };
    setSections([...sections, newSection]);
  };

  const handleAddSubsection = (title: string) => {
    if (!selectedSectionId) return;
    const newSubSection: SubSection = { id: `sub-${Date.now()}`, title };
    setSections(sections.map(section =>
      section.id === selectedSectionId
        ? { ...section, subsections: [...section.subsections, newSubSection] }
        : section
    ));
  };

  const handleRename = (newTitle: string) => {
    if (!itemToRename) return;

    if (itemToRename.type === 'section') {
      setSections(sections.map(section =>
        section.id === itemToRename.id ? { ...section, title: newTitle } : section
      ));
    } else if (itemToRename.type === 'subsection' && itemToRename.sectionId) {
      setSections(sections.map(section =>
        section.id === itemToRename.sectionId
          ? {
              ...section,
              subsections: section.subsections.map(sub =>
                sub.id === itemToRename.id ? { ...sub, title: newTitle } : sub
              )
            }
          : section
      ));
    }
    setItemToRename(null);
  };
  
  const handleAddComment = (commentText: string, assignedTo: string) => {
    if (!selectedText) return;
    const newComment: Comment = {
      id: `comment-${Date.now()}`,
      author: "Alex Doe",
      timestamp: new Date().toISOString(),
      text: commentText,
      quotedText: selectedText,
      assignedTo: assignedTo,
      resolved: false,
      replies: [],
    };
    setComments([...comments, newComment]);
    setSelectedText(null);
  };

  const onToggleAddResults = () => {
    setIsAddResultsOpen(!isAddResultsOpen);
    if (!isAddResultsOpen) {
      setIsCommentsOpen(false);
      setIsPreviewOpen(false);
    }
  };

  const onToggleComments = () => {
    setIsCommentsOpen(!isCommentsOpen);
     if (!isCommentsOpen) {
      setIsAddResultsOpen(false);
      setIsPreviewOpen(false);
    }
  };
  
  const onTogglePreview = () => {
    setIsPreviewOpen(!isPreviewOpen);
    if (!isPreviewOpen) {
        setIsCommentsOpen(false);
        setIsAddResultsOpen(false);
    }
  };

  return (
    <div className="h-screen w-screen flex flex-col bg-accent/40 overflow-hidden">
      <EditorToolbar 
        initialTitle={initialTitle} 
        documentTitle={documentTitle}
        onDocumentTitleChange={setDocumentTitle}
        documentContent={documentContent} 
        sections={sections} 
        comments={comments}
        onToggleComments={onToggleComments}
        onToggleAddResults={onToggleAddResults}
        onTogglePreview={onTogglePreview}
      />
      <div className="flex-1 overflow-hidden">
        <ResizablePanelGroup direction="horizontal" className="h-full w-full">
          <ResizablePanel defaultSize={20} minSize={15} maxSize={30}>
            <DocumentSidebar
              sections={sections}
              setSections={setSections}
              selectedSectionId={selectedSectionId}
              setSelectedSectionId={setSelectedSectionId}
              setIsAddSectionOpen={setIsAddSectionOpen}
              setIsAddSubsectionOpen={setIsAddSubsectionOpen}
              setIsRenameDialogOpen={setIsRenameDialogOpen}
              setItemToRename={setItemToRename}
            />
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize={isCommentsOpen || isAddResultsOpen || isPreviewOpen ? 60 : 80} minSize={40}>
            <main className="h-full w-full p-4 flex flex-col">
              <Card className="flex-1 w-full shadow-inner relative">
                <CardContent className="p-0 h-full">
                  <RichTextEditor
                    value={documentContent}
                    onChange={setDocumentContent}
                    placeholder="Start writing your document here..."
                    onSelectText={(text) => {
                      if (text) {
                        setIsCommentsOpen(true);
                        setSelectedText(text);
                      }
                    }}
                  />
                </CardContent>
              </Card>
            </main>
          </ResizablePanel>
          
          <div className={cn("transition-all duration-300", (isCommentsOpen || isAddResultsOpen || isPreviewOpen) ? "block" : "hidden")}>
             <ResizableHandle withHandle />
             <ResizablePanel defaultSize={20} minSize={15} maxSize={30}>
               {isCommentsOpen && (
                  <CommentsSidebar 
                    comments={comments}
                    setComments={setComments}
                    onAddComment={handleAddComment}
                    selectedText={selectedText}
                    onClearSelection={() => setSelectedText(null)}
                  />
               )}
               {isAddResultsOpen && (
                  <AddResultsSidebar onAddResult={(result) => setDocumentContent(prev => prev + `\n\n${result}`)} />
               )}
               {isPreviewOpen && (
                  <PreviewSidebar 
                    title={documentTitle} 
                    content={documentContent} 
                    onClose={() => setIsPreviewOpen(false)}
                  />
               )}
             </ResizablePanel>
          </div>
        </ResizablePanelGroup>
      </div>
      
      {isChatbotOpen && (
        <div className="absolute bottom-20 right-4 z-10 w-[400px] h-[600px] shadow-2xl rounded-lg">
           <AiChatbot
              documentContent={documentContent}
              setDocumentContent={setDocumentContent}
              onInsertSection={() => setIsAddSectionOpen(true)}
              onClose={() => setIsChatbotOpen(false)}
            />
        </div>
      )}

      {!isChatbotOpen && (
        <Button
          style={{ position: 'absolute', left: position.x, top: position.y }}
          onMouseDown={handleMouseDown}
          onClick={(e) => {
            if (e.detail === 1) { // Prevents click from firing on drag end
              const dx = e.clientX - dragStartPos.current.x - position.x;
              const dy = e.clientY - dragStartPos.current.y - position.y;
              if (dx * dx + dy * dy < 10) { // Simple drag threshold
                 setIsChatbotOpen(true);
              }
            }
          }}
          className="rounded-full w-14 h-14 shadow-lg cursor-grab active:cursor-grabbing z-20"
        >
          <Bot className="w-6 h-6" />
        </Button>
      )}


       <AddSectionDialog
        open={isAddSectionOpen}
        onOpenChange={setIsAddSectionOpen}
        onAdd={handleAddSection}
        title="Add New Section"
        description="Enter a title for your new section."
      />
      <AddSectionDialog
        open={isAddSubsectionOpen}
        onOpenChange={setIsAddSubsectionOpen}
        onAdd={handleAddSubsection}
        title="Add New Subsection"
        description="Enter a title for your new subsection."
      />
      {itemToRename && (
        <RenameSectionDialog
          open={isRenameDialogOpen}
          onOpenChange={setIsRenameDialogOpen}
          onRename={handleRename}
          currentTitle={itemToRename.currentTitle}
        />
      )}
    </div>
  );
}
