
"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";
import { format } from "date-fns";
import type { Section } from "@/types/document";


export type DocumentVersion = {
  timestamp: string;
  content: string;
  sections: Section[];
  summary?: string;
};

interface VersionHistoryDialogProps {
  open: boolean;
  onOpencha: (open: boolean) => void;
  versions: DocumentVersion[];
}

export function VersionHistoryDialog({ open, onOpenChange, versions }: VersionHistoryDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Version History</DialogTitle>
          <DialogDescription>
            A list of all saved versions for this document.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[60vh] pr-4">
          <div className="py-4 space-y-4">
            {versions.length > 0 ? (
              versions.map((version, index) => (
                <Card key={version.timestamp} className="hover:bg-accent/50 cursor-pointer">
                  <CardContent className="p-4 space-y-2">
                    <p className="font-semibold text-sm">
                      Saved on {format(new Date(version.timestamp), "MMM d, yyyy 'at' h:mm a")}
                    </p>
                     {version.summary && (
                      <p className="text-sm text-foreground italic">
                        "{version.summary}"
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground truncate">
                      {version.content ? version.content.substring(0, 80) + "..." : "No content"}
                    </p>
                  </CardContent>
                </Card>
              ))
            ) : (
              <p className="text-sm text-muted-foreground text-center pt-8">
                No saved versions found for this document.
              </p>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
