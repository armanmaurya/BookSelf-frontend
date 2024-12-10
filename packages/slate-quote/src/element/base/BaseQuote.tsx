import { RenderElementProps } from "slate-react";

export const EditableQuote = (props: RenderElementProps) => {
  return (
    <div
      className="border-l-4 py-2 bg-slate-100 dark:bg-neutral-900 border-neutral-300 pl-4 my-2 whitespace-pre"
      {...props.attributes}
    >
      {props.children}
    </div>
  );
};