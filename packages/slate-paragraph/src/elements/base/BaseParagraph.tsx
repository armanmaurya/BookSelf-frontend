import React from "react";
import { ParagraphElementProps, ParagraphType } from "../../types/element";

const BaseParagraph = (props: ParagraphElementProps) => {
  const style: React.CSSProperties = {
    textAlign: props.element.type === ParagraphType ? props.element.align : "left"
  }
  const { attributes, children, element } = props;
  return <div style={style} {...attributes} className="whitespace-pre-wrap">{children}</div>;
};

export default BaseParagraph;
