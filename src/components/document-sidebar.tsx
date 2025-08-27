"use client";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { FileText, PlusCircle, ChevronsRight } from "lucide-react";

export function DocumentSidebar() {
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
                    <Button variant="outline" size="icon">
                        <PlusCircle className="w-4 h-4" />
                    </Button>
                </TooltipTrigger>
                <TooltipContent>
                    <p>Add Section</p>
                </TooltipContent>
            </Tooltip>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button variant="outline" size="icon">
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
        <div className="p-4 text-center text-sm text-muted-foreground">
            <p>Your document outline is empty.</p>
            <p>Add sections to get started.</p>
        </div>
      </ScrollArea>
    </aside>
  );
}
