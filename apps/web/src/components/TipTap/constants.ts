import { ShortcutCategory } from './types';

export const KEYBOARD_SHORTCUTS: ShortcutCategory[] = [
  { 
    category: "Text Formatting", 
    items: [
      { keys: ["Ctrl", "B"], description: "Bold" },
      { keys: ["Ctrl", "I"], description: "Italic" },
      { keys: ["Ctrl", "U"], description: "Underline" },
      { keys: ["Ctrl", "Shift", "S"], description: "Strikethrough" },
      { keys: ["Ctrl", "`"], description: "Code" },
      { keys: ["Ctrl", "Shift", "H"], description: "Highlight" },
    ]
  },
  { 
    category: "Headings", 
    items: [
      { keys: ["Ctrl", "Alt", "1"], description: "Heading 1" },
      { keys: ["Ctrl", "Alt", "2"], description: "Heading 2" },
      { keys: ["Ctrl", "Alt", "3"], description: "Heading 3" },
      { keys: ["Ctrl", "Alt", "4"], description: "Heading 4" },
      { keys: ["Ctrl", "Alt", "5"], description: "Heading 5" },
      { keys: ["Ctrl", "Alt", "6"], description: "Heading 6" },
      { keys: ["Ctrl", "Alt", "0"], description: "Paragraph" },
    ]
  },
  { 
    category: "Lists & Blocks", 
    items: [
      { keys: ["Ctrl", "Shift", "8"], description: "Bullet List" },
      { keys: ["Ctrl", "Shift", "7"], description: "Ordered List" },
      { keys: ["Ctrl", "Shift", "B"], description: "Blockquote" },
      { keys: ["Ctrl", "Alt", "-"], description: "Horizontal Rule" },
    ]
  },
  { 
    category: "Text Alignment", 
    items: [
      { keys: ["Ctrl", "Shift", "L"], description: "Align Left" },
      { keys: ["Ctrl", "Shift", "E"], description: "Align Center" },
      { keys: ["Ctrl", "Shift", "R"], description: "Align Right" },
      { keys: ["Ctrl", "Shift", "J"], description: "Justify" },
    ]
  },
  { 
    category: "Actions", 
    items: [
      { keys: ["Ctrl", "Z"], description: "Undo" },
      { keys: ["Ctrl", "Y"], description: "Redo" },
      { keys: ["Ctrl", "S"], description: "Save" },
      { keys: ["Ctrl", "A"], description: "Select All" },
    ]
  },
  { 
    category: "Special", 
    items: [
      { keys: ["Ctrl", ","], description: "Subscript" },
      { keys: ["Ctrl", "."], description: "Superscript" },
      { keys: ["Shift", "Enter"], description: "Hard Break" },
      { keys: ["Ctrl", "Shift", "T"], description: "Toggle Toolbar" },
    ]
  },
];
