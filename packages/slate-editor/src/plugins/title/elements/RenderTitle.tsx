import { RenderElementProps } from "slate-react";

export const RenderTitle = (props: RenderElementProps) => {
  return (
    <div
      className={`whitespace-pre-wrap py-1 text-5xl font-extrabold`}
      {...props.attributes}
    >
      {props.children}
    </div>
  );
};
