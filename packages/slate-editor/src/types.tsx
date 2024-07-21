// import { NodeType } from "@/components/slate/types";
import {
  BaseEditor,
  NodeOperation,
  SelectionOperation,
  TextOperation,
} from "slate";
import { ReactEditor } from "slate-react";

type CustomEditor = BaseEditor & ReactEditor & CustomEditorType;
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
  children: CustomText[];
};
type ParagraphElement = {
  type: NodeType.PARAGRAPH | null;
  align: "left" | "center" | "right" | "justify";
  children: any[];
};
export type BaseOperation = NodeOperation | SelectionOperation | TextOperation;

type CodeElementType = {
  type: NodeType.CODE | null;
  language: string | null;
  children: CustomText[];
};

type OrderedListElementType = {
  type: NodeType.ORDERED_LIST | null;
  //   children: (OrderedListElementType | CustomText)[]
  children: (
    | OrderedListElementType
    | ListItemElementType
    | UnorderedListElementType
  )[];
};

type UnorderedListElementType = {
  type: NodeType.UNORDERED_LIST | null;
  //   children: (UnorderedListElementType | CustomText)[]
  children: (
    | UnorderedListElementType
    | ListItemElementType
    | OrderedListElementType
  )[];
};

type ListItemElementType = {
  type: NodeType.LIST_ITEM | null;
  children: any[];
};

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

export type CustomElement =
  | CodeElementType
  | ParagraphElement
  | HeadingElement
  | ImageElementType
  | OrderedListElementType
  | UnorderedListElementType
  | ListItemElementType
  | QUOTE
  | Link;

export type FormattedText = {
  text: string;
  bold?: boolean;
  underlined?: boolean;
  bold_italic?: boolean;
  strike?: boolean;
  title?: boolean;
  h1?: boolean;
  h2?: boolean;
  h3?: boolean;
  h4?: boolean;
  h5?: boolean;
  h6?: boolean;

  italic?: boolean;
  underline?: boolean;
  list?: boolean;
  hr?: boolean;
  blockquote?: boolean;
  code?: boolean;
  type?: string;
};

type CustomText = FormattedText;

declare module "slate" {
  interface CustomTypes {
    Editor: CustomEditor;
    Element: CustomElement;
    Text: CustomText;
    Operation: BaseOperation;
  }
}

export enum NodeType {
  PARAGRAPH = "paragraph",
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
}

export interface EditorContent {
  title: string;
  content: string;
  tags: string[];
} 
