import { NodeType } from "../../../types";
import {
  Transforms as SlateTransforms,
  Editor as SlateEditor,
  Path as SlatePath,
  Element as SlateElement,
  Node as SlateNode,
  Editor,
} from "slate";
import { ReactEditor } from "slate-react";

export const indentList = (
  editor: SlateEditor,
  to: SlatePath,
  from: SlatePath,
  type: string
) => {
  const [currentListItem] = SlateEditor.nodes(editor, {
    match: (n) => n.type === NodeType.LIST_ITEM,
    mode: "lowest",
  });

  if (SlateElement.isElement(currentListItem[0])) {
    const lastChild: SlateNode =
      currentListItem[0].children[currentListItem[0].children.length - 1];
    if (
      lastChild.type === NodeType.ORDERED_LIST ||
      lastChild.type === NodeType.UNORDERED_LIST
    ) {
      const listPath = ReactEditor.findPath(editor, lastChild);
      const toInsertPath = SlatePath.next(currentListItem[1]);
      // SlateTransforms.moveNodes(editor, {
      //   at: listPath,
      //   to: toInsertPath,
      // });

      // const listNodeAfterMove = SlateEditor.node(editor, toInsertPath)
      // SlateTransforms.moveNodes(editor, {
      //   at: currentListItem[1],
      //   to: [...toInsertPath, 0],
      // });

      // SlateTransforms.wrapNodes(
      //   editor,
      //   {
      //     type: NodeType.LIST_ITEM,
      //     children: [],
      //   },
      //   {
      //     match: (n) =>
      //       n.type === NodeType.ORDERED_LIST ||
      //       n.type === NodeType.UNORDERED_LIST,
      //   }
      // );

      SlateTransforms.mergeNodes(editor, {
        at: currentListItem[1],
      })

      return;
    }
  }

  SlateTransforms.wrapNodes(
    editor,
    {
      type: type as NodeType.UNORDERED_LIST | NodeType.ORDERED_LIST,
      children: [],
    },
    {
      match: (n) => n.type === NodeType.LIST_ITEM,
    }
  );
  console.log("from", from, "to", to)
  console.log(Editor.node(editor, from))
  console.log(Editor.node(editor, to))
  // SlateTransforms.moveNodes(editor, {
  //   at: from,
  //   to: to,
  //   // match: (n) => n.type === NodeType.LIST_ITEM,
  // });
};
