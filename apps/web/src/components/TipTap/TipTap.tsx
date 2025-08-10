"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import KeyboardShortcutsHelper from './KeyboardShortcutsHelper';
import MenuBar from './MenuBar';
import TipTapBubbleMenu from './TipTapBubbleMenu';
import { TipTapProps } from './types';
// Import highlight.js CSS for syntax highlighting styles
import 'highlight.js/styles/github-dark.css'; // You can choose different themes
// Import KaTeX CSS for math rendering
import 'katex/dist/katex.min.css';
import {
  useEditor,
  EditorContent,
  type Editor,
} from "@tiptap/react";
import { Extension } from '@tiptap/core';
import Heading from "@tiptap/extension-heading";
import Document from "@tiptap/extension-document";
import Paragraph from "@tiptap/extension-paragraph";
import Text from "@tiptap/extension-text";
import Bold from "@tiptap/extension-bold";
import Italic from "@tiptap/extension-italic";
import Code from "@tiptap/extension-code";
import Strike from "@tiptap/extension-strike";
import Highlight from "@tiptap/extension-highlight";
import Subscript from "@tiptap/extension-subscript";
import Superscript from "@tiptap/extension-superscript";
import Underline from "@tiptap/extension-underline";
import { UndoRedo, Dropcursor } from "@tiptap/extensions";
import Blockquote from "@tiptap/extension-blockquote";
import { OrderedList, BulletList, ListItem } from "@tiptap/extension-list";
import HardBreak from "@tiptap/extension-hard-break";
import HorizontalRule from "@tiptap/extension-horizontal-rule";
import TextAlign from "@tiptap/extension-text-align";
import Typography from "@tiptap/extension-typography";
import UniqueID from "@tiptap/extension-unique-id";
import { Button } from "@/components/ui/button";
import { FontFamily, TextStyle, Color, FontSize } from "@tiptap/extension-text-style";
import { Placeholder } from "@tiptap/extensions";
import Link from '@tiptap/extension-link';
import { Selection } from '@tiptap/extensions';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import { all, createLowlight } from 'lowlight';
import { Mathematics } from '@tiptap/extension-mathematics';
import Image from '@tiptap/extension-image';

