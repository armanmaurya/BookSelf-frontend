import { ParagraphEditor } from "./paragraph-editor";
import { Editor } from "slate";

export const withParagraph = <T extends Editor>(editor: T) => {
  const e = editor as T & ParagraphEditor;

  return e;
};
