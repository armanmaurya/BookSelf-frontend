// import { NodeType } from "@/components/slate/types";
import {
  BaseEditor,
  NodeOperation,
  SelectionOperation,
  TextOperation,
} from "slate";
import { ReactEditor } from "slate-react";
import { HistoryEditor } from "slate-history";
import {
  ParagraphElementType,
  ParagraphLeafType,
  ParagraphEditor,
} from "@bookself/slate-paragraph";
import { TabLeafType } from "./plugins/tab-list/leaf/TabLeafType";
import { CodeElementType } from "@bookself/slate-code";
import { HeadingEditor, HeadingElementType } from "@bookself/slate-heading";
import {
  ListItemElementType,
  OrderedListElementType,
  UnorderedListElementType,
} from "@bookself/slate-list";

// ...

  type CustomEditor = BaseEditor &
  ReactEditor &
  CustomEditorType &
  HistoryEditor &
  HeadingEditor & ParagraphEditor;
type CustomEditorType = { type?: string };

type HeadingElement = {
  id: string;
  type:
    | NodeType.H1
    | NodeType.H2
    | NodeType.H3
    | NodeType.H4
    | NodeType.H5
    | NodeType.H6
    | null;
  align: "left" | "center" | "right" | "justify";
  children: DefalutLeafType[];
};
export type BaseOperation = NodeOperation | SelectionOperation | TextOperation;

declare module "@bookself/slate-command-menu" {
  interface CustomTypes {
    Editor: CustomEditor;
    Element: CustomElement;
    Text: CustomText;
  }
}

export type ImageElementType = {
  type: "image" | null;
  align: "left" | "center" | "right";
  width: number;
  url: string | null;
  children: CustomText[];
};

type QUOTE = {
  type: NodeType.BLOCKQUOTE | null;
  children: any[];
};

type Link = {
  type: "link";
  url: string;
  children: CustomText[];
};

type Tabs = {
  type: "tabs";
  children: (TabList | TabPanel)[];
};

type TabList = {
  type: "tab-list";
  children: Tab[];
};

type Tab = {
  type: "tab";
  index: number;
  children: CustomText[];
};

type TabPanel = {
  type: "tab-panel";
  index: number;
  children: any[];
};

export type CustomElement =
  | CodeElementType
  | HeadingElementType
  | ImageElementType
  | OrderedListElementType
  | UnorderedListElementType
  | ListItemElementType
  | QUOTE
  | Link
  | Tabs
  | TabList
  | Tab
  | TabPanel
  | ParagraphElementType;

type DefalutLeafType = {
  type: "default";
  text: string;
};
export type CustomText = ParagraphLeafType | TabLeafType | DefalutLeafType;

declare module "slate" {
  interface CustomTypes {
    Editor: CustomEditor;
    Element: CustomElement;
    Text: CustomText;
    Operation: BaseOperation;
  }
}

export enum NodeType {
  // PARAGRAPH = "paragraph",
  H1 = "heading-one",
  H2 = "heading-two",
  H3 = "heading-three",
  H4 = "heading-four",
  H5 = "heading-five",
  H6 = "heading-six",
  CODE = "code",
  ORDERED_LIST = "ordered-list",
  UNORDERED_LIST = "unordered-list",
  LIST_ITEM = "list-item",
  BOLD = "bold",
  ITALIC = "italic",
  UNDERLINE = "underline",
  BLOCKQUOTE = "quote",
  LINK = "link",
  IMAGE = "image",
  TABS = "tabs",
  TAB_LIST = "tab-list",
  TAB = "tab",
  TAB_PANEL = "tab-panel",
  PARAGRAPH = "text",
}

export interface EditorContent {
  title: string;
  content: string;
  tags: string[];
}
