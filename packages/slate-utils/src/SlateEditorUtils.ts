import { Editor, Transforms, Element, Node, NodeMatch } from "slate";

export const SlateEditorUtils = {
  replaceBlock: (editor: Editor, match: NodeMatch<Node>, to: Node) => {
    if (editor.selection) {
      const currentSelection = editor.selection.anchor;
      Transforms.insertNodes(editor, to);
      Transforms.removeNodes(editor, {
        at: currentSelection.path,
        mode: "highest",
        match: match,
      });
    }
  },
};
