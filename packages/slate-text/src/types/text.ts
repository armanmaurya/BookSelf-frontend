import { RenderElementProps } from "slate-react";
import { TextLeafType } from "./leaf";

export type TextType = "text";

export type TextElementType = {
  id?: string;
  type: "text";
  align: "left" | "center" | "right";
  children: TextLeafType[];
};



export type TextElementProps = Omit<RenderElementProps, "element"> & {
  element: TextElementType;
};
