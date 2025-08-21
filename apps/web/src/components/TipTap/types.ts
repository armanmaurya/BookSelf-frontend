import { Editor } from "@tiptap/react";

export interface KeyboardShortcut {
  keys: string[];
  description: string;
}

export interface ShortcutCategory {
  category: string;
  items: KeyboardShortcut[];
}

export interface MenuBarProps {
  editor: Editor | null;
  onHideToolbar?: () => void;
  mathEditDialog?: {
    isOpen: boolean;
    type: 'inline' | 'block';
    currentLatex: string;
    node?: any;
    pos?: number;
  };
  onMathEdit?: (newLatex: string) => void;
  onCloseMathEditDialog?: () => void;
  initialSlug: string;
}

export interface TipTapBubbleMenuProps {
  editor: Editor;
}

export interface TipTapProps {
  initialContent: string | null;
  initialTitle: string;
  onTitleChange: (title: string) => void;
  onContentChange: (content: string) => void;
  thumbnail?: string | null;
  onThumbnailRemove?: () => void;
  initialSlug?: string;
}
