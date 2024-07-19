import { NodeType } from "@/components/slate/types";
import {
  Editor as SlateEditor,
  Element as SlateElement,
  Path as SlatePath,
} from "slate";
import { ReactEditor } from "slate-react";

export const isNestedListItem = (editor: SlateEditor) => {
  const [parentList] = SlateEditor.nodes(editor, {
    match: (n) =>
      n.type === NodeType.UNORDERED_LIST || n.type === NodeType.ORDERED_LIST,
    mode: "lowest",
  });

  const [rootList] = SlateEditor.nodes(editor, {
    match: (n) =>
      n.type === NodeType.UNORDERED_LIST || n.type === NodeType.ORDERED_LIST,
  });

  if (SlatePath.equals(parentList[1], rootList[1])) {
    return false;
  }

  return true;
};
