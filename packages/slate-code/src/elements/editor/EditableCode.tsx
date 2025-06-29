import { BaseEditor, Editor, Transforms } from "slate";
import { ReactEditor, useSlateStatic } from "slate-react";
import { BaseCode } from "../base/baseCode";
import {
  CodeElementProps,
  CodeElementType,
  CodeType,
} from "../../types/element";

// Importing Prism for syntax highlighting
// and the necessary languages and themes
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-jsx";
import "prismjs/components/prism-typescript";
import "prismjs/components/prism-tsx";
import "prismjs/components/prism-markdown";
import "prismjs/components/prism-python";
import "prismjs/components/prism-php";
import "prismjs/components/prism-sql";
import "prismjs/components/prism-java";
import "prismjs/themes/prism-solarizedlight.css";

export const EditableCode = (props: CodeElementProps) => {
  const editor = useSlateStatic() as any;

  const { attributes, children, element } = props;
  const setLanguage = (language: string) => {
    const path = ReactEditor.findPath(editor, element);
    Transforms.setNodes(editor, { language } as Partial<CodeElementType>, {
      at: path,
    });
  };
  return (
    <div className="relative">
      <div contentEditable={false} className="absolute">
        <select
          defaultValue={
            element.type === CodeType.Code ? (element.language as string) : ""
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
