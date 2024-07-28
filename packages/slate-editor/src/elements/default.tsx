import { RenderElementProps } from "slate-react";
import { NodeType } from "../types";

export const Default = (props: RenderElementProps) => {
  const style = {
    textAlign:
      props.element.type === NodeType.PARAGRAPH ? props.element.align : "left",
  };
  return (
    <div className={`whitespace-pre py-1`} style={style} {...props.attributes}>
      {props.children}
    </div>
  );
};
