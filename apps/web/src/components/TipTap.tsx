"use client";

import { useState, useEffect, useCallback } from "react";
import {
  useEditor,
  EditorContent,
  useEditorState,
  type Editor,
} from "@tiptap/react";
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
import { UndoRedo } from "@tiptap/extensions";
import Blockquote from "@tiptap/extension-blockquote";
import { OrderedList, BulletList, ListItem } from "@tiptap/extension-list";
import HardBreak from "@tiptap/extension-hard-break";
import HorizontalRule from "@tiptap/extension-horizontal-rule";
import TextAlign from "@tiptap/extension-text-align";
import Typography from "@tiptap/extension-typography";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { FontFamily, TextStyle } from "@tiptap/extension-text-style";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
  CheckSquare,
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
} from "lucide-react";
// import DragHandle from "@tiptap/extension-drag-handle-react";

interface MenuBarProps {
  editor: Editor | null;
}

const MenuBar = ({ editor }: MenuBarProps) => {
  if (!editor) {
    return null;
  }

  // Read the current editor's state, and re-render the component when it changes
  const editorState = useEditorState({
    editor,
    selector: (ctx) => {
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
        isInter: ctx.editor.isActive("textStyle", { fontFamily: "Inter" }) ?? false,
        isComicSans: ctx.editor.isActive("textStyle", { fontFamily: '"Comic Sans MS", "Comic Sans"' }) ?? false,
        isSerif: ctx.editor.isActive("textStyle", { fontFamily: "serif" }) ?? false,
        isMonospace: ctx.editor.isActive("textStyle", { fontFamily: "monospace" }) ?? false,
        isCursive: ctx.editor.isActive("textStyle", { fontFamily: "cursive" }) ?? false,
        isSystemUI: ctx.editor.isActive("textStyle", { fontFamily: "system-ui" }) ?? false,
        isArial: ctx.editor.isActive("textStyle", { fontFamily: "Arial" }) ?? false,
        isHelvetica: ctx.editor.isActive("textStyle", { fontFamily: "Helvetica" }) ?? false,
        isTimesNewRoman: ctx.editor.isActive("textStyle", { fontFamily: '"Times New Roman"' }) ?? false,
        isGeorgia: ctx.editor.isActive("textStyle", { fontFamily: "Georgia" }) ?? false,
        isVerdana: ctx.editor.isActive("textStyle", { fontFamily: "Verdana" }) ?? false,
        isTahoma: ctx.editor.isActive("textStyle", { fontFamily: "Tahoma" }) ?? false,
        isCourierNew: ctx.editor.isActive("textStyle", { fontFamily: '"Courier New"' }) ?? false,
        isTrebuchet: ctx.editor.isActive("textStyle", { fontFamily: '"Trebuchet MS"' }) ?? false,
        isImpact: ctx.editor.isActive("textStyle", { fontFamily: "Impact" }) ?? false,
        isPalatino: ctx.editor.isActive("textStyle", { fontFamily: "Palatino" }) ?? false,
        isRoboto: ctx.editor.isActive("textStyle", { fontFamily: "Roboto" }) ?? false,
        isOpenSans: ctx.editor.isActive("textStyle", { fontFamily: '"Open Sans"' }) ?? false,
        isLato: ctx.editor.isActive("textStyle", { fontFamily: "Lato" }) ?? false,
        isMontserrat: ctx.editor.isActive("textStyle", { fontFamily: "Montserrat" }) ?? false,
        isPoppins: ctx.editor.isActive("textStyle", { fontFamily: "Poppins" }) ?? false,
      };
    },
  });

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
    if (editorState.isInter) return "Inter";
    if (editorState.isComicSans) return "Comic Sans MS";
    if (editorState.isSerif) return "Serif";
    if (editorState.isMonospace) return "Monospace";
    if (editorState.isCursive) return "Cursive";
    if (editorState.isSystemUI) return "System UI";
    if (editorState.isArial) return "Arial";
    if (editorState.isHelvetica) return "Helvetica";
    if (editorState.isTimesNewRoman) return "Times New Roman";
    if (editorState.isGeorgia) return "Georgia";
    if (editorState.isVerdana) return "Verdana";
    if (editorState.isTahoma) return "Tahoma";
    if (editorState.isCourierNew) return "Courier New";
    if (editorState.isTrebuchet) return "Trebuchet MS";
    if (editorState.isImpact) return "Impact";
    if (editorState.isPalatino) return "Palatino";
    if (editorState.isRoboto) return "Roboto";
    if (editorState.isOpenSans) return "Open Sans";
    if (editorState.isLato) return "Lato";
    if (editorState.isMontserrat) return "Montserrat";
    if (editorState.isPoppins) return "Poppins";
    return "Default";
  };

  const getCurrentAlignment = () => {
    if (editorState.isAlignCenter) return "center";
    if (editorState.isAlignRight) return "right";
    if (editorState.isAlignJustify) return "justify";
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

  return (
    <div className="border border-input bg-background rounded-md p-2 mb-4">
      <div className="flex items-center gap-1 flex-wrap">
        {/* Undo/Redo */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editorState.canUndo}
          className="h-8 w-8 p-0"
        >
          <Undo className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editorState.canRedo}
          className="h-8 w-8 p-0"
        >
          <Redo className="h-4 w-4" />
        </Button>

        <Separator orientation="vertical" className="h-6 mx-1" />

        {/* Font Family Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="px-3 py-1 h-8 text-sm w-[110px] overflow-auto">
              {getCurrentFontFamily()}
              <ChevronDown className="ml-1 h-3 w-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-56 max-h-80 overflow-y-auto">
            <DropdownMenuItem
              onClick={() => unsetFontFamily()}
              className={getCurrentFontFamily() === "Default" ? "bg-accent" : ""}
            >
              <span className="font-normal">Default</span>
            </DropdownMenuItem>
            
            {/* Popular Web Fonts */}
            <div className="px-2 py-1 text-xs font-medium text-muted-foreground border-t mt-1">
              Popular Web Fonts
            </div>
            <DropdownMenuItem
              onClick={() => setFontFamily("Inter")}
              className={editorState.isInter ? "bg-accent" : ""}
            >
              <span style={{ fontFamily: "Inter" }}>Inter</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => setFontFamily("Roboto")}
              className={editorState.isRoboto ? "bg-accent" : ""}
            >
              <span style={{ fontFamily: "Roboto, sans-serif" }}>Roboto</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => setFontFamily("Open Sans")}
              className={editorState.isOpenSans ? "bg-accent" : ""}
            >
              <span style={{ fontFamily: '"Open Sans", sans-serif' }}>Open Sans</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => setFontFamily("Lato")}
              className={editorState.isLato ? "bg-accent" : ""}
            >
              <span style={{ fontFamily: "Lato, sans-serif" }}>Lato</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => setFontFamily("Montserrat")}
              className={editorState.isMontserrat ? "bg-accent" : ""}
            >
              <span style={{ fontFamily: "Montserrat, sans-serif" }}>Montserrat</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => setFontFamily("Poppins")}
              className={editorState.isPoppins ? "bg-accent" : ""}
            >
              <span style={{ fontFamily: "Poppins, sans-serif" }}>Poppins</span>
            </DropdownMenuItem>

            {/* System Fonts */}
            <div className="px-2 py-1 text-xs font-medium text-muted-foreground border-t mt-1">
              System Fonts
            </div>
            <DropdownMenuItem
              onClick={() => setFontFamily("Arial")}
              className={editorState.isArial ? "bg-accent" : ""}
            >
              <span style={{ fontFamily: "Arial, sans-serif" }}>Arial</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => setFontFamily("Helvetica")}
              className={editorState.isHelvetica ? "bg-accent" : ""}
            >
              <span style={{ fontFamily: "Helvetica, sans-serif" }}>Helvetica</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => setFontFamily("Verdana")}
              className={editorState.isVerdana ? "bg-accent" : ""}
            >
              <span style={{ fontFamily: "Verdana, sans-serif" }}>Verdana</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => setFontFamily("Tahoma")}
              className={editorState.isTahoma ? "bg-accent" : ""}
            >
              <span style={{ fontFamily: "Tahoma, sans-serif" }}>Tahoma</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => setFontFamily("Trebuchet MS")}
              className={editorState.isTrebuchet ? "bg-accent" : ""}
            >
              <span style={{ fontFamily: '"Trebuchet MS", sans-serif' }}>Trebuchet MS</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => setFontFamily("system-ui")}
              className={editorState.isSystemUI ? "bg-accent" : ""}
            >
              <span style={{ fontFamily: "system-ui" }}>System UI</span>
            </DropdownMenuItem>

            {/* Serif Fonts */}
            <div className="px-2 py-1 text-xs font-medium text-muted-foreground border-t mt-1">
              Serif Fonts
            </div>
            <DropdownMenuItem
              onClick={() => setFontFamily("Times New Roman")}
              className={editorState.isTimesNewRoman ? "bg-accent" : ""}
            >
              <span style={{ fontFamily: '"Times New Roman", serif' }}>Times New Roman</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => setFontFamily("Georgia")}
              className={editorState.isGeorgia ? "bg-accent" : ""}
            >
              <span style={{ fontFamily: "Georgia, serif" }}>Georgia</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => setFontFamily("Palatino")}
              className={editorState.isPalatino ? "bg-accent" : ""}
            >
              <span style={{ fontFamily: "Palatino, serif" }}>Palatino</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => setFontFamily("serif")}
              className={editorState.isSerif ? "bg-accent" : ""}
            >
              <span style={{ fontFamily: "serif" }}>Serif</span>
            </DropdownMenuItem>

            {/* Monospace & Display Fonts */}
            <div className="px-2 py-1 text-xs font-medium text-muted-foreground border-t mt-1">
              Monospace & Display
            </div>
            <DropdownMenuItem
              onClick={() => setFontFamily("Courier New")}
              className={editorState.isCourierNew ? "bg-accent" : ""}
            >
              <span style={{ fontFamily: '"Courier New", monospace' }}>Courier New</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => setFontFamily("monospace")}
              className={editorState.isMonospace ? "bg-accent" : ""}
            >
              <span style={{ fontFamily: "monospace" }}>Monospace</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => setFontFamily("Impact")}
              className={editorState.isImpact ? "bg-accent" : ""}
            >
              <span style={{ fontFamily: "Impact, sans-serif" }}>Impact</span>
            </DropdownMenuItem>

            {/* Fun Fonts */}
            <div className="px-2 py-1 text-xs font-medium text-muted-foreground border-t mt-1">
              Fun Fonts
            </div>
            <DropdownMenuItem
              onClick={() => setFontFamily("Comic Sans MS, cursive")}
              className={editorState.isComicSans ? "bg-accent" : ""}
            >
              <span style={{ fontFamily: "Comic Sans MS, cursive" }}>Comic Sans</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => setFontFamily("cursive")}
              className={editorState.isCursive ? "bg-accent" : ""}
            >
              <span style={{ fontFamily: "cursive" }}>Cursive</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Separator orientation="vertical" className="h-6 mx-1" />

        {/* Headings Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 px-2 w-[110px] overflow-auto justify-start">
              {editorState.isHeading1 && <Heading1 className="h-4 w-4" />}
              {editorState.isHeading2 && <Heading2 className="h-4 w-4" />}
              {editorState.isHeading3 && <Heading3 className="h-4 w-4" />}
              {editorState.isHeading4 && <Heading4 className="h-4 w-4" />}
              {editorState.isHeading5 && <Heading5 className="h-4 w-4" />}
              {editorState.isHeading6 && <Heading6 className="h-4 w-4" />}
              {editorState.isParagraph && (
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

        <Separator orientation="vertical" className="h-6 mx-1" />

        {/* Text Formatting */}
        <Button
          variant={editorState.isBold ? "default" : "ghost"}
          size="sm"
          onClick={() => editor.chain().focus().toggleBold().run()}
          disabled={!editorState.canBold}
          className="h-8 w-8 p-0"
        >
          <BoldIcon className="h-4 w-4" />
        </Button>
        <Button
          variant={editorState.isItalic ? "default" : "ghost"}
          size="sm"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          disabled={!editorState.canItalic}
          className="h-8 w-8 p-0"
        >
          <ItalicIcon className="h-4 w-4" />
        </Button>
        <Button
          variant={editorState.isUnderline ? "default" : "ghost"}
          size="sm"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          disabled={!editorState.canUnderline}
          className="h-8 w-8 p-0"
        >
          <UnderlineIcon className="h-4 w-4" />
        </Button>
        <Button
          variant={editorState.isStrike ? "default" : "ghost"}
          size="sm"
          onClick={() => editor.chain().focus().toggleStrike().run()}
          disabled={!editorState.canStrike}
          className="h-8 w-8 p-0"
        >
          <Strikethrough className="h-4 w-4" />
        </Button>
        <Button
          variant={editorState.isCode ? "default" : "ghost"}
          size="sm"
          onClick={() => editor.chain().focus().toggleCode().run()}
          disabled={!editorState.canCode}
          className="h-8 w-8 p-0"
        >
          <Code2 className="h-4 w-4" />
        </Button>
        <Button
          variant={editorState.isHighlight ? "default" : "ghost"}
          size="sm"
          onClick={() => editor.chain().focus().toggleHighlight().run()}
          disabled={!editorState.canHighlight}
          className="h-8 w-8 p-0"
        >
          <Highlighter className="h-4 w-4" />
        </Button>

        <Separator orientation="vertical" className="h-6 mx-1" />

        {/* Subscript/Superscript */}
        <Button
          variant={editorState.isSubscript ? "default" : "ghost"}
          size="sm"
          onClick={() => editor.chain().focus().toggleSubscript().run()}
          disabled={!editorState.canSubscript}
          className="h-8 w-8 p-0"
        >
          <SubscriptIcon className="h-4 w-4" />
        </Button>
        <Button
          variant={editorState.isSuperscript ? "default" : "ghost"}
          size="sm"
          onClick={() => editor.chain().focus().toggleSuperscript().run()}
          disabled={!editorState.canSuperscript}
          className="h-8 w-8 p-0"
        >
          <SuperscriptIcon className="h-4 w-4" />
        </Button>

        <Separator orientation="vertical" className="h-6 mx-1" />

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

        <Separator orientation="vertical" className="h-6 mx-1" />

        {/* Lists */}
        <Button
          variant={editorState.isBulletList ? "default" : "ghost"}
          size="sm"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className="h-8 w-8 p-0"
        >
          <List className="h-4 w-4" />
        </Button>
        <Button
          variant={editorState.isOrderedList ? "default" : "ghost"}
          size="sm"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className="h-8 w-8 p-0"
        >
          <ListOrdered className="h-4 w-4" />
        </Button>

        <Separator orientation="vertical" className="h-6 mx-1" />

        {/* Blockquote */}
        <Button
          variant={editorState.isBlockquote ? "default" : "ghost"}
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
      </div>
    </div>
  );
};

