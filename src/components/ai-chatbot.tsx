
"use client";

import type { Dispatch, SetStateAction } from "react";
import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Send, Sparkles, Book, Scale, ClipboardPlus, CheckCircle, Bot, User, X } from "lucide-react";
import { accessReferenceRepository } from "@/ai/flows/access-reference-repository";
import { documentAlignmentTool } from "@/ai/flows/document-alignment-tool";
import { insertSectionsFromPastDocuments } from "@/ai/flows/insert-sections-from-past-documents";
import { automatedSectionQualityChecks } from "@/ai/flows/automated-section-quality-checks";
import { cn } from "@/lib/utils";

type Message = {
  id: number;
  role: "user" | "assistant";
  content: React.ReactNode;
};

interface AiChatbotProps {
  documentContent: string;
  setDocumentContent: Dispatch<SetStateAction<string>>;
  onInsertSection: () => void;
  onClose?: () => void;
}

export function AiChatbot({ documentContent, setDocumentContent, onInsertSection, onClose }: AiChatbotProps) {
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, role: "assistant", content: "Hello! I'm your Nimbus AI assistant. How can I help you with this document?" },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({
        top: scrollAreaRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);

  const addMessage = (role: "user" | "assistant", content: React.ReactNode) => {
    setMessages((prev) => [...prev, { id: Date.now(), role, content }]);
  };

  const handleSearchRepository = async () => {
    if (isLoading) return;
    setIsLoading(true);
    addMessage("user", "Search the reference repository for 'project proposal'.");
    try {
      const result = await accessReferenceRepository({ query: "project proposal" });
      addMessage("assistant", (
        <div>
          <p className="font-semibold mb-2">Found {result.results.length} relevant documents:</p>
          <ul className="list-disc pl-5 space-y-1">
            {result.results.map((doc, i) => <li key={i}>{doc}</li>)}
          </ul>
        </div>
      ));
    } catch (error) {
      addMessage("assistant", "Sorry, I couldn't access the repository at the moment.");
    }
    setIsLoading(false);
  };

  const handleAlignmentCheck = async () => {
    if (isLoading) return;
    setIsLoading(true);
    addMessage("user", "Check this document's alignment with past standards.");
    try {
      const pastStandards = "All project documents must include a 'Stakeholders' section and a 'Risk Assessment' section. The tone should be formal and objective.";
      const result = await documentAlignmentTool({ currentDocument: documentContent, pastDocumentStandards: pastStandards });
      addMessage("assistant", (
        <div>
          <p className="font-semibold mb-2">Alignment Score: {result.alignmentScore}/100</p>
          <p className="font-semibold">Suggestions:</p>
          <p>{result.suggestions}</p>
        </div>
      ));
    } catch (error) {
      addMessage("assistant", "Sorry, I couldn't perform the alignment check.");
    }
    setIsLoading(false);
  };
  
  const handleInsertSectionFromPastDoc = async () => {
    if (isLoading) return;
    setIsLoading(true);
    addMessage("user", "Insert 'Risk Assessment' section from a past document.");
    try {
      const pastSection = "### 4. Risk Assessment\n- Market Risk: The competitive landscape may shift, impacting our market share.\n- Technical Risk: Integration with legacy systems could pose challenges.";
      const result = await insertSectionsFromPastDocuments({ currentDocument: documentContent, pastDocumentSection: pastSection });
      setDocumentContent(result.updatedDocument);
      addMessage("assistant", "I've added the 'Risk Assessment' section to your document from a past example.");
    } catch (error) {
      addMessage("assistant", "Sorry, I couldn't insert the section from a past document.");
    }
    setIsLoading(false);
  };
  
  const handleQualityCheck = async () => {
    if (isLoading) return;
    setIsLoading(true);
    addMessage("user", "Perform a quality check on this document.");
    try {
      const result = await automatedSectionQualityChecks({ sectionContent: documentContent });
      addMessage("assistant", (
        <div>
          <p className="font-semibold mb-2">Quality Score: {result.qualityScore}/100</p>
          <p className="font-semibold">Feedback:</p>
          <p>{result.feedback}</p>
        </div>
      ));
    } catch (error) {
      addMessage("assistant", "Sorry, I couldn't complete the quality check.");
    }
    setIsLoading(false);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    addMessage("user", input);
    addMessage("assistant", "This is a mock response. For a full conversational experience, integrate a conversational AI model.");
    setInput("");
  }

  const aiActions = [
    { label: "Search Repository", icon: Book, action: handleSearchRepository },
    { label: "Check Alignment", icon: Scale, action: handleAlignmentCheck },
    { label: "Insert Section", icon: ClipboardPlus, action: onInsertSection },
    { label: "Quality Check", icon: CheckCircle, action: handleQualityCheck },
  ];

  return (
    <Card className="h-full flex flex-col shadow-none rounded-lg border-2 border-primary/20">
      <CardHeader className="border-b bg-primary/5 flex items-center justify-between flex-row py-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <Sparkles className="text-primary" />
          <span>AI Assistant</span>
        </CardTitle>
        {onClose && (
            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={onClose}>
                <X className="w-4 h-4" />
            </Button>
        )}
      </CardHeader>
      <CardContent className="p-0 flex-1 overflow-hidden">
        <ScrollArea className="h-full" ref={scrollAreaRef}>
          <div className="p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  "flex items-start gap-3",
                  message.role === "user" ? "justify-end" : "justify-start"
                )}
              >
                {message.role === "assistant" && (
                  <Avatar className="w-8 h-8">
                    <AvatarFallback><Bot className="w-4 h-4" /></AvatarFallback>
                  </Avatar>
                )}
                <div
                  className={cn(
                    "p-3 rounded-lg max-w-xs lg:max-w-sm xl:max-w-md",
                    message.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-accent"
                  )}
                >
                  <div className="text-sm">{message.content}</div>
                </div>
                 {message.role === "user" && (
                  <Avatar className="w-8 h-8">
                    <AvatarFallback><User className="w-4 h-4" /></AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}
            {isLoading && (
              <div className="flex items-start gap-3 justify-start">
                  <Avatar className="w-8 h-8">
                    <AvatarFallback><Bot className="w-4 h-4" /></AvatarFallback>
                  </Avatar>
                  <div className="p-3 rounded-lg bg-accent">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                       <div className="w-2 h-2 rounded-full bg-muted-foreground animate-pulse delay-0"></div>
                       <div className="w-2 h-2 rounded-full bg-muted-foreground animate-pulse delay-150"></div>
                       <div className="w-2 h-2 rounded-full bg-muted-foreground animate-pulse delay-300"></div>
                    </div>
                  </div>
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
      <CardFooter className="p-4 border-t flex-col items-start gap-4">
        <div className="grid grid-cols-2 gap-2 w-full">
            {aiActions.map(({ label, icon: Icon, action}) => (
                <Button key={label} variant="outline" size="sm" onClick={action} disabled={isLoading && label !== 'Insert Section'}>
                    <Icon className="w-4 h-4 mr-2" />
                    {label}
                </Button>
            ))}
        </div>
        <form onSubmit={handleSendMessage} className="flex w-full space-x-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask a follow-up question..."
            disabled={isLoading}
          />
          <Button type="submit" size="icon" disabled={isLoading}>
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
}
