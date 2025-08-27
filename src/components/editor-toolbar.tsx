"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Feather, Save, History, MessageSquarePlus, Share2 } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";

export function EditorToolbar() {
  const [documentTitle, setDocumentTitle] = useState("Untitled Document");

  return (
    <header className="flex h-16 items-center border-b bg-card px-4 shrink-0">
      <div className="flex items-center gap-4">
        <Link href="/" className="flex items-center gap-2 text-primary font-semibold">
          <Feather className="w-5 h-5" />
          <span>Nimbus Uno</span>
        </Link>
        <Separator orientation="vertical" className="h-8" />
        <div>
          <Input 
            value={documentTitle}
            onChange={(e) => setDocumentTitle(e.target.value)}
            className="text-lg font-semibold border-none focus-visible:ring-0 focus-visible:ring-offset-0 p-0 h-auto"
            aria-label="Document Title"
          />
          <p className="text-xs text-muted-foreground">Not saved</p>
        </div>
      </div>
      <div className="ml-auto flex items-center gap-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon">
                <Save className="h-4 w-4" />
                <span className="sr-only">Save</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Save Document</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon">
                <History className="h-4 w-4" />
                <span className="sr-only">Version History</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Version History</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon">
                <MessageSquarePlus className="h-4 w-4" />
                <span className="sr-only">Comments</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Comments</TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <Separator orientation="vertical" className="h-8 mx-2" />
        
        <Button>
          <Share2 className="mr-2 h-4 w-4" />
          Share
        </Button>
      </div>
    </header>
  );
}
