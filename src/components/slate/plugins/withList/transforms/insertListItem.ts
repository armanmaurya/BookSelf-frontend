import { NodeType } from "@/components/slate/types";
import {
  Transforms as SlateTransforms,
  Editor as SlateEditor,
  Path as SlatePath,
  Element as SlateElement,
  Node as SlateNode,
} from "slate";
import { ReactEditor } from "slate-react";

export const insertListItem = (editor: SlateEditor) => {
  const { selection } = editor;
  if (selection) {
    const [currentListItem] = SlateEditor.nodes(editor, {
      match: (n) => n.type === NodeType.LIST_ITEM,
      mode: "lowest",
    });

    const nextNode = SlatePath.next(currentListItem[1]);
    SlateTransforms.insertNodes(
      editor,
      {
        type: NodeType.PARAGRAPH,
        align: "left",
        children: [{ text: "" }],
      },
      {
        at: nextNode,
        select: true,
      }
    );

    SlateTransforms.wrapNodes(editor, {
      type: NodeType.LIST_ITEM,
      children: [],
    });
    if (SlateElement.isElement(currentListItem[0])) {
      const lastChild: SlateNode =
        currentListItem[0].children[currentListItem[0].children.length - 1];

      if (
        lastChild.type === NodeType.ORDERED_LIST ||
        lastChild.type === NodeType.UNORDERED_LIST
      ) {
        const lastNodePath = ReactEditor.findPath(editor, lastChild);

        const [newInsertedListItemParagraphNode] = SlateEditor.nodes(editor, {
          match: (n) => n.type === NodeType.PARAGRAPH,
          mode: "lowest",
        });

        SlateTransforms.moveNodes(editor, {
            at: lastNodePath,
            to: SlatePath.next(newInsertedListItemParagraphNode[1]),
            mode: "lowest",
        })
      }
    }
  }
};
