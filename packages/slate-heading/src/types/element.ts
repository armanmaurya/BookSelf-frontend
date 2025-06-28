import { RenderElementProps } from "slate-react";
import { HeadingLeafType } from "./leaf";
import { HeadingType } from "./type";

export const ParagraphType = "text";

export type HeadingElementType = {
  headingId: string;
  type: HeadingType.H1 | HeadingType.H2 | HeadingType.H3 | HeadingType.H4 | HeadingType.H5 | HeadingType.H6;
  align: "left" | "center" | "right" | "justify";
  children: HeadingLeafType[];
};



export type HeadingElementProps = Omit<RenderElementProps, "element"> & {
  element: HeadingElementType;
};
