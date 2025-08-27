
"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

interface ShareDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  documentTitle: string;
}

export function ShareDialog({ open, onOpenChange, documentTitle }: ShareDialogProps) {
  const [email, setEmail] = useState("");
  const [permission, setPermission] = useState("view");
  const { toast } = useToast();

  const handleShare = () => {
    // Here you would typically handle the share logic, e.g., API call
    console.log(`Sharing "${documentTitle}" with ${email} as ${permission}`);
    toast({
      title: "Document Shared!",
      description: `Successfully shared "${documentTitle}" with ${email}.`,
    });
    onOpenChange(false);
    setEmail("");
    setPermission("view");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Share "{documentTitle}"</DialogTitle>
          <DialogDescription>
            Enter the email of the person you want to share the document with.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="email" className="text-right">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Permissions</Label>
            <RadioGroup
              defaultValue="view"
              className="col-span-3 flex items-center space-x-4"
              value={permission}
              onValueChange={setPermission}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="view" id="r1" />
                <Label htmlFor="r1">View</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="edit" id="r2" />
                <Label htmlFor="r2">Edit</Label>
              </div>
               <div className="flex items-center space-x-2">
                <RadioGroupItem value="review" id="r3" />
                <Label htmlFor="r3">Review</Label>
              </div>
            </RadioGroup>
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleShare}>Share</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
