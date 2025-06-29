import { Editor } from "slate";
import { CodeEditor } from "./code-editor";

export const withCode = <T extends Editor>(editor: T) => {
  const e = editor as T & CodeEditor;
  return e;
};
