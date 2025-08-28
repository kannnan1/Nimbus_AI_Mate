
import React, { useRef } from 'react';
import { Bold, Italic, Underline, Strikethrough, List, ListOrdered, Heading1, Heading2, Heading3, AlignLeft, AlignCenter, AlignRight, Code, MessageSquarePlus } from 'lucide-react';
import { Button } from './ui/button';
import { Separator } from './ui/separator';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  onSelectText: (text: string | null) => void;
}

export function RichTextEditor({ value, onChange, placeholder, onSelectText }: RichTextEditorProps) {
  const editorRef = useRef<HTMLTextAreaElement>(null);
  
  // In a real application, you would use a library like TipTap, Slate.js, or Quill.
  // This is a simplified simulation to demonstrate the UI and functionality.
  const handleExecCommand = (command: string, value?: string) => {
    // This is a placeholder for actual rich text logic.
    // In a real editor, document.execCommand is not recommended.
    console.log(`Executing command: ${command} with value: ${value}`);
    // A real implementation would manipulate the editor's state.
  };

  const handleAddComment = () => {
    const selection = window.getSelection()?.toString().trim();
    if (selection) {
      onSelectText(selection);
    } else {
      // If no text is selected, you could prompt the user or handle it differently.
      // For now, we'll only allow comments on selected text.
      alert("Please select text to comment on.");
    }
  };
  
  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center gap-1 p-2 border-b">
        <Button variant="ghost" size="icon" onClick={() => handleExecCommand('bold')}><Bold className="w-4 h-4" /></Button>
        <Button variant="ghost" size="icon" onClick={() => handleExecCommand('italic')}><Italic className="w-4 h-4" /></Button>
        <Button variant="ghost" size="icon" onClick={() => handleExecCommand('underline')}><Underline className="w-4 h-4" /></Button>
        <Button variant="ghost" size="icon" onClick={() => handleExecCommand('strikeThrough')}><Strikethrough className="w-4 h-4" /></Button>
        <Separator orientation="vertical" className="h-6 mx-1" />
        <Button variant="ghost" size="icon" onClick={() => handleExecCommand('insertUnorderedList')}><List className="w-4 h-4" /></Button>
        <Button variant="ghost" size="icon" onClick={() => handleExecCommand('insertOrderedList')}><ListOrdered className="w-4 h-4" /></Button>
        <Separator orientation="vertical" className="h-6 mx-1" />
        <Button variant="ghost" size="icon" onClick={() => handleExecCommand('formatBlock', 'h1')}><Heading1 className="w-4 h-4" /></Button>
        <Button variant="ghost" size="icon" onClick={() => handleExecCommand('formatBlock', 'h2')}><Heading2 className="w-4 h-4" /></Button>
        <Button variant="ghost" size="icon" onClick={() => handleExecCommand('formatBlock', 'h3')}><Heading3 className="w-4 h-4" /></Button>
        <Separator orientation="vertical" className="h-6 mx-1" />
        <Button variant="ghost" size="icon" onClick={() => handleExecCommand('justifyLeft')}><AlignLeft className="w-4 h-4" /></Button>
        <Button variant="ghost" size="icon" onClick={() => handleExecCommand('justifyCenter')}><AlignCenter className="w-4 h-4" /></Button>
        <Button variant="ghost" size="icon" onClick={() => handleExecCommand('justifyRight')}><AlignRight className="w-4 h-4" /></Button>
        <Button variant="ghost" size="icon" onClick={() => handleExecCommand('formatBlock', 'pre')}><Code className="w-4 h-4" /></Button>
        <Separator orientation="vertical" className="h-6 mx-1" />
        <Button variant="ghost" size="icon" onClick={handleAddComment} title="Add Comment">
            <MessageSquarePlus className="w-4 h-4"/>
        </Button>
      </div>
        <textarea
            ref={editorRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="h-full w-full resize-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0 p-6 text-base"
            placeholder={placeholder}
        />
    </div>
  );
}
