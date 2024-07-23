import { NodeType } from "../../../types";
import { Editor as SlateEditor, Element as SlateElement, Path as SlatePath } from "slate";
import { ReactEditor } from "slate-react";

export const getIndentPath = (editor: SlateEditor) => {
  const [match] = SlateEditor.nodes(editor, {
    match: (n) =>
      SlateElement.isElement(n) &&
      (n.type === NodeType.UNORDERED_LIST || n.type === NodeType.ORDERED_LIST),
    mode: "lowest",
  });

  if (!match) {
    return false;
  }

  const [currentListItem] = SlateEditor.nodes(editor, {
    match: (n) => n.type === NodeType.LIST_ITEM,
    mode: "lowest",
  });

  let beforeNode;
  try {
    const beforeNodePath = SlatePath.previous(currentListItem[1]);
    beforeNode = SlateEditor.node(editor, beforeNodePath);
  } catch (error) {
    console.log("No Before Node");
  }

  if (
    beforeNode &&
    beforeNode[0].type === NodeType.LIST_ITEM &&
    SlateElement.isElement(beforeNode[0])
  ) {
    return {
      type: match[0].type as string,
      from: currentListItem[1],
      to: SlatePath.next(
        ReactEditor.findPath(
          editor,
          beforeNode[0].children[beforeNode[0].children.length - 1]
        )
      ),
    };
  }
};
