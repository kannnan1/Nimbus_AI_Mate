
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Eye, X } from "lucide-react";

interface PreviewSidebarProps {
  title: string;
  content: string;
  onClose?: () => void;
}

export function PreviewSidebar({ title, content, onClose }: PreviewSidebarProps) {
  return (
    <Card className="h-full flex flex-col border-l rounded-none shadow-none">
      <CardHeader className="border-b flex flex-row items-center justify-between py-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <Eye className="text-primary" />
          <span>Document Preview</span>
        </CardTitle>
        {onClose && (
            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={onClose}>
                <X className="w-4 h-4" />
            </Button>
        )}
      </CardHeader>
      <CardContent className="p-0 flex-1 flex flex-col min-h-0">
        <ScrollArea className="flex-1">
            <div className="p-6 prose max-w-none">
                <h1 className="text-4xl font-extrabold mb-6 border-b pb-4">{title}</h1>
                 <div 
                    dangerouslySetInnerHTML={{ __html: content }} 
                 />
            </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
