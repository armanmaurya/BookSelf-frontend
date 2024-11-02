import { RenderElementProps } from "slate-react";
import { CodeLeafType } from "./leaf";

export const CodeType = "code";

export type CodeElementType = {
  id?: string;
  type: "code";
  language: string;
  children: CodeLeafType[];
};



export type CodeElementProps = Omit<RenderElementProps, "element"> & {
  element: CodeElementType;
};
