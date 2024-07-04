import {
  Editor,
  Transforms,
  Element as SlateElement,
  Node as SlateNode,
  Span,
} from "slate";
import { SlateCustomEditor } from "../utils";
import { NodeType } from "../types";

export const withHeadingId = (editor: Editor) => {
  const { insertText, deleteForward, deleteBackward } = editor;
  editor.insertText = (text) => {
    insertText(text);
    SlateCustomEditor.addHeadingId(editor);
  };

  editor.deleteBackward = (...args) => {
    deleteBackward(...args);
    SlateCustomEditor.addHeadingId(editor);
  };

  editor.deleteForward = (...args) => {
    deleteForward(...args);
    SlateCustomEditor.addHeadingId(editor);
  };

  return editor;
};
