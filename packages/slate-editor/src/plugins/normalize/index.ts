import { Editor } from "slate";
import { NodeType } from "../../types";

export const withNormalize = (editor: Editor) => {
  const { normalizeNode } = editor;

  editor.normalizeNode = ([node, path]) => {
    // Editor always have one Child node
    if (editor.children.length === 0) {
        console.log("Nunned")
      Editor.insertNode(editor, {
        type: NodeType.PARAGRAPH,
        align: "left",
        children: [{ text: "", type: "text"}],
      });
    }

    normalizeNode([node, path]);
  };

  return editor;
};
