import { RenderElementProps } from "slate-react";

export const EditableTitle = (props: RenderElementProps) => {
  return (
    <div
      className={`whitespace-pre-wrap py-1 text-5xl font-extrabold`}
      {...props.attributes}
    >
      {props.element.children[0].text === "" && (
        <div
          contentEditable={false}
          className="fixed text-opacity-15 -z-50 text-white"
        >
          Untitled
        </div>
      )}

      <div>{props.children}</div>
    </div>
  );
};
