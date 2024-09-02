import React from "react";
import { ParagraphElementProps } from "../../types/element";

const BaseText = (props: ParagraphElementProps) => {
  const { attributes, children, element } = props;
  return <div {...attributes}>{children}</div>;
};

export default BaseText;
