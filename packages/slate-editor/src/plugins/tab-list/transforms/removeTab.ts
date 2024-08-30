import { Editor as SlateEditor, Transforms, Element as SlateElement } from "slate";
import { NodeType } from "../../../types";
function removeTab(editor: SlateEditor) {
  // Transforms.delete(editor, { reverse: true });
  Transforms.removeNodes(editor);
  const [match] = SlateEditor.nodes(editor, {
    match: (n) => SlateElement.isElement(n) && SlateEditor.isBlock(editor, n),
    mode: "lowest",
  });
  const tabPanelPath = [
    ...match[1].slice(0, -2),
    match[1][match[1].length - 1] + 1,
  ];
  // console.log(SlateEditor.node(editor, tabPanelPath))
  Transforms.removeNodes(editor, {
    at: tabPanelPath,
    match: (n) => n.type === NodeType.TAB_PANEL,
  });
}

export { removeTab };
