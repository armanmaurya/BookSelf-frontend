import { RenderElementProps } from "slate-react";

export const EditableQuote = (props: RenderElementProps) => {
  return (
    <div
      className="border-l-4 border-neutral-300 pl-4 my-2 whitespace-pre"
      {...props.attributes}
    >
      {props.children}
    </div>
  );
};