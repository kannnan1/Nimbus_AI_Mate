"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Feather, Save, History, MessageSquarePlus, Users, Share2 } from "lucide-react";

export function EditorToolbar() {
  return (
    <header className="flex h-16 items-center border-b bg-card px-4 shrink-0">
      <div className="flex items-center gap-4">
        <Link href="/" className="flex items-center gap-2 text-primary font-semibold">
          <Feather className="w-5 h-5" />
          <span>Nimbus AI Mate</span>
        </Link>
        <Separator orientation="vertical" className="h-8" />
        <div>
          <h1 className="text-lg font-semibold">Project Nimbus: Q3 Strategy</h1>
          <p className="text-xs text-muted-foreground">Last saved 2 minutes ago</p>
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

        <div className="flex items-center -space-x-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Avatar className="h-8 w-8 border-2 border-card">
                  <AvatarImage src="https://i.pravatar.cc/150?u=a042581f4e29026024d" />
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
              </TooltipTrigger>
              <TooltipContent>Jane Doe</TooltipContent>
            </Tooltip>
             <Tooltip>
              <TooltipTrigger>
                <Avatar className="h-8 w-8 border-2 border-card">
                  <AvatarImage src="https://i.pravatar.cc/150?u=a042581f4e29026704d" />
                  <AvatarFallback>SM</AvatarFallback>
                </Avatar>
              </TooltipTrigger>
              <TooltipContent>Steve Miller</TooltipContent>
            </Tooltip>
             <Tooltip>
              <TooltipTrigger>
                <Avatar className="h-8 w-8 border-2 border-card">
                  <AvatarFallback>+2</AvatarFallback>
                </Avatar>
              </TooltipTrigger>
              <TooltipContent>2 others</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <Button>
          <Share2 className="mr-2 h-4 w-4" />
          Share
        </Button>
      </div>
    </header>
  );
}
