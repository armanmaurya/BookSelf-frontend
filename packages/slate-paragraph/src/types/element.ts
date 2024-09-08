import { RenderElementProps } from "slate-react";
import { ParagraphLeafType } from "./leaf";

export const ParagraphType = "text";

export type ParagraphElementType = {
  id?: string;
  type: "text";
  align: "left" | "center" | "right" | "justify";
  children: ParagraphLeafType[];
};



export type ParagraphElementProps = Omit<RenderElementProps, "element"> & {
  element: ParagraphElementType;
};
