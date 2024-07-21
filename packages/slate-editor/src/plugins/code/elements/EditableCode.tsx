import { NodeType } from "../../../types";
import React from "react";
import { Transforms } from "slate";
import { ReactEditor, RenderElementProps, useSlateStatic } from "slate-react";
import { BaseCode } from "./BaseCode";

export const EditableCode = (props: RenderElementProps) => {
  const editor = useSlateStatic();

  const { attributes, children, element } = props;
  const setLanguage = (language: string) => {
    const path = ReactEditor.findPath(editor, element);
    Transforms.setNodes(editor, { language }, { at: path });
  };
  return (
    <div className="relative">
      <div contentEditable={false} className="absolute">
        <select
          defaultValue={
            element.type === NodeType.CODE ? (element.language as string) : ""
          }
          name="languages"
          id=""
          className="m-1 text-xs bg-transparent rounded"
          onChange={(e) => {
            const language = e.target.value;
            setLanguage(language);
          }}
        >
          <option value="" selected>
            Select
          </option>
          <option value="javascript">Javascript</option>
          <option value="python">Python</option>
          <option value="java">Java</option>
          <option value="jsx">JSX</option>
        </select>
      </div>
      <BaseCode {...props} />
    </div>
  );
};