const Tiptap = ({
  initialContent = null,
  initialTitle = "",
  onTitleChange,
  onContentChange,
}: {
  initialContent: string | null;
  initialTitle: string;
  onTitleChange: (title: string) => void;
  onContentChange: (content: string) => void;
}) => {
  const [title, setTitle] = useState(initialTitle);

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

  const editor = useEditor({
    extensions: [
      Heading.configure({
        levels: [1, 2, 3, 4, 5, 6],
      }),
      Document,
      Paragraph,
      Text,
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
      TextStyle,
      FontFamily,
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

  // Keyboard shortcut handler for Ctrl+S
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.key === 's') {
        event.preventDefault();
        if (editor && onContentChange) {
          const content = editor.getHTML();
          onContentChange(content);
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [editor, onContentChange]);

  return (
    <div className="w-full">
      <div className="sticky top-16 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <MenuBar editor={editor} />
      </div>
      <div className="max-w-4xl mx-auto">
        <div className="border border-input rounded-md">
          {/* Document Title Input - Notion Style */}
          <div className="p-6 pb-2">
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Untitled"
              className="font-bold border-none px-0 py-2 h-auto focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent placeholder:text-muted-foreground/60 resize-none"
              style={{ 
                lineHeight: '1.1',
                fontWeight: '800',
                fontSize: '2.8rem',
              }}
            />
          </div>
          
          {/* Editor Content */}
          <div className="px-6 pb-6">
            <EditorContent
              editor={editor}
              className="prose dark:prose-invert min-h-[200px] max-w-none"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tiptap;
