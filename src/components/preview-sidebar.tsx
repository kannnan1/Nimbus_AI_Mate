
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Eye } from "lucide-react";

interface PreviewSidebarProps {
  title: string;
  content: string;
}

export function PreviewSidebar({ title, content }: PreviewSidebarProps) {
  // A simple markdown to HTML converter. 
  // In a real app, you'd use a more robust library like 'marked' or 'react-markdown'.
  const createMarkup = (markdown: string) => {
    let html = markdown;
    // Headers
    html = html.replace(/^# (.*$)/gim, '<h1 class="text-4xl font-bold mb-4 mt-6">$1</h1>');
    html = html.replace(/^## (.*$)/gim, '<h2 class="text-3xl font-bold mb-3 mt-5 border-b pb-2">$1</h2>');
    html = html.replace(/^### (.*$)/gim, '<h3 class="text-2xl font-bold mb-2 mt-4">$1</h3>');
    // Bold
    html = html.replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>');
    // Italic
    html = html.replace(/\*(.*?)\*/gim, '<em>$1</em>');
    // Lists (simple)
    html = html.replace(/^\s*[-*] (.*)/gim, '<li class="ml-6">$1</li>');
    html = html.replace(/(<li>.*<\/li>)/gis, '<ul>$1</ul>');
     // Replace placeholder images
    html = html.replace(/!\[(.*?)\]\((.*?)\)/gim, '<img src="$2" alt="$1" class="my-4 rounded-lg shadow-md" />');
    // Line breaks
    html = html.replace(/\n/g, '<br />');
    return { __html: html };
  };

  return (
    <Card className="h-full flex flex-col border-l rounded-none shadow-none">
      <CardHeader className="border-b">
        <CardTitle className="flex items-center gap-2">
          <Eye className="text-primary" />
          <span>Document Preview</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0 flex-1 overflow-hidden">
        <ScrollArea className="h-full">
            <div className="p-6">
                <h1 className="text-4xl font-extrabold mb-6 border-b pb-4">{title}</h1>
                 <div 
                    className="prose prose-sm lg:prose-base max-w-none" 
                    dangerouslySetInnerHTML={createMarkup(content)} 
                 />
            </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
