import { RenderLeafProps } from "slate-react";

export type CodeLeafType = {
  type: "code";
  text: string;
};

export type CodeLeafProps = Omit<RenderLeafProps, "leaf"> & {
  leaf: CodeLeafType;
};
