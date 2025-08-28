
"use client";

import { useState, useEffect } from "react";
import { DocumentSidebar } from "@/components/document-sidebar";
import { EditorToolbar } from "@/components/editor-toolbar";
import { AiChatbot } from "@/components/ai-chatbot";
import { CommentsSidebar, type Comment } from "@/components/comments-sidebar";
import { Card, CardContent } from "@/components/ui/card";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { RichTextEditor } from "./rich-text-editor";
import { AddSectionDialog } from "@/components/add-section-dialog";
import { RenameSectionDialog } from "@/components/rename-section-dialog";
import type { Section, SubSection } from "@/types/document";

interface EditorPageProps {
  initialTitle?: string;
  initialContent?: string;
  initialSections?: Section[];
}

export function EditorPage({ initialTitle = "Untitled Document", initialContent = "", initialSections = [] }: EditorPageProps) {
  const [documentContent, setDocumentContent] = useState(initialContent);
  const [sections, setSections] = useState<Section[]>(initialSections);
  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(null);
  const [isAddSectionOpen, setIsAddSectionOpen] = useState(false);
  const [isAddSubsectionOpen, setIsAddSubsectionOpen] = useState(false);
  const [isRenameDialogOpen, setIsRenameDialogOpen] = useState(false);
  const [itemToRename, setItemToRename] = useState<{ id: string; currentTitle: string; type: 'section' | 'subsection', sectionId?: string } | null>(null);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [selectedText, setSelectedText] = useState<string | null>(null);

  useEffect(() => {
    // On initial load, if there's content, we don't want to immediately overwrite it.
    if (isInitialLoad) {
      setIsInitialLoad(false);
      return;
    }

    const generateMarkdownFromSections = (sections: Section[]): string => {
      return sections.map((section, secIndex) => {
        const sectionTitle = `# ${secIndex + 1}. ${section.title}\n\n`;
        const subsectionsContent = section.subsections.map((subsection, subIndex) => {
          return `## ${secIndex + 1}.${subIndex + 1}. ${subsection.title}\n\n`;
        }).join('');
        return sectionTitle + subsectionsContent;
      }).join('');
    };
    setDocumentContent(generateMarkdownFromSections(sections));
  }, [sections, isInitialLoad]);

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
    };
    setComments([...comments, newComment]);
    setSelectedText(null);
  };

  return (
    <div className="h-screen w-screen flex flex-col bg-accent/40">
      <EditorToolbar 
        initialTitle={initialTitle} 
        documentContent={documentContent} 
        sections={sections} 
        onToggleComments={() => setIsCommentsOpen(!isCommentsOpen)}
      />
      <div className="flex-1 overflow-hidden">
        <ResizablePanelGroup direction="horizontal" className="h-full w-full">
          <ResizablePanel defaultSize={18} minSize={15} maxSize={25}>
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
          <ResizablePanel defaultSize={isCommentsOpen ? 38 : 52} minSize={30}>
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
          <ResizableHandle withHandle />
          {isCommentsOpen && (
            <>
              <ResizablePanel defaultSize={20} minSize={15} maxSize={30}>
                <CommentsSidebar 
                  comments={comments} 
                  onAddComment={handleAddComment}
                  selectedText={selectedText}
                  onClearSelection={() => setSelectedText(null)}
                />
              </ResizablePanel>
              <ResizableHandle withHandle />
            </>
          )}
          <ResizablePanel collapsible collapsedSize={4} defaultSize={isCommentsOpen ? 24 : 30} minSize={20} maxSize={40}>
            <AiChatbot
              documentContent={documentContent}
              setDocumentContent={setDocumentContent}
              onInsertSection={() => setIsAddSectionOpen(true)}
            />
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
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
