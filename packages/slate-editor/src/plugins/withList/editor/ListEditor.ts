import { Element, Path, Editor, Transforms } from "slate";
import { NodeType } from "../../../types";
import { ReactEditor } from "slate-react";
import { outdentList } from "../transforms/outdentList";

export const ListEditor = {
  initializeList(editor: Editor, type: NodeType, text: string = "") {
    const [match] = Editor.nodes(editor, {
      match: (n) => n.type === NodeType.PARAGRAPH && Element.isElement(n),
      mode: "lowest",
    });

    const currentPath = ReactEditor.findPath(editor, match[0]);

    Transforms.removeNodes(editor, {
      match: (n) => n.type === NodeType.PARAGRAPH && Element.isElement(n),
      at: currentPath,
    });
    console.log(match[0].children.length);
    Transforms.insertNodes(
      editor,
      {
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
      },
      {
        select: true,
        at: currentPath,
      }
    );
  },
  insertListItem(editor: Editor) {
    Transforms.insertNodes(
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
  indentListItem(editor: Editor) {
    try {
      const [match] = Editor.nodes(editor, {
        match: (n) => n.type === NodeType.LIST_ITEM && Element.isElement(n),
        mode: "lowest",
      });

      const from = match[1];

      const previous = Path.previous(from);
      const to = [...previous, 1];

      Transforms.wrapNodes(
        editor,
        {
          type: NodeType.UNORDERED_LIST,
          children: [],
        },
        {
          match: (n) => n.type === NodeType.LIST_ITEM,
        }
      );
      Transforms.moveNodes(editor, {
        at: from,
        to: to,
      });
    } catch (err) {
      console.log("Cannot indent further");
    }
  },
  outdentListItem(editor: Editor) {
    const [currentList] = Editor.nodes(editor, {
      match: (n) => n.type === (NodeType.UNORDERED_LIST || NodeType.ORDERED_LIST) && Element.isElement(n),
      mode: "lowest",
    });
    const from = currentList[1];
    const parentListItem = Editor.parent(editor, from);

    if (parentListItem[0].type === NodeType.LIST_ITEM && parentListItem) {
      Transforms.unwrapNodes(editor, {
        match: (n) =>
          n.type === NodeType.UNORDERED_LIST || n.type === NodeType.ORDERED_LIST
      })

      // console.log("from", currentListItem, "to", pare)
      Transforms.moveNodes(editor, {
        at: from,
        to: Path.next(parentListItem[1])
      })
    }
  }
};
