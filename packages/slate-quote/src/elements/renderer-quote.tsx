import { BaseQuote } from "./base-quote";
import { RenderElementProps } from "slate-react";

export const RendererQuote = (props: RenderElementProps) => {
  return <BaseQuote {...props} />;
};
