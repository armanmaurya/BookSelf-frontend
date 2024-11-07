import { RenderElementProps } from "slate-react";
import { CodeLeafType } from "./leaf";
import { Descendant } from "slate";

export const CodeType = "code";

export type CodeElementType = {
  id?: string;
  type: "code";
  language: string;
  children: Descendant[];
};



export type CodeElementProps = Omit<RenderElementProps, "element"> & {
  element: CodeElementType;
};
