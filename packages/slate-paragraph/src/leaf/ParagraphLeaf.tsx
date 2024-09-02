import { ParagraphLeafProps } from "../types/leaf";

export const ParagraphLeaf = (props: ParagraphLeafProps) => {
  const { text, ...rest } = props.leaf;
  return (
    <span
      style={{ fontSize: props.leaf.fontSize }}
      {...props.attributes}
      className={`${props.leaf.bold ? " font-bold " : ""}${
        props.leaf.italic ? " `italic " : ""
      }${props.leaf.underline ? " underline " : ""}${
        props.leaf.code
          ? " dark:bg-neutral-700 dark:bg-opacity-60 bg-slate-200 bg-opacity-60 px-0.5 rounded "
          : ""
      }${props.leaf.strike ? " line-through " : ""}`}
    >
      {props.children}
    </span>
  );
  
};
