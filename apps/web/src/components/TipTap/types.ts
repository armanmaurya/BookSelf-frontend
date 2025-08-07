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
}

export interface TipTapBubbleMenuProps {
  editor: Editor;
}

export interface TipTapProps {
  initialContent: string | null;
  initialTitle: string;
  onTitleChange: (title: string) => void;
  onContentChange: (content: string) => void;
}
