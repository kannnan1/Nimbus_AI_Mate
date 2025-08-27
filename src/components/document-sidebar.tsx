"use client";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FileText, ChevronRight } from "lucide-react";

const sections = [
  {
    title: "Introduction",
    subsections: [],
  },
  {
    title: "Key Objectives",
    subsections: ["Objective A", "Objective B", "Objective C"],
  },
  {
    title: "Execution Plan",
    subsections: ["Phase 1", "Phase 2", "Phase 3"],
  },
  {
    title: "Timeline",
    subsections: [],
  },
  {
    title: "Budget",
    subsections: ["Resource Allocation", "Contingency Fund"],
  },
  {
    title: "Conclusion",
    subsections: [],
  },
];

export function DocumentSidebar() {
  return (
    <aside className="h-full bg-card flex flex-col border-r">
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <FileText className="w-5 h-5" />
          <span>Document Outline</span>
        </h2>
      </div>
      <ScrollArea className="flex-1">
        <Accordion type="multiple" defaultValue={["Key Objectives"]} className="p-2">
          {sections.map((section) => (
            <AccordionItem value={section.title} key={section.title} className="border-b-0">
              <AccordionTrigger className="text-sm font-medium hover:no-underline hover:bg-accent rounded-md px-2 py-1.5 [&[data-state=open]>svg]:rotate-90">
                {section.title}
              </AccordionTrigger>
              {section.subsections.length > 0 && (
                <AccordionContent className="pl-4 pt-1 pb-0">
                  <ul className="space-y-1">
                    {section.subsections.map((sub) => (
                       <li key={sub} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground cursor-pointer p-1 rounded-md hover:bg-accent/50">
                          <ChevronRight className="w-4 h-4" />
                          <span>{sub}</span>
                       </li>
                    ))}
                  </ul>
                </AccordionContent>
              )}
            </AccordionItem>
          ))}
        </Accordion>
      </ScrollArea>
    </aside>
  );
}
