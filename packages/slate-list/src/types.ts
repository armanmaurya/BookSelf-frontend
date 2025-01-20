import { BaseEditor } from "slate";
import { ReactEditor } from "slate-react";

export enum ListType {
  ORDERED_LIST = "ol",
  UNORDERED_LIST = "ul",
  LIST_ITEM = "li",
}

export type ListItemElementType = {
  type: ListType.LIST_ITEM | null;
  children: any[];
};

export type OrderedListElementType = {
  type: ListType.ORDERED_LIST;
  children: ListItemElementType[];
};

export type UnorderedListElementType = {
  type: ListType.UNORDERED_LIST;
  children: ListItemElementType[];
};

declare module "slate" {
  interface CustomTypes {
    Editor: CustomEditor;
    Element: CustomElement;
  }
}

type CustomEditor = BaseEditor & ReactEditor
export type CustomElement = OrderedListElementType | UnorderedListElementType | ListItemElementType;
