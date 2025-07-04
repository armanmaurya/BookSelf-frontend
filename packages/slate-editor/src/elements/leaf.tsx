import { RenderLeafProps } from "slate-react";
import React from "react";

export const DefalutLeaf = (props: RenderLeafProps) => {
  const { text, ...rest } = props.leaf;
  return <span {...props.attributes} className={`let me do ${Object.keys(rest).join(" ")}`}>{props.children}</span>;
};
