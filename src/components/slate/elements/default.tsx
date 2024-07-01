import { RenderElementProps } from "slate-react";
import { NodeType } from "@/components/slate/types";

export const Default = (props: RenderElementProps) => {
  const style = {
    textAlign:
      props.element.type === NodeType.PARAGRAPH ? props.element.align : "left",
  };
  return (
    <div className={`my-2`} style={style} {...props.attributes}>
      {props.children}
    </div>
  );
};
