import { Editor, Transforms, Range, Element } from "slate";
import { HeadingEditor } from "./heading-editor";
import { HeadingType } from "./types/type";

export const withHeading = <T extends Editor>(editor: T) => {
  const { insertText } = editor;
  const e = editor as T & HeadingEditor;

  e.insertText = (text) => {
    if (editor.selection) {
      HeadingEditor.setHeadingId(e, text);
      const nodetext = Editor.string(editor, editor.selection.anchor.path);
      HeadingEditor.setHeadingId(e, `${nodetext}${text}`);
    }
    // Get the Heading text
    insertText(text);
  };

  return e;
};
