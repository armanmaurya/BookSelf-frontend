import { RenderLeafProps } from "slate-react";

export type HeadingLeafType = {
  type: "heading";
  text: string;
};

export type ParagraphLeafProps = Omit<RenderLeafProps, "leaf"> & {
  leaf: HeadingLeafType;
};
