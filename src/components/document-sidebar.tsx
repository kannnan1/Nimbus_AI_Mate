"use client";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
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
      <div className="p-2 flex items-center gap-2">
          <Button variant="outline" size="sm" className="flex-1">
            <PlusCircle className="w-4 h-4 mr-2" />
            Add Section
          </Button>
          <Button variant="outline" size="sm" className="flex-1">
            <ChevronsRight className="w-4 h-4 mr-2" />
            Add Subsection
          </Button>
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
