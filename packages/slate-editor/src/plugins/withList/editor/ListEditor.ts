import {
  Element,
  Editor as SlateEditor,
  Transforms as SlateTransforms,
  Transforms,
} from "slate";
import { NodeType } from "../../../types";
import { ReactEditor } from "slate-react";

export const ListEditor = {
  initializeList(editor: SlateEditor, type: NodeType, text: string = "") {
    const [match] = SlateEditor.nodes(editor, {
      match: (n) => n.type === NodeType.PARAGRAPH && Element.isElement(n),
      mode: "lowest",
    });

    const currentPath = ReactEditor.findPath(editor, match[0]);

    Transforms.removeNodes(editor, {
      match: (n) => n.type === NodeType.PARAGRAPH && Element.isElement(n),
      at: currentPath
    });
    SlateTransforms.insertNodes(editor, {
      type: (type as NodeType.ORDERED_LIST) || NodeType.UNORDERED_LIST,
      children: [
        {
          type: NodeType.LIST_ITEM,
          children: [
            {
              type: NodeType.PARAGRAPH,
              align: "left",
              children: [...match[0].children],
            },
          ],
        },
      ],
    }, {
      at: currentPath
    });
  },
  insertListItem(editor: SlateEditor) {
    SlateTransforms.insertNodes(
      editor,
      {
        type: NodeType.LIST_ITEM,
        children: [
          {
            type: NodeType.PARAGRAPH,
            align: "left",
            children: [
              {
                type: "text",
                text: "",
                fontSize: 16,
              },
            ],
          },
        ],
      },
      {
        match: (n) => n.type === NodeType.LIST_ITEM,
      }
    );
  },
};
