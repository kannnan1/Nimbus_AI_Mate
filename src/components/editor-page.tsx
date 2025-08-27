"use client";

import { useState } from "react";
import { DocumentSidebar } from "@/components/document-sidebar";
import { EditorToolbar } from "@/components/editor-toolbar";
import { AiChatbot } from "@/components/ai-chatbot";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";

const initialDocumentContent = ``;

export function EditorPage() {
  const [documentContent, setDocumentContent] = useState(initialDocumentContent);

  return (
    <div className="h-screen w-screen flex flex-col bg-accent/40">
      <EditorToolbar />
      <div className="flex-1 overflow-hidden">
        <ResizablePanelGroup direction="horizontal" className="h-full w-full">
          <ResizablePanel defaultSize={18} minSize={15} maxSize={25}>
            <DocumentSidebar />
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize={52} minSize={30}>
            <main className="h-full w-full p-4 flex flex-col">
              <Card className="flex-1 w-full shadow-inner">
                <CardContent className="p-0 h-full">
                  <Textarea
                    value={documentContent}
                    onChange={(e) => setDocumentContent(e.target.value)}
                    className="h-full w-full resize-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0 p-6 text-base"
                    placeholder="Start writing your document here..."
                  />
                </CardContent>
              </Card>
            </main>
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize={30} minSize={20} maxSize={40}>
            <AiChatbot
              documentContent={documentContent}
              setDocumentContent={setDocumentContent}
            />
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
}
