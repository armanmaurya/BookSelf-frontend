import { Editor, Node, Path, Transforms } from "slate";
import { CustomElement, NodeType } from "../types";

export const withKeyCommands = (editor: Editor) => {
  const { deleteBackward, insertBreak, isVoid } = editor;

  editor.deleteBackward = (...args) => {
    const { selection } = editor;
    if (selection) {
      const [parentNode, parentPath] = Editor.parent(
        editor,
        selection.focus.path
      );

      if (
        isVoid(parentNode as CustomElement) ||
        !Node.string(parentNode).length
      ) {
        Transforms.removeNodes(editor, { at: parentPath });
        deleteBackward(...args);
      } else {
        deleteBackward(...args);
      }
    }
  };

  editor.insertBreak = (...args) => {
    if (editor.selection) {
      const [parentNode, parentPath] = Editor.parent(
        editor,
        editor.selection.focus.path
      );

      if (isVoid(parentNode as CustomElement)) {
        const nextPath = Path.next(parentPath);
        Transforms.insertNodes(editor,{type: NodeType.PARAGRAPH, align:"left", children: [{text: "", type: "text"}]}, {
          at: nextPath,
          select: true,
        });
      } else {
        insertBreak(...args);
      }
    }
  };

  return editor;
};
