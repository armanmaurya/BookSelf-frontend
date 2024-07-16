import { RenderElementProps } from "slate-react";

export const Quote = (props: RenderElementProps) => {
  return (
    <blockquote
      className="border-l-4 border-neutral-300 pl-4 my-2 whitespace-pre-line"
      {...props.attributes}
    >
      {props.children}
    </blockquote>
  );
};
