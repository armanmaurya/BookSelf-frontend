import { RenderElementProps } from "slate-react";
import { ParagraphLeafType } from "./leaf";

export type ParagraphType = "text";

export type ParagraphElementType = {
  id?: string;
  type: "text";
  align: "left" | "center" | "right";
  children: ParagraphLeafType[];
};



export type ParagraphElementProps = Omit<RenderElementProps, "element"> & {
  element: ParagraphElementType;
};
