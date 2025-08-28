
"use client";

import type { Dispatch, SetStateAction } from "react";
import React, { useState, useRef, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Send, Sparkles, Book, Scale, ClipboardPlus, CheckCircle, Bot, User, X, CornerDownLeft, BarChart, ImageIcon } from "lucide-react";
import { accessReferenceRepository } from "@/ai/flows/access-reference-repository";
import { documentAlignmentTool } from "@/ai/flows/document-alignment-tool";
import { insertSectionsFromPastDocuments } from "@/ai/flows/insert-sections-from-past-documents";
import { automatedSectionQualityChecks } from "@/ai/flows/automated-section-quality-checks";
import { interpretSelection } from "@/ai/flows/interpret-selection";
import { cn } from "@/lib/utils";
import { Textarea } from "./ui/textarea";
import { Switch } from "./ui/switch";
import { Label } from "./ui/label";

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
  selectedText?: string | null;
  onInsertText: (text: string, mode: 'replace' | 'after') => void;
}

export function AiChatbot({ documentContent, setDocumentContent, onInsertSection, onClose, selectedText, onInsertText }: AiChatbotProps) {
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, role: "assistant", content: "Hello! I'm your Nimbus AI assistant. How can I help you with this document? You can select text to use it in your queries." },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [mode, setMode] = useState<"ask" | "agent">("ask");
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const selectionType = useMemo(() => {
    if (!selectedText) return 'text';
    if (selectedText.includes('|') && selectedText.includes('---')) return 'table';
    if (selectedText.startsWith('![')) return 'image';
    return 'text';
  }, [selectedText]);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({
        top: scrollAreaRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);

  const addMessage = (role: "user" | "assistant", content: React.ReactNode, insertionMode: 'replace' | 'after' = 'replace') => {
    setMessages((prev) => [...prev, { id: Date.now(), role, content }]);
    if (role === 'assistant' && mode === 'agent' && typeof content === 'string') {
        const textToInsert = `\n\n${content}\n\n`;
        onInsertText(textToInsert, insertionMode);
    }
  };

  const handleSearchRepository = async () => {
    if (isLoading) return;
    setIsLoading(true);
    const query = selectedText || "project proposal";
    
    addMessage("user", (
      <div>
        <p>Search repository for:</p>
        <p className="italic bg-primary-foreground/10 p-2 rounded-md mt-1">"{query}"</p>
      </div>
    ));

    try {
      const result = await accessReferenceRepository({ query: query });
      const responseContent = (
        <div>
          <p className="font-semibold mb-2">Found {result.results.length} relevant documents:</p>
          <ul className="list-disc pl-5 space-y-1">
            {result.results.map((doc, i) => <li key={i}>{doc}</li>)}
          </ul>
        </div>
      );
      addMessage("assistant", responseContent);
    } catch (error) {
      addMessage("assistant", "Sorry, I couldn't access the repository at the moment.");
    }
    setIsLoading(false);
  };
  
  const handleInterpretSelection = async () => {
    if (isLoading || !selectedText) return;
    setIsLoading(true);

    addMessage("user", `Interpret the selected ${selectionType}.`);
    try {
      const result = await interpretSelection({ selection: selectedText, contentType: selectionType });
      setTimeout(() => {
        addMessage("assistant", result.interpretation, 'after');
        setIsLoading(false);
      }, 2000);
    } catch (error) {
      console.error(error);
      addMessage("assistant", `Sorry, I couldn't interpret the ${selectionType}.`);
      setIsLoading(false);
    }
  };

  const handleAlignmentCheck = async () => {
    if (isLoading) return;
    setIsLoading(true);
    addMessage("user", "Check this document's alignment with past standards.");
    try {
      const pastStandards = "All project documents must include a 'Stakeholders' section and a 'Risk Assessment' section. The tone should be formal and objective.";
      const result = await documentAlignmentTool({ currentDocument: documentContent, pastDocumentStandards: pastStandards });
       const responseContent = (
        <div>
          <p className="font-semibold mb-2">Alignment Score: {result.alignmentScore}/100</p>
          <p className="font-semibold">Suggestions:</p>
          <p>{result.suggestions}</p>
        </div>
      );
      setTimeout(() => {
        addMessage("assistant", responseContent);
        setIsLoading(false);
      }, 2500);
    } catch (error) {
      addMessage("assistant", "Sorry, I couldn't perform the alignment check.");
      setIsLoading(false);
    }
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
    const contentToCheck = selectedText || documentContent;
    addMessage("user", `Perform a quality check on the ${selectedText ? 'selected text' : 'document'}.`);
    try {
      const result = await automatedSectionQualityChecks({ sectionContent: contentToCheck });
      const responseContent = (
        <div className="space-y-3">
            <div>
                <p className="font-semibold mb-2">Quality Assessment:</p>
                <ul className="space-y-2 text-xs">
                    <li className="p-2 bg-background/50 rounded-md">
                        <p><strong>Clarity: {result.clarity.score}/100</strong></p>
                        <p className="text-muted-foreground">{result.clarity.reasoning}</p>
                    </li>
                     <li className="p-2 bg-background/50 rounded-md">
                        <p><strong>Conciseness: {result.conciseness.score}/100</strong></p>
                        <p className="text-muted-foreground">{result.conciseness.reasoning}</p>
                    </li>
                     <li className="p-2 bg-background/50 rounded-md">
                        <p><strong>Accuracy: {result.accuracy.score}/100</strong></p>
                        <p className="text-muted-foreground">{result.accuracy.reasoning}</p>
                    </li>
                     <li className="p-2 bg-background/50 rounded-md">
                        <p><strong>Completeness: {result.completeness.score}/100</strong></p>
                        <p className="text-muted-foreground">{result.completeness.reasoning}</p>
                    </li>
                </ul>
            </div>
            <div>
                <p className="font-semibold">Overall Feedback:</p>
                <p>{result.overallFeedback}</p>
            </div>
        </div>
      );
      setTimeout(() => {
        addMessage("assistant", responseContent);
        setIsLoading(false);
      }, 2500);
    } catch (error) {
      console.error(error);
      addMessage("assistant", "Sorry, I couldn't complete the quality check.");
      setIsLoading(false);
    }
  };
  
  const handleUseSelectionAsContext = () => {
    if (selectedText) {
      setInput(prev => `Context from document:\n"""\n${selectedText}\n"""\n\nYour question:\n`);
    }
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    
    addMessage("user", input);

    // Mock response
    setTimeout(() => {
        const mockResponse = `This is a mock response based on your query: "${input}". In Agent mode, this text would also be added to your document.`;
        addMessage("assistant", mockResponse);
    }, 500);
    
    setInput("");
  }

  const aiActions = [
    { label: "Search Repository", icon: Book, action: handleSearchRepository, show: true },
    { label: "Check Alignment", icon: Scale, action: handleAlignmentCheck, show: true },
    { label: "Insert Section", icon: ClipboardPlus, action: onInsertSection, show: selectionType === 'text' && !selectedText },
    { label: "Interpret Table", icon: BarChart, action: handleInterpretSelection, show: selectionType === 'table' },
    { label: "Interpret Image", icon: ImageIcon, action: handleInterpretSelection, show: selectionType === 'image' },
    { label: "Quality Check", icon: CheckCircle, action: handleQualityCheck, show: true },
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
                    "p-3 rounded-lg max-w-xs lg:max-w-sm xl:max-w-md whitespace-pre-wrap",
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
            {aiActions.filter(action => action.show).map(({ label, icon: Icon, action}) => (
                <Button key={label} variant="outline" size="sm" onClick={action} disabled={isLoading}>
                    <Icon className="w-4 h-4 mr-2" />
                    {label}
                </Button>
            ))}
        </div>
        
        {selectedText && (
          <Button variant="outline" size="sm" onClick={handleUseSelectionAsContext} className="w-full">
            <CornerDownLeft className="w-4 h-4 mr-2" />
            Use Selection as Context
          </Button>
        )}

        <form onSubmit={handleSendMessage} className="flex w-full space-x-2 items-start">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={selectedText ? "Ask about selected text..." : "Ask a follow-up question..."}
            disabled={isLoading}
            rows={2}
            className="min-h-0"
          />
          <Button type="submit" size="icon" disabled={isLoading || !input.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </form>

        <div className="flex items-center space-x-2 w-full justify-end pt-2 border-t">
          <Label htmlFor="agent-mode" className={cn("text-muted-foreground", mode === "ask" && "text-primary font-semibold")}>Ask</Label>
          <Switch id="agent-mode" checked={mode === 'agent'} onCheckedChange={(checked) => setMode(checked ? 'agent' : 'ask')} />
          <Label htmlFor="agent-mode" className={cn("text-muted-foreground", mode === "agent" && "text-primary font-semibold")}>Agent</Label>
        </div>
      </CardFooter>
    </Card>
  );
}

    
