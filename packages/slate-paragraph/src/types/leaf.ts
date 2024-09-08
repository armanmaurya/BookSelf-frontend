import { RenderLeafProps } from "slate-react";

export type ParagraphLeafType = {
  type: "text";
  text: string;
  bold?: boolean;
  underline?: boolean;
  strike?: boolean;
  italic?: boolean;
  code?: boolean;
  fontSize: number;
  blueSelect?: boolean
};




export type ParagraphLeafProps = Omit<RenderLeafProps, "leaf"> & {
  leaf: ParagraphLeafType;
};
