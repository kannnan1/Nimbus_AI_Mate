
"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MessageSquarePlus, User, X, CheckCircle2, CornerDownRight, MessageSquare, ChevronDown } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Separator } from './ui/separator';
import { cn } from '@/lib/utils';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";


export type Reply = {
    id: string;
    author: string;
    timestamp: string;
    text: string;
};

export type Comment = {
  id: string;
  author: string;
  timestamp: string;
  text: string;
  quotedText: string;
  assignedTo?: string;
  resolved: boolean;
  replies: Reply[];
};

interface CommentsSidebarProps {
  comments: Comment[];
  setComments: React.Dispatch<React.SetStateAction<Comment[]>>;
  selectedText: string | null;
  onAddComment: (commentText: string, assignedTo: string) => void;
  onClearSelection: () => void;
}

const teamMembers = ["Me", "Alex Doe", "Jane Smith", "Bob Johnson", "Alice Williams"];

export function CommentsSidebar({ comments, setComments, selectedText, onAddComment, onClearSelection }: CommentsSidebarProps) {
  const [commentText, setCommentText] = useState("");
  const [assignedTo, setAssignedTo] = useState(teamMembers[0]);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");
  const commentInputRef = React.useRef<HTMLTextAreaElement>(null);
  
  useEffect(() => {
    if (selectedText) {
      commentInputRef.current?.focus();
    }
  }, [selectedText]);

  const handleSubmit = () => {
    if (commentText.trim()) {
      onAddComment(commentText.trim(), assignedTo);
      setCommentText("");
    }
  };

  const handleToggleResolve = (commentId: string) => {
    setComments(comments.map(c => c.id === commentId ? { ...c, resolved: !c.resolved } : c));
  };

  const handleAddReply = (commentId: string) => {
    if (!replyText.trim()) return;

    const newReply: Reply = {
        id: `reply-${Date.now()}`,
        author: "Alex Doe",
        timestamp: new Date().toISOString(),
        text: replyText,
    };

    setComments(comments.map(c => 
        c.id === commentId ? { ...c, replies: [...c.replies, newReply] } : c
    ));
    setReplyText("");
    setReplyingTo(null);
  };

  return (
    <Card className="h-full flex flex-col border-l rounded-none shadow-none">
      <CardHeader className="border-b">
        <CardTitle className="flex items-center gap-2">
          <MessageSquarePlus className="text-primary" />
          <span>Comments</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0 flex-1 overflow-hidden">
        <ScrollArea className="h-full">
          {comments.length > 0 ? (
            <div className="divide-y">
              {comments.map(comment => (
                <div key={comment.id} className={cn("p-4 space-y-2", comment.resolved && "bg-muted/50")}>
                   <div className="flex justify-between items-start">
                     <p className="text-sm italic text-muted-foreground border-l-4 pl-2">"{comment.quotedText}"</p>
                      <Button variant={comment.resolved ? "secondary" : "ghost"} size="sm" onClick={() => handleToggleResolve(comment.id)} className="shrink-0 ml-2">
                           <CheckCircle2 className="w-4 h-4 mr-2" />
                          {comment.resolved ? 'Re-open' : 'Resolve'}
                      </Button>
                   </div>

                   <div className="flex items-start gap-3">
                     <Avatar className="w-8 h-8">
                       <AvatarFallback>{comment.author.charAt(0)}</AvatarFallback>
                     </Avatar>
                     <div className="bg-accent p-3 rounded-lg flex-1">
                       <div className="flex justify-between items-center mb-1">
                         <span className="font-semibold text-sm">{comment.author}</span>
                         <span className="text-xs text-muted-foreground">{formatDistanceToNow(new Date(comment.timestamp), { addSuffix: true })}</span>
                       </div>
                       <p className="text-sm">{comment.text}</p>
                       {comment.assignedTo && <p className="text-xs mt-2 text-primary font-semibold">Assigned to: {comment.assignedTo}</p>}
                     </div>
                   </div>
                   
                   <div className="pl-11 pt-2">
                     <Collapsible>
                       {comment.replies.length > 0 && (
                          <CollapsibleTrigger asChild>
                             <Button variant="ghost" size="sm" className="text-xs text-muted-foreground data-[state=open]:hidden">
                                <MessageSquare className="w-3 h-3 mr-2" />
                                {comment.replies.length} {comment.replies.length > 1 ? 'replies' : 'reply'}
                                <ChevronDown className="w-3 h-3 ml-1" />
                             </Button>
                          </CollapsibleTrigger>
                       )}
                       <CollapsibleContent className="space-y-3 pt-2">
                         {comment.replies.map(reply => (
                            <div key={reply.id} className="flex items-start gap-3">
                              <Avatar className="w-8 h-8">
                                <AvatarFallback>{reply.author.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <div className="bg-card p-3 rounded-lg flex-1 border">
                                 <div className="flex justify-between items-center mb-1">
                                   <span className="font-semibold text-sm">{reply.author}</span>
                                   <span className="text-xs text-muted-foreground">{formatDistanceToNow(new Date(reply.timestamp), { addSuffix: true })}</span>
                                 </div>
                                 <p className="text-sm">{reply.text}</p>
                              </div>
                            </div>
                         ))}
                       </CollapsibleContent>
                       {replyingTo === comment.id ? (
                           <div className="space-y-2 mt-2">
                               <Textarea 
                                   value={replyText}
                                   onChange={(e) => setReplyText(e.target.value)}
                                   placeholder="Write a reply..."
                                   rows={2}
                               />
                               <div className="flex justify-end gap-2">
                                   <Button variant="ghost" size="sm" onClick={() => setReplyingTo(null)}>Cancel</Button>
                                   <Button size="sm" onClick={() => handleAddReply(comment.id)}>Reply</Button>
                               </div>
                           </div>
                       ) : (
                          <div className='flex items-center justify-between pt-2'>
                              <Button variant="ghost" size="sm" onClick={() => setReplyingTo(comment.id)} disabled={comment.resolved}>
                                  <CornerDownRight className="w-4 h-4 mr-2" />
                                  Reply
                              </Button>
                          </div>
                       )}
                     </Collapsible>
                   </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center text-sm text-muted-foreground">
              <p>No comments yet.</p>
              <p>Select text in the document to start a conversation.</p>
            </div>
          )}
        </ScrollArea>
      </CardContent>
      <CardFooter className="p-4 border-t flex-col items-start gap-4">
        {selectedText && (
            <div className='w-full'>
                <div className="flex justify-between items-center mb-2">
                    <p className="text-sm font-semibold">Replying to:</p>
                    <Button variant="ghost" size="icon" className="h-6 w-6" onClick={onClearSelection}><X className="w-4 h-4"/></Button>
                </div>
                <p className="text-sm italic text-muted-foreground border-l-4 pl-2 truncate">"{selectedText}"</p>
                <Separator className='my-4' />
            </div>
        )}
        <Textarea 
          ref={commentInputRef}
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          placeholder={selectedText ? "Add your comment..." : "Select text to comment on..."}
          className="w-full"
          disabled={!selectedText}
        />
        <div className="w-full flex justify-between items-center">
            <div className="flex items-center gap-2">
                 <User className="w-4 h-4 text-muted-foreground" />
                 <Select value={assignedTo} onValueChange={setAssignedTo} disabled={!selectedText}>
                    <SelectTrigger className="w-[140px] h-8">
                        <SelectValue placeholder="Assign to..." />
                    </SelectTrigger>
                    <SelectContent>
                        {teamMembers.map(member => (
                             <SelectItem key={member} value={member}>{member}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
          <Button onClick={handleSubmit} disabled={!commentText.trim()}>Comment</Button>
        </div>
      </CardFooter>
    </Card>
  );
}
