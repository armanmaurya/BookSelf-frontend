import { RenderElementProps } from "slate-react";
import { NodeType } from "../types";

export const Default = (props: RenderElementProps) => {
  return (
    <div className={`whitespace-pre-wrap py-1`} {...props.attributes}>
      {props.children}
    </div>
  );
};
