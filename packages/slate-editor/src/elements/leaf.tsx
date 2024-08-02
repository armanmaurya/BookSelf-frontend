import { RenderLeafProps } from "slate-react";
import React from "react";

export const Leaf = (props: RenderLeafProps) => {
  const { text, ...rest } = props.leaf;
  return (
    <span
      {...props.attributes}
      className={`${props.leaf.bold ? " font-bold " : ""}${
        props.leaf.italic ? " `italic " : ""
      }${props.leaf.underline ? " underline " : ""}${
        props.leaf.code ? " dark:bg-neutral-700 dark:bg-opacity-60 bg-slate-200 bg-opacity-60 px-0.5 rounded " : ""
      }${Object.keys(rest).join(" ")}`}
    >
      {props.children}
    </span>
  );
};
