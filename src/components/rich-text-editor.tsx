
import React from 'react';
import { Bold, Italic, Underline, Strikethrough, List, ListOrdered, Heading1, Heading2, Heading3, AlignLeft, AlignCenter, AlignRight, Code, MessageSquarePlus } from 'lucide-react';
import { Button } from './ui/button';
import { Separator } from './ui/separator';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  onSelectText: (text: string | null) => void;
}

export const RichTextEditor = React.forwardRef<HTMLDivElement, RichTextEditorProps>(
    ({ value, onChange, placeholder, onSelectText }, ref) => {
  
      const contentEditableRef = React.useRef<HTMLDivElement>(null);

      // Effect to update the contentEditable div when the value prop changes
      React.useEffect(() => {
        if (contentEditableRef.current && contentEditableRef.current.innerHTML !== value) {
          contentEditableRef.current.innerHTML = value;
        }
      }, [value]);

      const handleInput = (e: React.FormEvent<HTMLDivElement>) => {
        onChange(e.currentTarget.innerHTML);
      };

      const handleSelection = () => {
        const selection = window.getSelection()?.toString().trim();
        if (selection) {
          onSelectText(selection);
        }
      };
      
      const handleAddComment = () => {
        const selection = window.getSelection()?.toString().trim();
        onSelectText(selection || null);
      };
      
      const handleExecCommand = (command: string, value?: string) => {
        document.execCommand(command, false, value);
        if (contentEditableRef.current) {
          onChange(contentEditableRef.current.innerHTML);
          contentEditableRef.current.focus();
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
            <Button variant="ghost" size="icon" onClick={() => handleExecCommand('formatBlock', '<h1>')}><Heading1 className="w-4 h-4" /></Button>
            <Button variant="ghost" size="icon" onClick={() => handleExecCommand('formatBlock', '<h2>')}><Heading2 className="w-4 h-4" /></Button>
            <Button variant="ghost" size="icon" onClick={() => handleExecCommand('formatBlock', '<h3>')}><Heading3 className="w-4 h-4" /></Button>
            <Separator orientation="vertical" className="h-6 mx-1" />
            <Button variant="ghost" size="icon" onClick={() => handleExecCommand('justifyLeft')}><AlignLeft className="w-4 h-4" /></Button>
            <Button variant="ghost" size="icon" onClick={() => handleExecCommand('justifyCenter')}><AlignCenter className="w-4 h-4" /></Button>
            <Button variant="ghost" size="icon" onClick={() => handleExecCommand('justifyRight')}><AlignRight className="w-4 h-4" /></Button>
            <Button variant="ghost" size="icon" onClick={() => handleExecCommand('formatBlock', '<pre>')}><Code className="w-4 h-4" /></Button>
            <Separator orientation="vertical" className="h-6 mx-1" />
            <Button variant="ghost" size="icon" onClick={handleAddComment} title="Add Comment">
                <MessageSquarePlus className="w-4 h-4"/>
            </Button>
          </div>
            <div
                ref={node => {
                    contentEditableRef.current = node;
                    if (typeof ref === 'function') {
                        ref(node);
                    } else if (ref) {
                        ref.current = node;
                    }
                }}
                contentEditable
                onInput={handleInput}
                onMouseUp={handleSelection}
                onKeyUp={handleSelection}
                className="prose max-w-none h-full w-full resize-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0 p-6 text-base"
                dangerouslySetInnerHTML={{ __html: value }}
                placeholder={placeholder}
            />
        </div>
      );
    }
);

RichTextEditor.displayName = 'RichTextEditor';
