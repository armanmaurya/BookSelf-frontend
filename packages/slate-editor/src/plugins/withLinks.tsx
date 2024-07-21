import { Editor as SlateEditor } from "slate";
import { NodeType } from "../types";

export const withLinks = (editor: SlateEditor) => {
  const { isInline } = editor;

  editor.isInline = (element) =>
    element.type === NodeType.LINK ? true : isInline(element);

  return editor;
};
