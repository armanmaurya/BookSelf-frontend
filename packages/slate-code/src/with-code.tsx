import { Editor, Transforms } from "slate";
import { ReactEditor } from "slate-react";
import { CodeEditor } from "./code-editor";
import { CodeType } from "./types/element";

export const withCode = <T extends Editor>(editor: T) => {
  const e = editor as T & CodeEditor & ReactEditor;
  const { insertData } = e;
  e.insertData = (data: DataTransfer) => {
    const text = data.getData("text/plain");
    // Only handle paste if selection is inside a code block
    const [match] = Editor.nodes(e, {
      match: (n) => (n as any).type === CodeType.Code,
      mode: "lowest",
    });
    if (match && text) {
      // Insert as plain text in the current code block (replace selection)
      Transforms.insertText(e, text);
      return;
    }
    insertData(data);
  };
  return e;
};
