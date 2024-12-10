import { RenderElementProps } from "slate-react";
import { Descendant } from "slate";

export const CodeType = "code";

export type QuoteElementType = {
    type: "quote";
    children: Descendant[];
};

export type CodeElementProps = Omit<RenderElementProps, "element"> & {
  element: QuoteElementType;
};
