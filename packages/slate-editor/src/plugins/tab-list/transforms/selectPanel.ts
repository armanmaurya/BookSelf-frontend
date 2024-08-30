import { Editor as SlateEditor, Transforms } from "slate";
import { NodeType } from "../../../types";

export const selectPanel = (editor: SlateEditor) => {
  const [currentNode] = SlateEditor.nodes(editor, {
    match: (n) => n.type === NodeType.TAB,
    mode: "lowest",
  });
  const tabsNode = SlateEditor.nodes(editor, {
    match: (n) => n.type === NodeType.TABS,
    mode: "lowest",
  });
  const currentTabPanelPath = [
    ...currentNode[1].slice(0, -2),
    currentNode[1][currentNode[1].length - 1] + 1,
  ];
  const startPath = SlateEditor.start(editor, currentTabPanelPath);
  Transforms.select(editor, startPath);
};
