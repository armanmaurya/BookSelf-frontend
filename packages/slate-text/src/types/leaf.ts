import { RenderLeafProps } from "slate-react";

export type TextLeafType = {
  type: "text";
  text: string;
  bold?: boolean;
  underline?: boolean;
  strike?: boolean;
  italic?: boolean;
  code?: boolean;
  fontSize?: number;
};




export type TextLeafProps = Omit<RenderLeafProps, "leaf"> & {
  leaf: TextLeafType;
};
