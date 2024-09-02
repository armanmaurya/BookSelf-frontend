import React from "react";
import { TextElementProps } from "../../types/text";

const BaseText = (props: TextElementProps) => {
  const { attributes, children, element } = props;
  return <div {...attributes}>{children}</div>;
};

export default BaseText;
