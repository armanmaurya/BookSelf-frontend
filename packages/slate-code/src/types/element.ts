import { RenderElementProps } from "slate-react";
import { CodeLeafType } from "./leaf";
import { Descendant } from "slate";

export enum CodeType {
  Code = "code",
}

export type CodeElementType = {
  id?: string;
  type: CodeType.Code;
  language: string;
  children: Descendant[];
};

export type CodeElementProps = Omit<RenderElementProps, "element"> & {
  element: CodeElementType;
};
