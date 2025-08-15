"use client";

import { useState, useEffect } from "react";
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
  Edit as EditIcon,
  Trash2 as DeleteIcon,
  AlignLeft,
  AlignCenter,
  AlignRight,
} from "lucide-react";

interface TipTapBubbleMenuProps {
  editor: Editor;
}

const TipTapBubbleMenu = ({ 
  editor 
}: TipTapBubbleMenuProps) => {
  const [linkUrl, setLinkUrl] = useState('');
  const [isLinkDialogOpen, setIsLinkDialogOpen] = useState(false);
  const [isImageEditOpen, setIsImageEditOpen] = useState(false);
  const [editImageUrl, setEditImageUrl] = useState('');
  const [isImageSelected, setIsImageSelected] = useState(false);
  const currentAlign = isImageSelected ? (editor.getAttributes('image').align || null) : null;
  
  // Track when image is selected using useEffect
  useEffect(() => {
    if (!editor) return;

    const updateImageSelection = () => {
      const imageActive = editor.isActive('image');
      setIsImageSelected(imageActive);
      
      if (imageActive) {
        console.log('🖼️ Image is now selected/active');
      }
    };

    // Check initially
    updateImageSelection();

    // Listen for selection changes
    editor.on('selectionUpdate', updateImageSelection);
    editor.on('transaction', updateImageSelection);

    return () => {
      editor.off('selectionUpdate', updateImageSelection);
      editor.off('transaction', updateImageSelection);
    };
  }, [editor]);
  
  // Console log which block is focused
  useEffect(() => {
    if (!editor) return;

    const logFocusedBlock = () => {
      const { state } = editor;
      const { selection } = state;
      const { $from } = selection;
      
      // Get the current node
      const currentNode = $from.node();
      const parentNode = $from.parent;
      
      // Get node types and attributes
      const nodeInfo = {
        currentNodeType: currentNode.type.name,
        currentNodeAttrs: currentNode.attrs,
        parentNodeType: parentNode.type.name,
        parentNodeAttrs: parentNode.attrs,
        selectionFrom: selection.from,
        selectionTo: selection.to,
        isTextSelection: selection.empty,
        activeMarks: state.selection.$from.marks().map(mark => mark.type.name),
        activeNodes: [] as Array<{ type: string; attrs: any; depth: number }>
      };

      // Check for active nodes (like headings, blockquotes, etc.)
      let depth = $from.depth;
      while (depth >= 0) {
        const node = $from.node(depth);
        if (node) {
          nodeInfo.activeNodes.push({
            type: node.type.name,
            attrs: node.attrs,
            depth: depth
          });
        }
        depth--;
      }

      console.log('🎯 Focused Block Info:', nodeInfo);
      
      // Log specific node types for easier debugging
      if (editor.isActive('heading')) {
        const level = editor.getAttributes('heading').level;
        console.log(`📝 Heading Level ${level} is active`);
      }
      
      if (editor.isActive('paragraph')) {
        console.log('📄 Paragraph is active');
      }
      
      if (editor.isActive('blockquote')) {
        console.log('💬 Blockquote is active');
      }
      
      if (editor.isActive('codeBlock')) {
        const language = editor.getAttributes('codeBlock').language;
        console.log(`💻 Code block is active (language: ${language})`);
      }
      
      if (editor.isActive('bulletList')) {
        console.log('• Bullet list is active');
      }
      
      if (editor.isActive('orderedList')) {
        console.log('🔢 Ordered list is active');
      }

      if (editor.isActive('image')) {
        const src = editor.getAttributes('image').src;
        console.log('🖼️ Image is active:', src);
      }
    };

    // Log on selection change
    editor.on('selectionUpdate', logFocusedBlock);
    
    // Also log on transaction (when content changes)
    editor.on('transaction', logFocusedBlock);

    // Cleanup
    return () => {
      editor.off('selectionUpdate', logFocusedBlock);
      editor.off('transaction', logFocusedBlock);
    };
  }, [editor]);

  // Image editing functions
  const editImage = () => {
    const currentSrc = editor.getAttributes('image').src || '';
    setEditImageUrl(currentSrc);
    setIsImageEditOpen(true);
  };

  const handleImageUpdate = () => {
    if (editImageUrl) {
      editor.chain().focus().updateAttributes('image', { src: editImageUrl }).run();
    }
    setIsImageEditOpen(false);
    setEditImageUrl('');
  };

  const deleteImage = () => {
    editor.chain().focus().deleteSelection().run();
  };

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
        {isImageSelected ? (
          // Image editing menu - only show edit and delete buttons
          <>
            {/* Image Alignment Controls */}
            <div className="flex items-center gap-1 mr-1">
              <Button
                variant={currentAlign === 'left' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => editor.chain().focus().updateAttributes('image', { align: 'left' }).run()}
                className="h-8 w-8 p-0"
                title="Align Left"
              >
                <AlignLeft className="h-4 w-4" />
              </Button>
              <Button
                variant={currentAlign === 'center' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => editor.chain().focus().updateAttributes('image', { align: 'center' }).run()}
                className="h-8 w-8 p-0"
                title="Align Center"
              >
                <AlignCenter className="h-4 w-4" />
              </Button>
              <Button
                variant={currentAlign === 'right' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => editor.chain().focus().updateAttributes('image', { align: 'right' }).run()}
                className="h-8 w-8 p-0"
                title="Align Right"
              >
                <AlignRight className="h-4 w-4" />
              </Button>
            </div>

            <Dialog open={isImageEditOpen} onOpenChange={setIsImageEditOpen}>
              <DialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={editImage}
                  className="h-8 w-8 p-0"
                  title="Edit Image"
                >
                  <EditIcon className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Edit Image</DialogTitle>
                </DialogHeader>
                <div className="flex items-center space-x-2">
                  <div className="grid flex-1 gap-2">
                    <Input
                      placeholder="https://example.com/image.jpg"
                      value={editImageUrl}
                      onChange={(e) => setEditImageUrl(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handleImageUpdate();
                        }
                      }}
                    />
                  </div>
                  <Button onClick={handleImageUpdate} size="sm" className="px-3">
                    Update
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={deleteImage}
              className="h-8 w-8 p-0 text-destructive hover:text-destructive"
              title="Delete Image"
            >
              <DeleteIcon className="h-4 w-4" />
            </Button>
          </>
        ) : (
          // Regular text formatting bubble menu
          <>
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
          </>
        )}
      </div>
    </BubbleMenu>
  );
};

export default TipTapBubbleMenu;
