import { BaseEditor } from "slate";
import { ReactEditor } from "slate-react";
import { NodeType } from "@bookself/slate-editor/src/types";

export type ListItemElementType = {
  type: NodeType.LIST_ITEM | null;
  children: any[];
};

export type OrderedListElementType = {
  type: NodeType.ORDERED_LIST;
  children: ListItemElementType[];
};

export type UnorderedListElementType = {
  type: NodeType.UNORDERED_LIST;
  children: ListItemElementType[];
};

// declare module "slate" {
//   interface CustomTypes {
//     Editor: CustomEditor;
//     Element: CustomElement;
//   }
// }

type CustomEditor = BaseEditor & ReactEditor;
export type CustomElement = OrderedListElementType | UnorderedListElementType | ListItemElementType;
