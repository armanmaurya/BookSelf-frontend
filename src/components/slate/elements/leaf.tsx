import { RenderLeafProps } from "slate-react";

export const Leaf = (props: RenderLeafProps) => {
  const { text, ...rest } = props.leaf;
  return (
    <span
      {...props.attributes}
      className={`${props.leaf.bold ? " font-bold " : ""}${
        props.leaf.italic ? " `italic " : ""
      }${props.leaf.underline ? " underline " : ""}${
        props.leaf.code ? " bg-slate-200 px-0.5 rounded " : ""
      }${Object.keys(rest).join(" ")}`}
    >
      {props.children}
    </span>
  );
};
