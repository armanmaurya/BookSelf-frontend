import { RenderElementProps } from "slate-react";

export const RenderQuote = (props: RenderElementProps) => {
  return (
    <div style={{backgroundColor: "#d4d4d4"}} className="my-2">
      <div
        className="bg-slate-100 dark:bg-neutral-900 pl-4 p-2 ml-1 whitespace-pre"
        {...props.attributes}
      >
        {props.children}
      </div>
    </div>
  );
};
