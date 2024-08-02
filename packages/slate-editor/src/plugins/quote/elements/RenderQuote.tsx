import { RenderElementProps } from "slate-react";

export const RenderQuote = (props: RenderElementProps) => {
  return (
    <div style={{backgroundColor: "black"}} className="my-2">
      <div
        className="bg-slate-100 pl-4 p-2 ml-1 whitespace-pre"
        {...props.attributes}
      >
        {props.children}
      </div>
    </div>
  );
};
