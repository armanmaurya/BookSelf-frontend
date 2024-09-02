import { Editor, Transforms } from "slate";

export const TextEditor = {
  insertNewLine: (editor: Editor) => {
    Transforms.insertText(editor, "\n");
  },
};
