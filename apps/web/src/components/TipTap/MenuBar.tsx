"use client";

import { useState } from "react";
import { useEditorState, type Editor } from "@tiptap/react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
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
} from "lucide-react";
import { MenuBarProps } from './types';

const MenuBar = ({ editor, onHideToolbar }: MenuBarProps) => {
  const [linkUrl, setLinkUrl] = useState('');
  const [isLinkDialogOpen, setIsLinkDialogOpen] = useState(false);
  const [customFontSize, setCustomFontSize] = useState('');
  const [languageSearch, setLanguageSearch] = useState('');
  
  // Language options for code blocks
  const codeLanguages = [
    { value: 'javascript', label: 'JavaScript' },
    { value: 'typescript', label: 'TypeScript' },
    { value: 'python', label: 'Python' },
    { value: 'java', label: 'Java' },
    { value: 'cpp', label: 'C++' },
    { value: 'csharp', label: 'C#' },
    { value: 'php', label: 'PHP' },
    { value: 'ruby', label: 'Ruby' },
    { value: 'go', label: 'Go' },
    { value: 'rust', label: 'Rust' },
    { value: 'html', label: 'HTML' },
    { value: 'css', label: 'CSS' },
    { value: 'json', label: 'JSON' },
    { value: 'yaml', label: 'YAML' },
    { value: 'xml', label: 'XML' },
    { value: 'bash', label: 'Bash' },
    { value: 'sql', label: 'SQL' },
    { value: 'markdown', label: 'Markdown' },
    { value: 'plaintext', label: 'Plain Text' },
  ];
  
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
        canLink: !ctx.editor.state.selection.empty,
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
  };

  const toggleHeading = (level: 1 | 2 | 3 | 4 | 5 | 6) => {
    editor.chain().focus().toggleHeading({ level }).run();
  };

  const setTextAlign = (alignment: "left" | "center" | "right" | "justify") => {
    editor.chain().focus().setTextAlign(alignment).run();
  };

  const setFontFamily = (fontFamily: string) => {
    editor.chain().focus().setFontFamily(fontFamily).run();
  };

  const unsetFontFamily = () => {
    editor.chain().focus().unsetFontFamily().run();
  };

  const getCurrentFontFamily = () => {
    if (!safeEditorState) return "Default";
    if (safeEditorState.isInter) return "Inter";
    if (safeEditorState.isComicSans) return "Comic Sans MS";
    if (safeEditorState.isSerif) return "Serif";
    if (safeEditorState.isMonospace) return "Monospace";
    if (safeEditorState.isCursive) return "Cursive";
    if (safeEditorState.isSystemUI) return "System UI";
    if (safeEditorState.isArial) return "Arial";
    if (safeEditorState.isHelvetica) return "Helvetica";
    if (safeEditorState.isTimesNewRoman) return "Times New Roman";
    if (safeEditorState.isGeorgia) return "Georgia";
    if (safeEditorState.isVerdana) return "Verdana";
    if (safeEditorState.isTahoma) return "Tahoma";
    if (safeEditorState.isCourierNew) return "Courier New";
    if (safeEditorState.isTrebuchet) return "Trebuchet MS";
    if (safeEditorState.isImpact) return "Impact";
    if (safeEditorState.isPalatino) return "Palatino";
    if (safeEditorState.isRoboto) return "Roboto";
    if (safeEditorState.isOpenSans) return "Open Sans";
    if (safeEditorState.isLato) return "Lato";
    if (safeEditorState.isMontserrat) return "Montserrat";
    if (safeEditorState.isPoppins) return "Poppins";
    return "Default";
  };

  const setFontSize = (fontSize: string) => {
    editor.chain().focus().setFontSize(fontSize).run();
  };

  const unsetFontSize = () => {
    editor.chain().focus().unsetFontSize().run();
  };

  const getCurrentFontSize = () => {
    return safeEditorState.currentFontSize || '16px';
  };

  const getFontSizeDisplay = (fontSize: string) => {
    // Convert px to readable format
    const size = parseInt(fontSize.replace('px', ''));
    if (size <= 12) return 'Small';
    if (size <= 14) return 'Normal';
    if (size <= 18) return 'Large';
    if (size <= 24) return 'X-Large';
    if (size <= 32) return 'XX-Large';
    return fontSize;
  };

  const handleCustomFontSize = () => {
    if (customFontSize.trim() === '') return;
    
    // Parse the input to get numeric value
    const numericValue = parseInt(customFontSize);
    
    // Validate the input (reasonable font size range)
    if (isNaN(numericValue) || numericValue < 8 || numericValue > 72) {
      alert('Please enter a valid font size between 8px and 72px');
      return;
    }
    
    // Apply the font size
    setFontSize(`${numericValue}px`);
    setCustomFontSize(''); // Clear the input after applying
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

  // Code block language functions
  const setCodeBlockLanguage = (language: string) => {
    editor.chain().focus().updateAttributes('codeBlock', { language }).run();
  };

  const getCurrentCodeLanguage = () => {
    return safeEditorState.currentCodeLanguage || 'javascript';
  };

  const getCurrentCodeLanguageLabel = () => {
    const current = codeLanguages.find(lang => lang.value === getCurrentCodeLanguage());
    return current ? current.label : 'JavaScript';
  };

  // Filter languages based on search
  const getFilteredLanguages = () => {
    if (!languageSearch.trim()) return codeLanguages;
    return codeLanguages.filter(lang => 
      lang.label.toLowerCase().includes(languageSearch.toLowerCase()) ||
      lang.value.toLowerCase().includes(languageSearch.toLowerCase())
    );
  };

  return (
    <div className="border border-input bg-background rounded-md p-2 mb-4 relative overflow-hidden">
      {/* Hide Toolbar Button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={onHideToolbar}
        className="h-6 w-6 p-0 absolute top-1 right-1 opacity-60 hover:opacity-100 z-10"
        title="Hide Toolbar (Ctrl+Shift+T)"
      >
        <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
        </svg>
      </Button>
      
      <div className="flex items-center gap-0.5 flex-wrap pr-8 overflow-hidden max-w-full min-h-[2rem]">
        {/* Undo/Redo */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!safeEditorState.canUndo}
          className="h-8 w-8 p-0"
        >
          <Undo className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!safeEditorState.canRedo}
          className="h-8 w-8 p-0"
        >
          <Redo className="h-4 w-4" />
        </Button>

        <Separator orientation="vertical" className="h-6 mx-0.5" />

        {/* Font Family Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="px-2 py-1 h-8 text-sm w-[90px] overflow-hidden text-ellipsis whitespace-nowrap"
            >
              {getCurrentFontFamily()}
              <ChevronDown className="ml-1 h-3 w-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="start"
            className="w-56 max-h-80 overflow-y-auto"
          >
            <DropdownMenuItem
              onClick={() => unsetFontFamily()}
              className={
                getCurrentFontFamily() === "Default" ? "bg-accent" : ""
              }
            >
              <span className="font-normal">Default</span>
            </DropdownMenuItem>

            {/* Popular Web Fonts */}
            <div className="px-2 py-1 text-xs font-medium text-muted-foreground border-t mt-1">
              Popular Web Fonts
            </div>
            <DropdownMenuItem
              onClick={() => setFontFamily("Inter")}
              className={safeEditorState.isInter ? "bg-accent" : ""}
            >
              <span style={{ fontFamily: "Inter" }}>Inter</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => setFontFamily("Roboto")}
              className={safeEditorState.isRoboto ? "bg-accent" : ""}
            >
              <span style={{ fontFamily: "Roboto, sans-serif" }}>Roboto</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => setFontFamily("Open Sans")}
              className={safeEditorState.isOpenSans ? "bg-accent" : ""}
            >
              <span style={{ fontFamily: '"Open Sans", sans-serif' }}>
                Open Sans
              </span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => setFontFamily("Lato")}
              className={safeEditorState.isLato ? "bg-accent" : ""}
            >
              <span style={{ fontFamily: "Lato, sans-serif" }}>Lato</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => setFontFamily("Montserrat")}
              className={safeEditorState.isMontserrat ? "bg-accent" : ""}
            >
              <span style={{ fontFamily: "Montserrat, sans-serif" }}>
                Montserrat
              </span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => setFontFamily("Poppins")}
              className={safeEditorState.isPoppins ? "bg-accent" : ""}
            >
              <span style={{ fontFamily: "Poppins, sans-serif" }}>Poppins</span>
            </DropdownMenuItem>

            {/* System Fonts */}
            <div className="px-2 py-1 text-xs font-medium text-muted-foreground border-t mt-1">
              System Fonts
            </div>
            <DropdownMenuItem
              onClick={() => setFontFamily("Arial")}
              className={safeEditorState.isArial ? "bg-accent" : ""}
            >
              <span style={{ fontFamily: "Arial, sans-serif" }}>Arial</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => setFontFamily("Helvetica")}
              className={safeEditorState.isHelvetica ? "bg-accent" : ""}
            >
              <span style={{ fontFamily: "Helvetica, sans-serif" }}>
                Helvetica
              </span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => setFontFamily("Verdana")}
              className={safeEditorState.isVerdana ? "bg-accent" : ""}
            >
              <span style={{ fontFamily: "Verdana, sans-serif" }}>Verdana</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => setFontFamily("Tahoma")}
              className={safeEditorState.isTahoma ? "bg-accent" : ""}
            >
              <span style={{ fontFamily: "Tahoma, sans-serif" }}>Tahoma</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => setFontFamily("Trebuchet MS")}
              className={safeEditorState.isTrebuchet ? "bg-accent" : ""}
            >
              <span style={{ fontFamily: '"Trebuchet MS", sans-serif' }}>
                Trebuchet MS
              </span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => setFontFamily("system-ui")}
              className={safeEditorState.isSystemUI ? "bg-accent" : ""}
            >
              <span style={{ fontFamily: "system-ui" }}>System UI</span>
            </DropdownMenuItem>

            {/* Serif Fonts */}
            <div className="px-2 py-1 text-xs font-medium text-muted-foreground border-t mt-1">
              Serif Fonts
            </div>
            <DropdownMenuItem
              onClick={() => setFontFamily("Times New Roman")}
              className={safeEditorState.isTimesNewRoman ? "bg-accent" : ""}
            >
              <span style={{ fontFamily: '"Times New Roman", serif' }}>
                Times New Roman
              </span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => setFontFamily("Georgia")}
              className={safeEditorState.isGeorgia ? "bg-accent" : ""}
            >
              <span style={{ fontFamily: "Georgia, serif" }}>Georgia</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => setFontFamily("Palatino")}
              className={safeEditorState.isPalatino ? "bg-accent" : ""}
            >
              <span style={{ fontFamily: "Palatino, serif" }}>Palatino</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => setFontFamily("serif")}
              className={safeEditorState.isSerif ? "bg-accent" : ""}
            >
              <span style={{ fontFamily: "serif" }}>Serif</span>
            </DropdownMenuItem>

            {/* Monospace & Display Fonts */}
            <div className="px-2 py-1 text-xs font-medium text-muted-foreground border-t mt-1">
              Monospace & Display
            </div>
            <DropdownMenuItem
              onClick={() => setFontFamily("Courier New")}
              className={safeEditorState.isCourierNew ? "bg-accent" : ""}
            >
              <span style={{ fontFamily: '"Courier New", monospace' }}>
                Courier New
              </span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => setFontFamily("monospace")}
              className={safeEditorState.isMonospace ? "bg-accent" : ""}
            >
              <span style={{ fontFamily: "monospace" }}>Monospace</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => setFontFamily("Impact")}
              className={safeEditorState.isImpact ? "bg-accent" : ""}
            >
              <span style={{ fontFamily: "Impact, sans-serif" }}>Impact</span>
            </DropdownMenuItem>

            {/* Fun Fonts */}
            <div className="px-2 py-1 text-xs font-medium text-muted-foreground border-t mt-1">
              Fun Fonts
            </div>
            <DropdownMenuItem
              onClick={() => setFontFamily("Comic Sans MS, cursive")}
              className={safeEditorState.isComicSans ? "bg-accent" : ""}
            >
              <span style={{ fontFamily: "Comic Sans MS, cursive" }}>
                Comic Sans
              </span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => setFontFamily("cursive")}
              className={safeEditorState.isCursive ? "bg-accent" : ""}
            >
              <span style={{ fontFamily: "cursive" }}>Cursive</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Font Size Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="px-2 py-1 h-8 text-sm w-[70px] overflow-hidden text-ellipsis whitespace-nowrap"
              title="Font Size"
            >
              {getCurrentFontSize().replace('px', '')}
              <ChevronDown className="ml-1 h-3 w-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-48">
            <DropdownMenuItem
              onClick={() => unsetFontSize()}
              className={getCurrentFontSize() === '16px' ? "bg-accent" : ""}
            >
              <span className="mr-2">Default</span>
              <span className="text-muted-foreground">16px</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => setFontSize('12px')}
              className={getCurrentFontSize() === '12px' ? "bg-accent" : ""}
            >
              <span className="mr-2">Small</span>
              <span className="text-muted-foreground">12px</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => setFontSize('14px')}
              className={getCurrentFontSize() === '14px' ? "bg-accent" : ""}
            >
              <span className="mr-2">Normal</span>
              <span className="text-muted-foreground">14px</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => setFontSize('16px')}
              className={getCurrentFontSize() === '16px' ? "bg-accent" : ""}
            >
              <span className="mr-2">Medium</span>
              <span className="text-muted-foreground">16px</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => setFontSize('18px')}
              className={getCurrentFontSize() === '18px' ? "bg-accent" : ""}
            >
              <span className="mr-2">Large</span>
              <span className="text-muted-foreground">18px</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => setFontSize('20px')}
              className={getCurrentFontSize() === '20px' ? "bg-accent" : ""}
            >
              <span className="mr-2">X-Large</span>
              <span className="text-muted-foreground">20px</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => setFontSize('24px')}
              className={getCurrentFontSize() === '24px' ? "bg-accent" : ""}
            >
              <span className="mr-2">XX-Large</span>
              <span className="text-muted-foreground">24px</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => setFontSize('32px')}
              className={getCurrentFontSize() === '32px' ? "bg-accent" : ""}
            >
              <span className="mr-2">Huge</span>
              <span className="text-muted-foreground">32px</span>
            </DropdownMenuItem>
            
            <Separator className="my-1" />
            
            {/* Custom Font Size Input */}
            <div className="px-2 py-2">
              <div className="text-xs font-medium text-muted-foreground mb-2">Custom Size</div>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  placeholder="16"
                  min="8"
                  max="72"
                  value={customFontSize}
                  onChange={(e) => setCustomFontSize(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleCustomFontSize();
                    }
                  }}
                  className="h-7 text-xs w-16"
                />
                <span className="text-xs text-muted-foreground">px</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCustomFontSize}
                  className="h-7 px-2 text-xs"
                  disabled={!customFontSize.trim()}
                >
                  Apply
                </Button>
              </div>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        <Separator orientation="vertical" className="h-6 mx-0.5" />

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
              <ChevronDown className="h-3 w-3 ml-auto" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
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
          </DropdownMenuContent>
        </DropdownMenu>

        <Separator orientation="vertical" className="h-6 mx-0.5" />

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
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          className="h-8 w-8 p-0"
          title="Code Block"
        >
          <FileCode className="h-4 w-4" />
        </Button>
        
        {/* Code Block Language Selector - Only visible when in a code block */}
        {safeEditorState.isCodeBlock && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="px-2 py-1 h-8 text-xs overflow-hidden text-ellipsis whitespace-nowrap"
                title={`Code Language: ${getCurrentCodeLanguageLabel()}`}
              >
                {getCurrentCodeLanguageLabel()}
                <ChevronDown className="ml-1 h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-48 max-h-80 overflow-y-auto">
              {/* Search Input */}
              <div className="p-2 border-b">
                <div className="relative">
                  <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-3 w-3 text-muted-foreground" />
                  <Input
                    placeholder="Search languages..."
                    value={languageSearch}
                    onChange={(e) => setLanguageSearch(e.target.value)}
                    onKeyDown={(e) => {
                      // Prevent dropdown menu keyboard navigation from interfering
                      e.stopPropagation();
                      // Prevent Enter from selecting the first item
                      if (e.key === 'Enter') {
                        e.preventDefault();
                      }
                    }}
                    className="h-7 pl-7 text-xs"
                    autoFocus
                  />
                </div>
              </div>
              
              {/* Language List */}
              <div className="max-h-48 overflow-y-auto">
                {getFilteredLanguages().map((lang) => (
                  <DropdownMenuItem
                    key={lang.value}
                    onClick={() => {
                      setCodeBlockLanguage(lang.value);
                      setLanguageSearch(''); // Clear search after selection
                    }}
                    className={getCurrentCodeLanguage() === lang.value ? "bg-accent" : ""}
                  >
                    <span className="font-mono text-xs">{lang.label}</span>
                  </DropdownMenuItem>
                ))}
                
                {/* No results message */}
                {getFilteredLanguages().length === 0 && (
                  <div className="px-3 py-2 text-xs text-muted-foreground text-center">
                    No languages found
                  </div>
                )}
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
        
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

        <Separator orientation="vertical" className="h-6 mx-0.5" />

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

        <Separator orientation="vertical" className="h-6 mx-0.5" />

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

        <Separator orientation="vertical" className="h-6 mx-0.5" />

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

        <Separator orientation="vertical" className="h-6 mx-0.5" />

        {/* Blockquote */}
        <Button
          variant={safeEditorState.isBlockquote ? "default" : "ghost"}
          size="sm"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className="h-8 w-8 p-0"
        >
          <Quote className="h-4 w-4" />
        </Button>

        {/* Horizontal Rule */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          className="h-8 w-8 p-0"
        >
          <Minus className="h-4 w-4" />
        </Button>

        <Separator orientation="vertical" className="h-6 mx-0.5" />

        {/* Keyboard Shortcuts Helper - Removed from here, now floating */}
      </div>
    </div>
  );
};

export default MenuBar;
