
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
  // A simple markdown to HTML converter. 
  // In a real app, you'd use a more robust library like 'marked' or 'react-markdown'.
  const createMarkup = (markdown: string) => {
    let html = markdown;
    
    // Process tables first
    html = html.replace(
      /\|(.+)\|\n\|(.+)\|\n((?:\|.*\|\n?)*)/g,
      (match, header, separator, body) => {
        const headers = header.split('|').slice(1, -1).map(h => h.trim());
        const rows = body.split('\n').filter(r => r.trim()).map(r => r.split('|').slice(1, -1).map(c => c.trim()));
        let tableHtml = '<table class="w-full my-4 border-collapse border">';
        tableHtml += '<thead><tr>' + headers.map(h => `<th class="border p-2 text-left font-bold bg-muted">${h}</th>`).join('') + '</tr></thead>';
        tableHtml += '<tbody>' + rows.map(row => '<tr>' + row.map(cell => `<td class="border p-2">${cell}</td>`).join('') + '</tr>').join('') + '</tbody>';
        tableHtml += '</table>';
        return tableHtml;
      }
    );
    
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
    html = html.replace(/!\[(.*?)\]\((.*?)\)/gim, '<img src="$2" alt="$1" class="my-4 rounded-lg shadow-md max-w-full h-auto" />');
    // Line breaks
    html = html.replace(/\n/g, '<br />');

    // Remove <br /> inside tables
    html = html.replace(/<table[^>]*>[\s\S]*?<\/table>/g, (table) => table.replace(/<br \/>/g, ''));
    
    return { __html: html };
  };

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
      <CardContent className="p-0 flex-1 overflow-hidden">
        <ScrollArea className="h-full">
            <div className="p-6 prose prose-sm lg:prose-base max-w-none">
                <h1 className="text-4xl font-extrabold mb-6 border-b pb-4">{title}</h1>
                 <div 
                    dangerouslySetInnerHTML={createMarkup(content)} 
                 />
            </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
