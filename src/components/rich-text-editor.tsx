
import React, { useRef, useState } from 'react';
import { Bold, Italic, Underline, Strikethrough, List, ListOrdered, Heading1, Heading2, Heading3, AlignLeft, AlignCenter, AlignRight, Code, MessageSquarePlus } from 'lucide-react';
import { Button } from './ui/button';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  onSelectText: (text: string | null) => void;
}

export function RichTextEditor({ value, onChange, placeholder, onSelectText }: RichTextEditorProps) {
  const editorRef = useRef<HTMLTextAreaElement>(null);
  const [popoverOpen, setPopoverOpen] = useState(false);
  
  // In a real application, you would use a library like TipTap, Slate.js, or Quill.
  // This is a simplified simulation to demonstrate the UI and functionality.
  const handleExecCommand = (command: string, value?: string) => {
    // This is a placeholder for actual rich text logic.
    // In a real editor, document.execCommand is not recommended.
    console.log(`Executing command: ${command} with value: ${value}`);
    // A real implementation would manipulate the editor's state.
  };

  const handleSelection = () => {
    const selection = window.getSelection()?.toString().trim();
    if (selection && selection.length > 0) {
      setPopoverOpen(true);
    } else {
      setPopoverOpen(false);
    }
  };

  const handleAddComment = () => {
    const selection = window.getSelection()?.toString().trim();
    if (selection) {
      onSelectText(selection);
    }
    setPopoverOpen(false);
  };
  
  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center gap-1 p-2 border-b">
        <Button variant="ghost" size="icon" onClick={() => handleExecCommand('bold')}><Bold className="w-4 h-4" /></Button>
        <Button variant="ghost" size="icon" onClick={() => handleExecCommand('italic')}><Italic className="w-4 h-4" /></Button>
        <Button variant="ghost" size="icon" onClick={() => handleExecCommand('underline')}><Underline className="w-4 h-4" /></Button>
        <Button variant="ghost" size="icon" onClick={() => handleExecCommand('strikeThrough')}><Strikethrough className="w-4 h-4" /></Button>
        <Button variant="ghost" size="icon" onClick={() => handleExecCommand('insertUnorderedList')}><List className="w-4 h-4" /></Button>
        <Button variant="ghost" size="icon" onClick={() => handleExecCommand('insertOrderedList')}><ListOrdered className="w-4 h-4" /></Button>
        <Button variant="ghost" size="icon" onClick={() => handleExecCommand('formatBlock', 'h1')}><Heading1 className="w-4 h-4" /></Button>
        <Button variant="ghost" size="icon" onClick={() => handleExecCommand('formatBlock', 'h2')}><Heading2 className="w-4 h-4" /></Button>
        <Button variant="ghost" size="icon" onClick={() => handleExecCommand('formatBlock', 'h3')}><Heading3 className="w-4 h-4" /></Button>
        <Button variant="ghost" size="icon" onClick={() => handleExecCommand('justifyLeft')}><AlignLeft className="w-4 h-4" /></Button>
        <Button variant="ghost" size="icon" onClick={() => handleExecCommand('justifyCenter')}><AlignCenter className="w-4 h-4" /></Button>
        <Button variant="ghost" size="icon" onClick={() => handleExecCommand('justifyRight')}><AlignRight className="w-4 h-4" /></Button>
        <Button variant="ghost" size="icon" onClick={() => handleExecCommand('formatBlock', 'pre')}><Code className="w-4 h-4" /></Button>
      </div>
      <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
        <PopoverTrigger asChild>
          <textarea
            ref={editorRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onMouseUp={handleSelection}
            onBlur={() => setTimeout(() => setPopoverOpen(false), 200)}
            className="h-full w-full resize-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0 p-6 text-base"
            placeholder={placeholder}
          />
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Button onClick={handleAddComment} variant="secondary" size="sm">
            <MessageSquarePlus className="w-4 h-4 mr-2"/>
            Add Comment
          </Button>
        </PopoverContent>
      </Popover>
    </div>
  );
}
