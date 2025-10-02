"use client";

import { useState, useEffect } from "react";
import { useEditorState, type Editor } from "@tiptap/react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
  Subscript as SubscriptIcon,
  Superscript as SuperscriptIcon,
  Quote,
  List,
  ListOrdered,
  Undo,
  Redo,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Minus,
  Heading1,
  Heading2,
  Heading3,
  Heading4,
  Heading5,
  Heading6,
  ChevronDown,
  Palette,
  Link as LinkIcon,
  FileCode,
  Search,
  Sigma,
  Image as ImageIcon,
} from "lucide-react";
import { MenuBarProps } from '../types';
import FontSelection from './FontSelection';
import CodeBlockControls, { CodeBlockToggle } from './CodeBlockControls';

const MenuBar = ({ 
  editor, 
  onHideToolbar, 
  mathEditDialog, 
  onMathEdit, 
  onCloseMathEditDialog 
}: MenuBarProps) => {
  const [linkUrl, setLinkUrl] = useState('');
  const [isLinkDialogOpen, setIsLinkDialogOpen] = useState(false);
  const [customFontSize, setCustomFontSize] = useState('');
  const [languageSearch, setLanguageSearch] = useState('');
  const [mathExpression, setMathExpression] = useState('');
  const [isMathDialogOpen, setIsMathDialogOpen] = useState(false);
  const [mathType, setMathType] = useState<'inline' | 'block'>('inline');
  const [mathEditMode, setMathEditMode] = useState(false);
  const [isImageDialogOpen, setIsImageDialogOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  // const [imageFile, setImageFile] = useState<File | null>(null); // File upload disabled
  
  // Effect to handle external math edit dialog
  useEffect(() => {
    if (mathEditDialog?.isOpen) {
      setMathType(mathEditDialog.type);
      setMathExpression(mathEditDialog.currentLatex);
      setMathEditMode(true);
      setIsMathDialogOpen(true);
    }
  }, [mathEditDialog]);
  
  // Read the current editor's state, and re-render the component when it changes
  const editorState = useEditorState({
    editor,
    selector: (ctx) => {
      if (!ctx.editor) {
        return {
          isBold: false,
          canBold: false,
          isItalic: false,
          canItalic: false,
          isUnderline: false,
          canUnderline: false,
          isStrike: false,
          canStrike: false,
          isCode: false,
          canCode: false,
          isHighlight: false,
          canHighlight: false,
          isSubscript: false,
          canSubscript: false,
          isSuperscript: false,
          canSuperscript: false,
          isParagraph: false,
          isHeading1: false,
          isHeading2: false,
          isHeading3: false,
          isHeading4: false,
          isHeading5: false,
          isHeading6: false,
          isBulletList: false,
          isOrderedList: false,
          isTaskList: false,
          isBlockquote: false,
          isAlignLeft: false,
          isAlignCenter: false,
          isAlignRight: false,
          isAlignJustify: false,
          canUndo: false,
          canRedo: false,
          isInter: false,
          isComicSans: false,
          isSerif: false,
          isMonospace: false,
          isCursive: false,
          isSystemUI: false,
          isArial: false,
          isHelvetica: false,
          isTimesNewRoman: false,
          isGeorgia: false,
          isVerdana: false,
          isTahoma: false,
          isCourierNew: false,
          isTrebuchet: false,
          isImpact: false,
          isPalatino: false,
          isRoboto: false,
          isOpenSans: false,
          isLato: false,
          isMontserrat: false,
          isPoppins: false,
          isLink: false,
          canLink: false,
          currentLineHeight: '1.6',
        };
      }
      return {
        isBold: ctx.editor.isActive("bold") ?? false,
        canBold: ctx.editor.can().chain().toggleBold().run() ?? false,
        isItalic: ctx.editor.isActive("italic") ?? false,
        canItalic: ctx.editor.can().chain().toggleItalic().run() ?? false,
        isUnderline: ctx.editor.isActive("underline") ?? false,
        canUnderline: ctx.editor.can().chain().toggleUnderline().run() ?? false,
        isStrike: ctx.editor.isActive("strike") ?? false,
        canStrike: ctx.editor.can().chain().toggleStrike().run() ?? false,
        isCode: ctx.editor.isActive("code") ?? false,
        canCode: ctx.editor.can().chain().toggleCode().run() ?? false,
        isHighlight: ctx.editor.isActive("highlight") ?? false,
        canHighlight: ctx.editor.can().chain().toggleHighlight().run() ?? false,
        isSubscript: ctx.editor.isActive("subscript") ?? false,
        canSubscript: ctx.editor.can().chain().toggleSubscript().run() ?? false,
        isSuperscript: ctx.editor.isActive("superscript") ?? false,
        canSuperscript:
          ctx.editor.can().chain().toggleSuperscript().run() ?? false,
        isParagraph: ctx.editor.isActive("paragraph") ?? false,
        isHeading1: ctx.editor.isActive("heading", { level: 1 }) ?? false,
        isHeading2: ctx.editor.isActive("heading", { level: 2 }) ?? false,
        isHeading3: ctx.editor.isActive("heading", { level: 3 }) ?? false,
        isHeading4: ctx.editor.isActive("heading", { level: 4 }) ?? false,
        isHeading5: ctx.editor.isActive("heading", { level: 5 }) ?? false,
        isHeading6: ctx.editor.isActive("heading", { level: 6 }) ?? false,
        isBulletList: ctx.editor.isActive("bulletList") ?? false,
        isOrderedList: ctx.editor.isActive("orderedList") ?? false,
        isTaskList: ctx.editor.isActive("taskList") ?? false,
        isBlockquote: ctx.editor.isActive("blockquote") ?? false,
        isAlignLeft: ctx.editor.isActive({ textAlign: "left" }) ?? false,
        isAlignCenter: ctx.editor.isActive({ textAlign: "center" }) ?? false,
        isAlignRight: ctx.editor.isActive({ textAlign: "right" }) ?? false,
        isAlignJustify: ctx.editor.isActive({ textAlign: "justify" }) ?? false,
        canUndo: ctx.editor.can().chain().undo().run() ?? false,
        canRedo: ctx.editor.can().chain().redo().run() ?? false,
        // Font family states
        isInter:
          ctx.editor.isActive("textStyle", { fontFamily: "Inter" }) ?? false,
        isComicSans:
          ctx.editor.isActive("textStyle", {
            fontFamily: '"Comic Sans MS", "Comic Sans"',
          }) ?? false,
        isSerif:
          ctx.editor.isActive("textStyle", { fontFamily: "serif" }) ?? false,
        isMonospace:
          ctx.editor.isActive("textStyle", { fontFamily: "monospace" }) ??
          false,
        isCursive:
          ctx.editor.isActive("textStyle", { fontFamily: "cursive" }) ?? false,
        isSystemUI:
          ctx.editor.isActive("textStyle", { fontFamily: "system-ui" }) ??
          false,
        isArial:
          ctx.editor.isActive("textStyle", { fontFamily: "Arial" }) ?? false,
        isHelvetica:
          ctx.editor.isActive("textStyle", { fontFamily: "Helvetica" }) ??
          false,
        isTimesNewRoman:
          ctx.editor.isActive("textStyle", {
            fontFamily: '"Times New Roman"',
          }) ?? false,
        isGeorgia:
          ctx.editor.isActive("textStyle", { fontFamily: "Georgia" }) ?? false,
        isVerdana:
          ctx.editor.isActive("textStyle", { fontFamily: "Verdana" }) ?? false,
        isTahoma:
          ctx.editor.isActive("textStyle", { fontFamily: "Tahoma" }) ?? false,
        isCourierNew:
          ctx.editor.isActive("textStyle", { fontFamily: '"Courier New"' }) ??
          false,
        isTrebuchet:
          ctx.editor.isActive("textStyle", { fontFamily: '"Trebuchet MS"' }) ??
          false,
        isImpact:
          ctx.editor.isActive("textStyle", { fontFamily: "Impact" }) ?? false,
        isPalatino:
          ctx.editor.isActive("textStyle", { fontFamily: "Palatino" }) ?? false,
        isRoboto:
          ctx.editor.isActive("textStyle", { fontFamily: "Roboto" }) ?? false,
        isOpenSans:
          ctx.editor.isActive("textStyle", { fontFamily: '"Open Sans"' }) ??
          false,
        isLato:
          ctx.editor.isActive("textStyle", { fontFamily: "Lato" }) ?? false,
        isMontserrat:
          ctx.editor.isActive("textStyle", { fontFamily: "Montserrat" }) ??
          false,
        isPoppins:
          ctx.editor.isActive("textStyle", { fontFamily: "Poppins" }) ?? false,
        isLink: ctx.editor.isActive("link") ?? false,
        canLink: !ctx.editor.state.selection.empty && 
                 !ctx.editor.isActive("inline-math") && 
                 !ctx.editor.isActive("block-math"),
        // Font size states
        currentFontSize: (() => {
          const attributes = ctx.editor.getAttributes('textStyle');
          return attributes.fontSize || '16px';
        })(),
        // Code block states
        isCodeBlock: ctx.editor.isActive("codeBlock") ?? false,
        currentCodeLanguage: (() => {
          const attributes = ctx.editor.getAttributes('codeBlock');
          return attributes.language || 'javascript';
        })(),
        // Math states
        isInlineMath: ctx.editor.isActive("inline-math") ?? false,
        isBlockMath: ctx.editor.isActive("block-math") ?? false,
      };
    },
  });

  if (!editor) {
    return null;
  }

  // Default values when editorState is null
  const safeEditorState = editorState || {
    isBold: false,
    canBold: false,
    isItalic: false,
    canItalic: false,
    isUnderline: false,
    canUnderline: false,
    isStrike: false,
    canStrike: false,
    isCode: false,
    canCode: false,
    isHighlight: false,
    canHighlight: false,
    isSubscript: false,
    canSubscript: false,
    isSuperscript: false,
    canSuperscript: false,
    isParagraph: false,
    isHeading1: false,
    isHeading2: false,
    isHeading3: false,
    isHeading4: false,
    isHeading5: false,
    isHeading6: false,
    isBulletList: false,
    isOrderedList: false,
    isTaskList: false,
    isBlockquote: false,
    isAlignLeft: false,
    isAlignCenter: false,
    isAlignRight: false,
    isAlignJustify: false,
    canUndo: false,
    canRedo: false,
    isInter: false,
    isComicSans: false,
    isSerif: false,
    isMonospace: false,
    isCursive: false,
    isSystemUI: false,
    isArial: false,
    isHelvetica: false,
    isTimesNewRoman: false,
    isGeorgia: false,
    isVerdana: false,
    isTahoma: false,
    isCourierNew: false,
    isTrebuchet: false,
    isImpact: false,
    isPalatino: false,
    isRoboto: false,
    isOpenSans: false,
    isLato: false,
    isMontserrat: false,
    isPoppins: false,
    isLink: false,
    canLink: false,
    currentFontSize: '16px',
    isCodeBlock: false,
    currentCodeLanguage: 'javascript',
    isInlineMath: false,
    isBlockMath: false,
  };

  const toggleHeading = (level: 1 | 2 | 3 | 4 | 5 | 6) => {
    editor.chain().focus().toggleHeading({ level }).run();
  };

  const setTextAlign = (alignment: "left" | "center" | "right" | "justify") => {
    editor.chain().focus().setTextAlign(alignment).run();
  };

  const getCurrentAlignment = () => {
    if (!safeEditorState) return "left";
    if (safeEditorState.isAlignCenter) return "center";
    if (safeEditorState.isAlignRight) return "right";
    if (safeEditorState.isAlignJustify) return "justify";
    return "left"; // default
  };

  const getAlignmentIcon = () => {
    const alignment = getCurrentAlignment();
    switch (alignment) {
      case "center":
        return <AlignCenter className="h-4 w-4" />;
      case "right":
        return <AlignRight className="h-4 w-4" />;
      case "justify":
        return <AlignJustify className="h-4 w-4" />;
      default:
        return <AlignLeft className="h-4 w-4" />;
    }
  };

  const setTextColor = (color: string) => {
    // Use mark method to ensure color is applied properly with other formatting
    editor.chain().focus().setColor(color).run();
  };

  const unsetTextColor = () => {
    editor.chain().focus().unsetColor().run();
  };

  const getCurrentTextColor = () => {
    // Get the current attributes from textStyle
    const attributes = editor.getAttributes('textStyle');
    return attributes.color || '#000000';
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

  const unsetLink = () => {
    editor.chain().focus().unsetLink().run();
  };

  // Math functions
  const insertInlineMath = () => {
    const hasSelection = !editor.state.selection.empty;
    
    if (hasSelection) {
      return editor.chain().insertInlineMath({ latex: '' }).focus().run();
    }
    
    setMathType('inline');
    setMathExpression('');
    setIsMathDialogOpen(true);
  };

  const insertDisplayMath = () => {
    const hasSelection = !editor.state.selection.empty;
    
    if (hasSelection) {
      return editor.chain().insertBlockMath({ latex: '' }).focus().run();
    }
    
    setMathType('block');
    setMathExpression('');
    setIsMathDialogOpen(true);
  };

  const handleMathSubmit = () => {
    if (!mathExpression.trim()) return;
    
    if (mathEditMode && onMathEdit) {
      // Edit existing math
      onMathEdit(mathExpression);
    } else {
      // Insert new math
      if (mathType === 'inline') {
        editor.chain().insertInlineMath({ latex: mathExpression }).focus().run();
      } else {
        editor.chain().insertBlockMath({ latex: mathExpression }).focus().run();
      }
    }
    
    setIsMathDialogOpen(false);
    setMathExpression('');
    setMathEditMode(false);
  };

  const removeInlineMath = () => {
    editor.chain().deleteInlineMath().focus().run();
  };

  const removeBlockMath = () => {
    editor.chain().deleteBlockMath().focus().run();
  };

  // Handle image insertion
  const handleImageInsert = async () => {
    if (!editor) return;
    
  // if (imageFile) {
  //   // For demo: convert file to base64 (in real app, upload to server and use the URL)
  //   const reader = new FileReader();
  //   reader.onload = () => {
  //     if (reader.result) {
  //       editor.chain().focus().setImage({ src: reader.result as string }).run();
  //       setIsImageDialogOpen(false);
  //       setImageFile(null);
  //       setImageUrl('');
  //     }
  //   };
  //   reader.readAsDataURL(imageFile);
  // } else 
  if (imageUrl) {
      editor.chain().focus().setImage({ src: imageUrl }).run();
      setIsImageDialogOpen(false);
      setImageUrl('');
  // setImageFile(null);
    }
  };

  return (
    <div className="border-b bg-background/95 backdrop-blur-sm sticky top-0 z-10 shadow-sm">
      <div className="mx-auto px-6 py-2 relative">
        {/* Hide Toolbar Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={onHideToolbar}
          className="h-7 w-7 p-0 absolute top-2 right-2 opacity-50 hover:opacity-100 transition-opacity"
          title="Hide Toolbar (Ctrl+Shift+T)"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
          </svg>
        </Button>
        
        <div className="flex items-center gap-1 flex-wrap pr-10">
        {/* Undo/Redo */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!safeEditorState.canUndo}
          className="h-8 w-8 p-0 hover:bg-muted/80"
        >
          <Undo className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!safeEditorState.canRedo}
          className="h-8 w-8 p-0 hover:bg-muted/80"
        >
          <Redo className="h-4 w-4" />
        </Button>

        <Separator orientation="vertical" className="h-6 mx-1.5" />

        {/* Font Selection Component */}
        <FontSelection 
          editor={editor}
          safeEditorState={safeEditorState}
          customFontSize={customFontSize}
          setCustomFontSize={setCustomFontSize}
        />

        <Separator orientation="vertical" className="h-6 mx-1.5" />

        {/* Headings Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 px-2 w-[90px] overflow-hidden text-ellipsis whitespace-nowrap justify-start"
            >
              {safeEditorState.isHeading1 && <Heading1 className="h-4 w-4" />}
              {safeEditorState.isHeading2 && <Heading2 className="h-4 w-4" />}
              {safeEditorState.isHeading3 && <Heading3 className="h-4 w-4" />}
              {safeEditorState.isHeading4 && <Heading4 className="h-4 w-4" />}
              {safeEditorState.isHeading5 && <Heading5 className="h-4 w-4" />}
              {safeEditorState.isHeading6 && <Heading6 className="h-4 w-4" />}
              {safeEditorState.isParagraph && (
                <span className="text-sm">Paragraph</span>
              )}
              {safeEditorState.isCodeBlock && (
                <>
                  <FileCode className="h-4 w-4" />
                  <span className="text-sm ml-1">Code Block</span>
                </>
              )}
              <ChevronDown className="h-3 w-3 ml-auto" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56 max-h-80 overflow-y-auto">
            <DropdownMenuItem
              onClick={() => editor.chain().focus().setParagraph().run()}
            >
              <span>Paragraph</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => toggleHeading(1)}>
              <Heading1 className="h-4 w-4 mr-2" />
              Heading 1
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => toggleHeading(2)}>
              <Heading2 className="h-4 w-4 mr-2" />
              Heading 2
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => toggleHeading(3)}>
              <Heading3 className="h-4 w-4 mr-2" />
              Heading 3
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => toggleHeading(4)}>
              <Heading4 className="h-4 w-4 mr-2" />
              Heading 4
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => toggleHeading(5)}>
              <Heading5 className="h-4 w-4 mr-2" />
              Heading 5
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => toggleHeading(6)}>
              <Heading6 className="h-4 w-4 mr-2" />
              Heading 6
            </DropdownMenuItem>
            
            <DropdownMenuSeparator />
            
            <CodeBlockToggle editor={editor} />
          </DropdownMenuContent>
        </DropdownMenu>

        <Separator orientation="vertical" className="h-6 mx-1.5" />

        {/* Text Formatting */}
        <Button
          variant={safeEditorState.isBold ? "default" : "ghost"}
          size="sm"
          onClick={() => editor.chain().focus().toggleBold().run()}
          disabled={!safeEditorState.canBold}
          className="h-8 w-8 p-0"
        >
          <BoldIcon className="h-4 w-4" />
        </Button>
        <Button
          variant={safeEditorState.isItalic ? "default" : "ghost"}
          size="sm"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          disabled={!safeEditorState.canItalic}
          className="h-8 w-8 p-0"
        >
          <ItalicIcon className="h-4 w-4" />
        </Button>
        <Button
          variant={safeEditorState.isUnderline ? "default" : "ghost"}
          size="sm"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          disabled={!safeEditorState.canUnderline}
          className="h-8 w-8 p-0"
        >
          <UnderlineIcon className="h-4 w-4" />
        </Button>
        <Button
          variant={safeEditorState.isStrike ? "default" : "ghost"}
          size="sm"
          onClick={() => editor.chain().focus().toggleStrike().run()}
          disabled={!safeEditorState.canStrike}
          className="h-8 w-8 p-0"
        >
          <Strikethrough className="h-4 w-4" />
        </Button>
        <Button
          variant={safeEditorState.isCode ? "default" : "ghost"}
          size="sm"
          onClick={() => editor.chain().focus().toggleCode().run()}
          disabled={!safeEditorState.canCode}
          className="h-8 w-8 p-0"
          title="Inline Code"
        >
          <Code2 className="h-4 w-4" />
        </Button>
        
        {/* Code Block Controls Component */}
        <CodeBlockControls 
          editor={editor}
          safeEditorState={safeEditorState}
          languageSearch={languageSearch}
          setLanguageSearch={setLanguageSearch}
        />
        
        <Button
          variant={safeEditorState.isHighlight ? "default" : "ghost"}
          size="sm"
          onClick={() => editor.chain().focus().toggleHighlight().run()}
          disabled={!safeEditorState.canHighlight}
          className="h-8 w-8 p-0"
        >
          <Highlighter className="h-4 w-4" />
        </Button>

        {/* Text Color Picker */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 relative">
              <Palette className="h-4 w-4" />
              <div 
                className="absolute bottom-0 right-0 w-2 h-2 rounded-full border border-background"
                style={{ backgroundColor: getCurrentTextColor() }}
              />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-64">
            <div className="p-2">
              <div className="text-sm font-medium mb-2">Text Color</div>
              
              {/* Color Swatches */}
              <div className="grid grid-cols-8 gap-1 mb-3">
                {[
                  '#000000', '#333333', '#666666', '#999999', '#CCCCCC', '#FFFFFF', '#FF0000', '#FF8000',
                  '#FFFF00', '#80FF00', '#00FF00', '#00FF80', '#00FFFF', '#0080FF', '#0000FF', '#8000FF',
                  '#FF00FF', '#FF0080', '#8B4513', '#A0522D', '#D2691E', '#CD853F', '#F4A460', '#DEB887',
                  '#800080', '#9932CC', '#8A2BE2', '#4B0082', '#6A5ACD', '#7B68EE', '#9370DB', '#BA55D3'
                ].map((color) => (
                  <button
                    key={color}
                    className="w-6 h-6 rounded border border-gray-300 hover:scale-110 transition-transform cursor-pointer"
                    style={{ backgroundColor: color }}
                    onClick={() => setTextColor(color)}
                    title={color}
                  />
                ))}
              </div>

              {/* Custom Color Input */}
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={getCurrentTextColor()}
                  onChange={(e) => setTextColor(e.target.value)}
                  className="w-8 h-8 rounded border border-input cursor-pointer"
                  title="Custom color"
                />
                <span className="text-xs text-muted-foreground flex-1">Custom</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={unsetTextColor}
                  className="h-6 px-2 text-xs"
                >
                  Reset
                </Button>
              </div>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Link Button */}
        <Dialog open={isLinkDialogOpen} onOpenChange={setIsLinkDialogOpen}>
          <DialogTrigger asChild>
            <Button
              variant={safeEditorState.isLink ? "default" : "ghost"}
              size="sm"
              onClick={setLink}
              className="h-8 w-8 p-0"
              title="Add/Edit Link"
              disabled={!safeEditorState.canLink}
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
        {safeEditorState.isLink && (
          <Button
            variant="ghost"
            size="sm"
            onClick={unsetLink}
            className="h-8 w-8 p-0"
            title="Remove Link"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
          </Button>
        )}

        {/* Image Insert Button */}
        <Dialog open={isImageDialogOpen} onOpenChange={setIsImageDialogOpen}>
          <DialogTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              title="Insert Image"
            >
              <ImageIcon className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Insert Image</DialogTitle>
            </DialogHeader>
            <div className="flex flex-col gap-3">
              <div>
                <label className="text-sm font-medium mb-2 block">Image URL</label>
                <Input
                  type="url"
                  placeholder="https://example.com/image.jpg"
                  value={imageUrl}
                  onChange={(e) => {
                    setImageUrl(e.target.value);
                    // setImageFile(null);
                  }}
                />
              </div>
              {/*
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">or</span>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Upload File</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setImageFile(e.target.files[0]);
                      setImageUrl('');
                    }
                  }}
                  className="block w-full text-sm text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-muted file:text-foreground hover:file:bg-muted/80"
                />
                {imageFile && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Selected: {imageFile.name}
                  </p>
                )}
              </div>
              */}
              <div className="flex justify-end gap-2 mt-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => {
                    setIsImageDialogOpen(false);
                    setImageUrl('');
                    // setImageFile(null);
                  }}
                >
                  Cancel
                </Button>
                <Button 
                  size="sm" 
                  onClick={handleImageInsert} 
                  disabled={!imageUrl /* && !imageFile */}
                >
                  Insert
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        <Separator orientation="vertical" className="h-6 mx-1.5" />

        {/* Subscript/Superscript */}
        <Button
          variant={safeEditorState.isSubscript ? "default" : "ghost"}
          size="sm"
          onClick={() => editor.chain().focus().toggleSubscript().run()}
          disabled={!safeEditorState.canSubscript}
          className="h-8 w-8 p-0"
        >
          <SubscriptIcon className="h-4 w-4" />
        </Button>
        <Button
          variant={safeEditorState.isSuperscript ? "default" : "ghost"}
          size="sm"
          onClick={() => editor.chain().focus().toggleSuperscript().run()}
          disabled={!safeEditorState.canSuperscript}
          className="h-8 w-8 p-0"
        >
          <SuperscriptIcon className="h-4 w-4" />
        </Button>

        <Separator orientation="vertical" className="h-6 mx-1.5" />

        {/* Text Alignment Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 px-2">
              {getAlignmentIcon()}
              <ChevronDown className="h-3 w-3 ml-1" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => setTextAlign("left")}>
              <AlignLeft className="h-4 w-4 mr-2" />
              Align Left
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTextAlign("center")}>
              <AlignCenter className="h-4 w-4 mr-2" />
              Align Center
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTextAlign("right")}>
              <AlignRight className="h-4 w-4 mr-2" />
              Align Right
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTextAlign("justify")}>
              <AlignJustify className="h-4 w-4 mr-2" />
              Justify
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Separator orientation="vertical" className="h-6 mx-1.5" />

        {/* Lists */}
        <Button
          variant={safeEditorState.isBulletList ? "default" : "ghost"}
          size="sm"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className="h-8 w-8 p-0"
        >
          <List className="h-4 w-4" />
        </Button>
        <Button
          variant={safeEditorState.isOrderedList ? "default" : "ghost"}
          size="sm"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className="h-8 w-8 p-0"
        >
          <ListOrdered className="h-4 w-4" />
        </Button>

        <Separator orientation="vertical" className="h-6 mx-1.5" />

        {/* Blockquote */}
        <Button
          variant={safeEditorState.isBlockquote ? "default" : "ghost"}
          size="sm"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className="h-8 w-8 p-0"
        >
          <Quote className="h-4 w-4" />
        </Button>

        {/* Math Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant={safeEditorState.isInlineMath || safeEditorState.isBlockMath ? "default" : "ghost"} 
              size="sm" 
              className="h-8 w-8 p-0" 
              title="Insert Math"
            >
              <Sigma className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={insertInlineMath}>
              <Sigma className="h-4 w-4 mr-2" />
              Inline Math
            </DropdownMenuItem>
            <DropdownMenuItem onClick={insertDisplayMath}>
              <Sigma className="h-4 w-4 mr-2" />
              Display Math
            </DropdownMenuItem>
            
            {/* Show remove options when math is active */}
            {(safeEditorState.isInlineMath || safeEditorState.isBlockMath) && (
              <>
                <DropdownMenuSeparator />
                {safeEditorState.isInlineMath && (
                  <DropdownMenuItem onClick={removeInlineMath} className="text-destructive">
                    Remove Inline Math
                  </DropdownMenuItem>
                )}
                {safeEditorState.isBlockMath && (
                  <DropdownMenuItem onClick={removeBlockMath} className="text-destructive">
                    Remove Block Math
                  </DropdownMenuItem>
                )}
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Horizontal Rule */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          className="h-8 w-8 p-0"
        >
          <Minus className="h-4 w-4" />
        </Button>

        {/* Math Dialog */}
        <Dialog 
          open={isMathDialogOpen} 
          onOpenChange={(open) => {
            setIsMathDialogOpen(open);
            if (!open) {
              setMathEditMode(false);
              setMathExpression('');
              if (mathEditMode && onCloseMathEditDialog) {
                onCloseMathEditDialog();
              }
            }
          }}
        >
          <DialogTrigger asChild>
            <div style={{ display: 'none' }} />
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>
                {mathEditMode ? 'Edit' : 'Insert'} {mathType === 'inline' ? 'Inline' : 'Block'} Math
              </DialogTitle>
            </DialogHeader>
            <div className="flex flex-col space-y-4">
              <div className="grid flex-1 gap-2">
                <Input
                  placeholder={mathType === 'inline' ? 'E = mc^2' : '\\int_a^b x^2 dx'}
                  value={mathExpression}
                  onChange={(e) => setMathExpression(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleMathSubmit();
                    }
                  }}
                  className="font-mono"
                  autoFocus
                />
                <div className="text-xs text-muted-foreground">
                  Enter LaTeX expression. Examples: x^2, \\frac&#123;a&#125;&#123;b&#125;, \\sqrt&#123;x&#125;, \\sum_&#123;i=1&#125;^n
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsMathDialogOpen(false);
                    setMathEditMode(false);
                    setMathExpression('');
                    if (mathEditMode && onCloseMathEditDialog) {
                      onCloseMathEditDialog();
                    }
                  }}
                  size="sm"
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleMathSubmit} 
                  size="sm" 
                  disabled={!mathExpression.trim()}
                >
                  {mathEditMode ? 'Update' : 'Insert'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        <Separator orientation="vertical" className="h-6 mx-1.5" />

        {/* Keyboard Shortcuts Helper - Removed from here, now floating */}
        </div>
      </div>
    </div>
  );
};

export default MenuBar;
