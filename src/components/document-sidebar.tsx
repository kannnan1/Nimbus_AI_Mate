
"use client";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { FileText, PlusCircle, ChevronsRight, ArrowUp, ArrowDown, Pencil } from "lucide-react";
import { AddSectionDialog } from "@/components/add-section-dialog";
import { RenameSectionDialog } from "@/components/rename-section-dialog";
import { cn } from "@/lib/utils";
import type { Section } from "@/types/document";

interface DocumentSidebarProps {
  sections: Section[];
  setSections: React.Dispatch<React.SetStateAction<Section[]>>;
  selectedSectionId: string | null;
  setSelectedSectionId: React.Dispatch<React.SetStateAction<string | null>>;
  setIsAddSectionOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsAddSubsectionOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsRenameDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setItemToRename: React.Dispatch<React.SetStateAction<{ id: string; currentTitle: string; type: 'section' | 'subsection', sectionId?: string } | null>>;
}

export function DocumentSidebar({
  sections,
  setSections,
  selectedSectionId,
  setSelectedSectionId,
  setIsAddSectionOpen,
  setIsAddSubsectionOpen,
  setIsRenameDialogOpen,
  setItemToRename,
}: DocumentSidebarProps) {

  const handleOpenRenameDialog = (item: { id: string, title: string }, type: 'section' | 'subsection', sectionId?: string) => {
    setItemToRename({ id: item.id, currentTitle: item.title, type, sectionId });
    setIsRenameDialogOpen(true);
  };
  
  const moveItem = <T,>(array: T[], index: number, direction: 'up' | 'down'): T[] => {
    const newArray = [...array];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= newArray.length) return newArray;
    [newArray[index], newArray[newIndex]] = [newArray[newIndex], newArray[index]];
    return newArray;
  };

  const handleMoveSection = (index: number, direction: 'up' | 'down') => {
    setSections(moveItem(sections, index, direction));
  };
  
  const handleMoveSubsection = (sectionIndex: number, subsectionIndex: number, direction: 'up' | 'down') => {
    const newSections = [...sections];
    const section = newSections[sectionIndex];
    section.subsections = moveItem(section.subsections, subsectionIndex, direction);
    setSections(newSections);
  };


  return (
    <aside className="h-full bg-card flex flex-col border-r">
      <div className="p-4 border-b flex items-center justify-between">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <FileText className="w-5 h-5" />
          <span>Document Outline</span>
        </h2>
      </div>
      <div className="p-2 flex items-center gap-2 justify-center">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="icon" onClick={() => setIsAddSectionOpen(true)}>
                <PlusCircle className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Add Section</p>
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="icon" disabled={!selectedSectionId} onClick={() => setIsAddSubsectionOpen(true)}>
                <ChevronsRight className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Add Subsection</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <ScrollArea className="flex-1 p-2">
        {sections.length === 0 ? (
          <div className="p-4 text-center text-sm text-muted-foreground">
            <p>Your document outline is empty.</p>
            <p>Add sections to get started.</p>
          </div>
        ) : (
          <div className="space-y-1">
            {sections.map((section, secIndex) => (
              <div key={section.id}>
                <div 
                  className={cn(
                    "group flex items-center justify-between p-2 rounded-md cursor-pointer hover:bg-accent",
                    selectedSectionId === section.id && "bg-accent"
                  )}
                  onClick={() => setSelectedSectionId(section.id)}
                >
                  <span className="font-semibold text-sm truncate">{secIndex + 1}. {section.title}</span>
                  <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button variant="ghost" size="icon" className="h-6 w-6" onClick={(e) => { e.stopPropagation(); handleOpenRenameDialog(section, 'section')}}>
                      <Pencil className="w-3 h-3" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-6 w-6" onClick={(e) => { e.stopPropagation(); handleMoveSection(secIndex, 'up')}} disabled={secIndex === 0}>
                      <ArrowUp className="w-4 h-4" />
                    </Button>
                     <Button variant="ghost" size="icon" className="h-6 w-6" onClick={(e) => { e.stopPropagation(); handleMoveSection(secIndex, 'down')}} disabled={secIndex === sections.length - 1}>
                      <ArrowDown className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                {section.subsections.length > 0 && (
                   <div className="pl-6 mt-1 space-y-1">
                      {section.subsections.map((subsection, subIndex) => (
                          <div key={subsection.id} className="group flex items-center justify-between p-2 rounded-md hover:bg-accent/50">
                             <span className="text-sm truncate">{secIndex + 1}.{subIndex + 1}. {subsection.title}</span>
                             <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <Button variant="ghost" size="icon" className="h-6 w-6" onClick={(e) => { e.stopPropagation(); handleOpenRenameDialog(subsection, 'subsection', section.id)}}>
                                  <Pencil className="w-3 h-3" />
                                </Button>
                                <Button variant="ghost" size="icon" className="h-6 w-6" onClick={(e) => { e.stopPropagation(); handleMoveSubsection(secIndex, subIndex, 'up')}} disabled={subIndex === 0}>
                                  <ArrowUp className="w-4 h-4" />
                                </Button>
                                 <Button variant="ghost" size="icon" className="h-6 w-6" onClick={(e) => { e.stopPropagation(); handleMoveSubsection(secIndex, subIndex, 'down')}} disabled={subIndex === section.subsections.length - 1}>
                                  <ArrowDown className="w-4 h-4" />
                                </Button>
                              </div>
                          </div>
                      ))}
                   </div>
                )}
              </div>
            ))}
          </div>
        )}
      </ScrollArea>
    </aside>
  );
}
