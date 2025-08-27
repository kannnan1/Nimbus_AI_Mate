"use client";

import { useState } from "react";
import { DocumentSidebar } from "@/components/document-sidebar";
import { EditorToolbar } from "@/components/editor-toolbar";
import { AiChatbot } from "@/components/ai-chatbot";
import { Card, CardContent } from "@/components/ui/card";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { RichTextEditor } from "./rich-text-editor";

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
                  <RichTextEditor
                    value={documentContent}
                    onChange={setDocumentContent}
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
