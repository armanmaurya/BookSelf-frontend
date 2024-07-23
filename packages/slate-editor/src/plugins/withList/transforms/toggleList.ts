import { NodeType } from "../../../types";
import {
  Editor as SlateEditor,
  Transforms as SlateTransforms,
  Path as SlatePath,
  Element as SlateElement,
  Range as SlateRange,
  BaseRange,
  Point,
} from "slate";
import { wrapList } from "./wrapList";
import { SlateCustomEditor } from "../../../utils/customEditor";
// import { isListActive } from "../queries/isListActive";

export const toggleList = (editor: SlateEditor, type?: string) => {
  const { selection } = editor;

  if (type) {
    if (selection) {
      wrapList(editor, type);
      SlateCustomEditor.mergePreviousAfterNodes(editor, {
        match: (n) =>
          n.type === NodeType.UNORDERED_LIST ||
          n.type === NodeType.ORDERED_LIST,
        mode: "lowest",
      });

      return;
    }
  } else {
    if (editor.selection) {
      SlateCustomEditor.splitNodesDoubleEdge(editor, {
        match: (n) => n.type === NodeType.LIST_ITEM,
        mode: "lowest",
      });

      SlateTransforms.unwrapNodes(editor, {
        match: (n) => n.type === NodeType.LIST_ITEM,
        mode: "lowest",
      });

      SlateTransforms.unwrapNodes(editor, {
        match: (n) =>
          n.type === NodeType.UNORDERED_LIST ||
          n.type === NodeType.ORDERED_LIST,
        mode: "lowest",
      });
    }
  }
};
