"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import KeyboardShortcutsHelper from './KeyboardShortcutsHelper';
import MenuBar from './MenuBar';
import TipTapBubbleMenu from './TipTapBubbleMenu';
import { TipTapProps } from './types';
import Image from "next/image";
import { X, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
import { FontFamily, TextStyle, Color, FontSize } from "@tiptap/extension-text-style";
import { Placeholder } from "@tiptap/extensions";
import Link from '@tiptap/extension-link';
import { Selection } from '@tiptap/extensions';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import { all, createLowlight } from 'lowlight';
import { Mathematics } from '@tiptap/extension-mathematics';
import ResizableImage from './extensions/ResizableImage';

const Tiptap = ({
  initialContent = null,
  initialTitle = "",
  onTitleChange,
  onContentChange,
  thumbnail,
  onThumbnailRemove,
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

  console.log("thumbnail:", thumbnail);

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
              // Check if we're inside a code block - if so, let the default behavior handle it
              if (this.editor.isActive('codeBlock')) {
                return false; // Let the default Enter behavior in code blocks handle this
              }
              
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
            // Auto-convert math patterns when typing
            '$': () => {
              // Allow the $ to be typed normally - conversion happens on space
              return false;
            },
            // Handle space to trigger math conversions
            ' ': () => {
              const { state } = this.editor;
              const { selection } = state;
              const { $from } = selection;
              
              // Get text before cursor
              const textBefore = $from.parent.textContent.slice(0, $from.parentOffset);
              
              // Check for block math pattern: $$ + space
              if (textBefore.endsWith('$$')) {
                // Remove the $$ and insert block math, then add space
                this.editor.chain()
                  .deleteRange({
                    from: $from.pos - 2,
                    to: $from.pos,
                  })
                  .insertContent('<div class="tiptap-mathematics-render" data-type="block-math" data-latex=""></div>')
                  .run();
                return true;
              }
              
              // Check for inline math pattern: content$ + space
              const inlineMathMatch = textBefore.match(/([^$\s]+)\$$/);
              if (inlineMathMatch) {
                const mathContent = inlineMathMatch[1];
                
                // Only convert if it looks like math and is reasonable length
                if (mathContent.length <= 30 && mathContent.length > 0 && (
                  /[a-zA-Z]/.test(mathContent) || // contains letters (variables)
                  /[\+\-\*\/\=\^\(\)\[\]{}\\]/.test(mathContent) || // contains math operators or backslash
                  /\d/.test(mathContent) // contains numbers
                )) {
                  // Remove the content and $ and insert inline math, then add the space
                  this.editor.chain()
                    .deleteRange({
                      from: $from.pos - mathContent.length - 1,
                      to: $from.pos,
                    })
                    .insertContent(`<span class="tiptap-mathematics-render" data-type="inline-math" data-latex="${mathContent}"></span> `)
                    .run();
                  return true;
                }
              }
              
              return false;
            },
          };
        },
      }),
      // Custom extension to handle math markdown paste
      Extension.create({
        name: 'mathMarkdownPaste',
        addProseMirrorPlugins() {
          const { Plugin, PluginKey } = require('@tiptap/pm/state');
          
          return [
            new Plugin({
              key: new PluginKey('mathMarkdownPaste'),
              props: {
                handlePaste: (view: any, event: ClipboardEvent, slice: any) => {
                  const text = event.clipboardData?.getData('text/plain');
                  if (!text) return false;

                  // Check if text contains math expressions
                  const hasBlockMath = /\$\$[\s\S]*?\$\$/g.test(text);
                  const hasInlineMath = /(?<!\$)\$(?!\$)[\s\S]*?(?<!\$)\$(?!\$)/g.test(text);

                  if (hasBlockMath || hasInlineMath) {
                    event.preventDefault();
                    
                    let processedText = text;
                    
                    // Process block math first ($$...$$)
                    processedText = processedText.replace(/\$\$([\s\S]*?)\$\$/g, (match: string, latex: string) => {
                      const cleanLatex = latex.trim();
                      // Use Mathematics extension's format
                      return `<div class="tiptap-mathematics-render" data-type="block-math" data-latex="${cleanLatex.replace(/"/g, '&quot;')}"></div>`;
                    });
                    
                    // Process inline math ($...$)
                    processedText = processedText.replace(/(?<!\$)\$(?!\$)([\s\S]*?)(?<!\$)\$(?!\$)/g, (match: string, latex: string) => {
                      const cleanLatex = latex.trim();
                      // Use Mathematics extension's format
                      return `<span class="tiptap-mathematics-render" data-type="inline-math" data-latex="${cleanLatex.replace(/"/g, '&quot;')}"></span>`;
                    });
                    
                    // Convert remaining markdown to basic HTML
                    processedText = processedText
                      .replace(/\n\n/g, '</p><p>')
                      .replace(/\n/g, '<br>')
                      .replace(/^/, '<p>')
                      .replace(/$/, '</p>');
                    
                    // Insert the processed content
                    this.editor.chain().focus().insertContent(processedText).run();
                    return true;
                  }
                  
                  return false;
                },
              },
            }),
          ];
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
          ResizableImage
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
        <MenuBar 
          editor={editor} 
          onHideToolbar={() => setIsToolbarVisible(false)}
          mathEditDialog={mathEditDialog}
          onMathEdit={handleMathEdit}
          onCloseMathEditDialog={closeMathEditDialog}
        />
      )}

      {/* Floating Buttons - Always visible */}
      <div className="fixed bottom-6 left-6 z-20 flex flex-col gap-3">
        {/* Keyboard Shortcuts Helper - Always floating */}
        <div className="h-12 w-12 rounded-full shadow-lg bg-background/95 backdrop-blur-sm border-2 border-border/50 flex items-center justify-center hover:bg-muted/50 transition-all duration-200">
          <KeyboardShortcutsHelper />
        </div>

        {/* Show Toolbar Button - Only visible when toolbar is hidden */}
        {!isToolbarVisible && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsToolbarVisible(true)}
            className="h-12 w-12 p-0 rounded-full shadow-lg bg-background/95 backdrop-blur-sm border-2 border-border/50 hover:bg-muted/50 transition-all duration-200"
            title="Show Toolbar (Ctrl+Shift+T)"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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

      <div className="mx-auto px-6 py-8">
        {/* Thumbnail Preview Section */}
        {thumbnail && (
          <div className="mb-8">
            <div className="relative group w-full">
              <div className="relative aspect-video w-full overflow-hidden rounded-lg">
                <Image
                  src={thumbnail}
                  alt="Article Thumbnail"
                  fill
                  className="object-cover transition-transform duration-200 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                {onThumbnailRemove && (
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={onThumbnailRemove}
                    className="absolute top-2 right-2 h-8 w-8 p-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-lg hover:shadow-xl"
                    title="Remove thumbnail"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Document Title Input - Notion Style */}
        <div className="mb-6">
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
        </div>

        {/* Editor Content */}
        <div className="mb-8">
          <EditorContent
            editor={editor}
            className="prose prose-strong:text-inherit dark:prose-invert max-w-none 
              [&_pre]:bg-muted/70 [&_pre]:border [&_pre]:rounded-lg [&_pre]:p-4 [&_pre]:overflow-x-auto 
              [&_pre_code]:bg-transparent [&_pre_code]:p-0 [&_pre_code]:text-sm [&_pre_code]:font-mono 
              [&_.math-inline]:bg-muted/50 [&_.math-inline]:px-2 [&_.math-inline]:py-1 [&_.math-inline]:rounded-md [&_.math-inline]:text-sm
              [&_.math-display]:bg-muted/30 [&_.math-display]:p-4 [&_.math-display]:rounded-lg [&_.math-display]:my-6 [&_.math-display]:text-center
              [&_.tiptap-mathematics-render[data-type='block-math']]:bg-muted/40 [&_.tiptap-mathematics-render[data-type='block-math']]:border [&_.tiptap-mathematics-render[data-type='block-math']]:border-border/30 [&_.tiptap-mathematics-render[data-type='block-math']]:rounded-lg [&_.tiptap-mathematics-render[data-type='block-math']]:p-4 [&_.tiptap-mathematics-render[data-type='block-math']]:my-4 [&_.tiptap-mathematics-render[data-type='block-math']]:min-h-[3rem] [&_.tiptap-mathematics-render[data-type='block-math']]:flex [&_.tiptap-mathematics-render[data-type='block-math']]:items-center [&_.tiptap-mathematics-render[data-type='block-math']]:justify-center [&_.tiptap-mathematics-render[data-type='block-math']]:cursor-pointer [&_.tiptap-mathematics-render[data-type='block-math']]:transition-colors [&_.tiptap-mathematics-render[data-type='block-math']]:hover:bg-muted/60
              [&_.tiptap-mathematics-render[data-type='inline-math']]:bg-muted/30 [&_.tiptap-mathematics-render[data-type='inline-math']]:px-2 [&_.tiptap-mathematics-render[data-type='inline-math']]:py-1 [&_.tiptap-mathematics-render[data-type='inline-math']]:rounded-md [&_.tiptap-mathematics-render[data-type='inline-math']]:text-sm [&_.tiptap-mathematics-render[data-type='inline-math']]:cursor-pointer [&_.tiptap-mathematics-render[data-type='inline-math']]:transition-colors [&_.tiptap-mathematics-render[data-type='inline-math']]:hover:bg-muted/50
              [&_blockquote]:border-l-4 [&_blockquote]:border-primary/30 [&_blockquote]:bg-muted/30 [&_blockquote]:pl-4 [&_blockquote]:py-2 [&_blockquote]:rounded-r-md
              [&_img]:rounded-lg [&_img]:shadow-sm"
          />
        </div>

        {/* Bottom spacer for easier editing */}
        <div 
          className="h-60 w-full cursor-pointer flex items-center justify-center text-muted-foreground/50 transition-all duration-200"
          onClick={() => {
            if (editor) {
              // Move cursor to the end and add a new paragraph
              editor.chain().focus().setTextSelection(editor.state.doc.content.size).insertContent('<p></p>').run();
            }
          }}
        />
      </div>
    </div>
  );
};

export default Tiptap;
