import { NodeType } from "@/app/utils";
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
  children: (OrderedListElementType | ListItemElementType | UnorderedListElementType)[]
};

type UnorderedListElementType = {
  type: NodeType.UNORDERED_LIST | null;
//   children: (UnorderedListElementType | CustomText)[]
  children: (UnorderedListElementType | ListItemElementType | OrderedListElementType)[]
};

type ListItemElementType = {
  type: NodeType.LIST_ITEM | null;
  children: any;
};

export type ImageElementType = {
  type: "image" | null;
  url: string | null;
  children: CustomText[];
};

export type CustomElement =
  | CodeElementType
  | ParagraphElement
  | HeadingElement
  | ImageElementType
  | OrderedListElementType
  | UnorderedListElementType
  | ListItemElementType;

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
