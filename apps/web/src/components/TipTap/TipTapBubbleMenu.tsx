"use client";

import { useState } from "react";
import { BubbleMenu } from '@tiptap/react/menus';
import { type Editor } from "@tiptap/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Bold as BoldIcon,
  Italic as ItalicIcon,
  Underline as UnderlineIcon,
  Strikethrough,
  Code2,
  Highlighter,
  Link as LinkIcon,
} from "lucide-react";

interface TipTapBubbleMenuProps {
  editor: Editor;
}

const TipTapBubbleMenu = ({ editor }: TipTapBubbleMenuProps) => {
  const [linkUrl, setLinkUrl] = useState('');
  const [isLinkDialogOpen, setIsLinkDialogOpen] = useState(false);

  const setLink = () => {
    const previousUrl = editor.getAttributes('link').href;
    setLinkUrl(previousUrl || '');
    setIsLinkDialogOpen(true);
  };

  const handleLinkSubmit = () => {
    // empty
    if (linkUrl === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      setIsLinkDialogOpen(false);
      return;
    }

    // update link
    editor.chain().focus().extendMarkRange('link').setLink({ href: linkUrl }).run();
    setIsLinkDialogOpen(false);
  };

  return (
    <BubbleMenu editor={editor}>
      <div className="bg-background border border-input rounded-md shadow-md p-1 flex items-center gap-1">
        <Button
          variant={editor.isActive('bold') ? 'default' : 'ghost'}
          size="sm"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className="h-8 w-8 p-0"
        >
          <BoldIcon className="h-4 w-4" />
        </Button>
        <Button
          variant={editor.isActive('italic') ? 'default' : 'ghost'}
          size="sm"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className="h-8 w-8 p-0"
        >
          <ItalicIcon className="h-4 w-4" />
        </Button>
        <Button
          variant={editor.isActive('underline') ? 'default' : 'ghost'}
          size="sm"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className="h-8 w-8 p-0"
        >
          <UnderlineIcon className="h-4 w-4" />
        </Button>
        <Button
          variant={editor.isActive('strike') ? 'default' : 'ghost'}
          size="sm"
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className="h-8 w-8 p-0"
        >
          <Strikethrough className="h-4 w-4" />
        </Button>
        <Button
          variant={editor.isActive('code') ? 'default' : 'ghost'}
          size="sm"
          onClick={() => editor.chain().focus().toggleCode().run()}
          className="h-8 w-8 p-0"
        >
          <Code2 className="h-4 w-4" />
        </Button>
        <Button
          variant={editor.isActive('highlight') ? 'default' : 'ghost'}
          size="sm"
          onClick={() => editor.chain().focus().toggleHighlight().run()}
          className="h-8 w-8 p-0"
        >
          <Highlighter className="h-4 w-4" />
        </Button>

        {/* Link Button in Bubble Menu */}
        <Dialog open={isLinkDialogOpen} onOpenChange={setIsLinkDialogOpen}>
          <DialogTrigger asChild>
            <Button
              variant={editor.isActive('link') ? 'default' : 'ghost'}
              size="sm"
              onClick={setLink}
              className="h-8 w-8 p-0"
              title="Add/Edit Link"
            >
              <LinkIcon className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Add Link</DialogTitle>
            </DialogHeader>
            <div className="flex items-center space-x-2">
              <div className="grid flex-1 gap-2">
                <Input
                  placeholder="https://example.com"
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleLinkSubmit();
                    }
                  }}
                />
              </div>
              <Button onClick={handleLinkSubmit} size="sm" className="px-3">
                <span className="sr-only">Add Link</span>
                Add
              </Button>
            </div>
          </DialogContent>
        </Dialog>
        
        {/* Color Picker in Bubble Menu */}
        <div className="flex items-center gap-2 border-l pl-2 ml-1">
          {/* Color Picker Input */}
          <input
            type="color"
            value={editor.getAttributes('textStyle').color || '#000000'}
            onChange={(e) => editor.chain().focus().setColor(e.target.value).run()}
            className="w-8 h-8 rounded border border-gray-300 cursor-pointer"
            title="Choose text color"
          />
          
          {/* Reset color button */}
          <Button
            variant="ghost"
            size="sm"
            className="w-6 h-6 p-0 rounded border border-gray-300 hover:scale-110 transition-transform bg-white"
            onClick={() => editor.chain().focus().unsetColor().run()}
            title="Reset color"
            style={{ 
              background: 'linear-gradient(45deg, transparent 30%, red 30%, red 70%, transparent 70%)',
              backgroundSize: '4px 4px'
            }}
          />
        </div>
      </div>
    </BubbleMenu>
  );
};

export default TipTapBubbleMenu;
