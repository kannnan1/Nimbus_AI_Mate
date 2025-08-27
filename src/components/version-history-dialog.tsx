
"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface VersionHistoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function VersionHistoryDialog({ open, onOpenChange }: VersionHistoryDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Version History</DialogTitle>
          <DialogDescription>
            Here you would see a list of past saves and the changes between them.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <p className="text-sm text-muted-foreground">
            This feature is not fully implemented in this prototype. A real implementation would show a timeline of document versions.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