const Tiptap = ({
  initialContent = null,
  initialTitle = "",
  onTitleChange,
  onContentChange,
}: TipTapProps) => {
  const [title, setTitle] = useState(initialTitle);
  const [isToolbarVisible, setIsToolbarVisible] = useState(true);
  const titleRef = useRef<HTMLTextAreaElement>(null);
  const [mathEditDialog, setMathEditDialog] = useState<{
    isOpen: boolean;
    type: 'inline' | 'block';
    currentLatex: string;
    node?: any;
    pos?: number;
  }>({
    isOpen: false,
    type: 'inline',
    currentLatex: '',
  });

  // create a lowlight instance with all languages loaded
  const lowlight = createLowlight(all);


  // Auto-resize title textarea
  const autoResizeTitle = useCallback((element?: HTMLTextAreaElement) => {
    const textarea = element || titleRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = textarea.scrollHeight + 'px';
    }
  }, []);

  // Effect to resize title when it changes
  useEffect(() => {
    autoResizeTitle();
  }, [title, autoResizeTitle]);

  // Debounce function
  const useDebounce = (value: string, delay: number) => {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
      const handler = setTimeout(() => {
        setDebouncedValue(value);
      }, delay);

      return () => {
        clearTimeout(handler);
      };
    }, [value, delay]);

    return debouncedValue;
  };

  // Debounced values
  const debouncedTitle = useDebounce(title, 500);

  // Effect for title changes
  useEffect(() => {
    if (onTitleChange && debouncedTitle !== initialTitle) {
      onTitleChange(debouncedTitle);
    }
  }, [debouncedTitle, onTitleChange, initialTitle]);

  // Handle math edit dialog
  const handleMathEdit = (newLatex: string) => {
    if (!editor || !mathEditDialog.node || mathEditDialog.pos === undefined) return;
    
    if (mathEditDialog.type === 'block') {
      editor.chain().setNodeSelection(mathEditDialog.pos).updateBlockMath({ latex: newLatex }).focus().run();
    } else {
      editor.chain().setNodeSelection(mathEditDialog.pos).updateInlineMath({ latex: newLatex }).focus().run();
    }
    
    setMathEditDialog({ isOpen: false, type: 'inline', currentLatex: '' });
  };

  const closeMathEditDialog = () => {
    setMathEditDialog({ isOpen: false, type: 'inline', currentLatex: '' });
  };

  const editor = useEditor({
    extensions: [
      // Custom extension to persist font family and size for new paragraphs
      Extension.create({
        name: 'persistentTextStyle',
        addStorage() {
          return {
            defaultFontFamily: null as string | null,
            defaultFontSize: null as string | null,
          };
        },
        onSelectionUpdate() {
          const attrs = this.editor.getAttributes('textStyle') as { fontFamily?: string; fontSize?: string };
          if (attrs?.fontFamily) this.storage.defaultFontFamily = attrs.fontFamily;
          if (attrs?.fontSize) this.storage.defaultFontSize = attrs.fontSize;
        },
        addKeyboardShortcuts() {
          return {
            Enter: () => {
              const { defaultFontFamily, defaultFontSize } = this.storage as { defaultFontFamily: string | null; defaultFontSize: string | null };
              
              // Split the block first
              const result = this.editor.chain().focus().splitBlock().run();
              
              // Then apply the stored font styles to the new paragraph
              if (result && (defaultFontFamily || defaultFontSize)) {
                const attrs: Record<string, string> = {};
                if (defaultFontFamily) attrs.fontFamily = defaultFontFamily;
                if (defaultFontSize) attrs.fontSize = defaultFontSize;
                this.editor.chain().focus().setMark('textStyle', attrs).run();
              }
              
              return result;
            },
          };
        },
      }),
      UniqueID.configure({
        types: ["heading"],
        generateID: () => {
          // Generate a more readable ID format
          return `heading-${Date.now()}-${Math.random()
            .toString(36)
            .substr(2, 9)}`;
        },
      }),
      Heading.configure({
        levels: [1, 2, 3, 4, 5, 6],
      }),
      Document,
      Paragraph,
      Text,
      // TextStyle and Color extensions must come before formatting marks
      TextStyle,
      Color.configure({
        types: ['textStyle'],
      }),
      FontFamily,
      FontSize,
      Bold,
      Italic,
      Strike,
      Code,
      Highlight.configure({
        multicolor: true,
      }),
      Subscript,
      Superscript,
      Underline,
      UndoRedo,
      Blockquote,
      OrderedList,
      BulletList,
      ListItem,
      HardBreak,
      HorizontalRule,
      TextAlign.configure({
        types: ["heading", "paragraph"],
        
      }),
      Typography,
      Link.configure({
        openOnClick: false,
        autolink: true,
        defaultProtocol: 'https',
      }),
      Placeholder.configure({
        placeholder: "Start writing ...",
      }),
      Selection,
      CodeBlockLowlight.configure({
        lowlight,
        defaultLanguage: 'javascript',
        languageClassPrefix: 'language-',
      }),
      Mathematics.configure({
        blockOptions: {
          onClick: (node, pos) => {
            setMathEditDialog({
              isOpen: true,
              type: 'block',
              currentLatex: node.attrs.latex || '',
              node,
              pos,
            });
          },
        },
        inlineOptions: {
          onClick: (node, pos) => {
            setMathEditDialog({
              isOpen: true,
              type: 'inline',
              currentLatex: node.attrs.latex || '',
              node,
              pos,
            });
            },
          },
          }),
          Dropcursor.configure({
          color: 'blue',
          width: 2,
          }),
          Image
        ],
        content: initialContent || "<p></p>",
        onUpdate: ({ editor }) => {
      const content = editor.getHTML();
      // Use a simple debounce for content changes
      if (onContentChange) {
        clearTimeout((window as any).contentDebounceTimer);
        (window as any).contentDebounceTimer = setTimeout(() => {
          onContentChange(content);
        }, 500);
      }
    },
    // Don't render immediately on the server to avoid SSR issues
    immediatelyRender: false,
  });

  // Keyboard shortcut handler for Ctrl+S and toolbar toggle
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.key === "s") {
        event.preventDefault();
        if (editor && onContentChange) {
          const content = editor.getHTML();
          onContentChange(content);
        }
      }
      
      // Ctrl+Shift+T to toggle toolbar
      if (event.ctrlKey && event.shiftKey && event.key === "T") {
        event.preventDefault();
        setIsToolbarVisible(!isToolbarVisible);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [editor, onContentChange, isToolbarVisible]);

  return (
    <div className="w-full">
      {/* Main Toolbar - Conditionally visible */}
      {isToolbarVisible && (
        <div className="sticky top-16 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <MenuBar 
            editor={editor} 
            onHideToolbar={() => setIsToolbarVisible(false)}
            mathEditDialog={mathEditDialog}
            onMathEdit={handleMathEdit}
            onCloseMathEditDialog={closeMathEditDialog}
          />
        </div>
      )}

      {/* Floating Buttons - Always visible */}
      <div className="fixed bottom-4 left-4 z-20 flex flex-col gap-2">
        {/* Keyboard Shortcuts Helper - Always floating */}
        <div className="h-10 w-10 rounded-full shadow-lg bg-background border-2 flex items-center justify-center">
          <KeyboardShortcutsHelper />
        </div>

        {/* Show Toolbar Button - Only visible when toolbar is hidden */}
        {!isToolbarVisible && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsToolbarVisible(true)}
            className="h-10 w-10 p-0 rounded-full shadow-lg bg-background border-2"
            title="Show Toolbar (Ctrl+Shift+T)"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </Button>
        )}
      </div>
      
      {/* Bubble Menu */}
      {editor && (
        <TipTapBubbleMenu 
          editor={editor} 
        />
      )}

        <div className="max-w-4xl mx-auto">
        <div className="border border-input rounded-md">
          {/* Document Title Input - Notion Style */}
          <div className="p-6 pb-2">
            <textarea
              ref={titleRef}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Untitled"
              className="font-bold border-none px-0 py-2 h-auto focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent placeholder:text-muted-foreground/60 resize-none w-full overflow-hidden focus:outline-none"
              style={{
                lineHeight: "1.1",
                fontWeight: "800",
                fontSize: "2.8rem",
                minHeight: "3.5rem",
                outline: "none",
                border: "none",
              }}
              rows={1}
              onInput={(e) => autoResizeTitle(e.target as HTMLTextAreaElement)}
              onFocus={(e) => autoResizeTitle(e.target as HTMLTextAreaElement)}
            />
          </div>          {/* Editor Content */}
          <div className="px-6 pb-6">
            <EditorContent
              editor={editor}
              className="prose prose-strong:text-inherit dark:prose-invert max-w-none [&_pre]:bg-muted [&_pre]:border [&_pre]:rounded-md [&_pre]:p-4 [&_pre]:overflow-x-auto [&_pre_code]:bg-transparent [&_pre_code]:p-0 [&_pre_code]:text-sm [&_pre_code]:font-mono [&_.math-inline]:bg-muted/50 [&_.math-inline]:px-1 [&_.math-inline]:rounded [&_.math-display]:bg-muted/30 [&_.math-display]:p-3 [&_.math-display]:rounded-md [&_.math-display]:my-4 [&_.math-display]:text-center"
            />
          </div>
          <div 
            className="h-60 w-full bg-muted/20 hover:bg-muted/40 transition-all duration-200 cursor-pointer border-t flex items-center justify-center text-muted-foreground hover:text-foreground rounded-b-md"
            onClick={() => {
              if (editor) {
                // Move cursor to the end and add a new paragraph
                editor.chain().focus().setTextSelection(editor.state.doc.content.size).insertContent('<p></p>').run();
              }
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.height = '60px';
            }}
          onMouseLeave={(e) => {
              e.currentTarget.style.height = '48px';
            }}
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tiptap;
