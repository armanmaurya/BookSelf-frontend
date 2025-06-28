import { Editor, Transforms, Range, Element } from "slate";
import { HeadingEditor } from "./heading-editor";
import { HeadingType } from "./types/type";

export const withHeading = <T extends Editor>(editor: T) => {
  const { insertText } = editor;
  const e = editor as T & HeadingEditor;

  return e;
};
