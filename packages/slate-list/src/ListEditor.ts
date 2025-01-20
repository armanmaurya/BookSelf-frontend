import { Element, Path, Editor, Transforms, Range, Node } from "slate";
import { ListType } from "./types";
import { ReactEditor } from "slate-react";

export const ListEditor = {
  //   initializeList(editor: Editor, type: ListType, text: string = "") {
  //     const [match] = Editor.nodes(editor, {
  //       match: (n) => n.type === ListType.PARAGRAPH && Element.isElement(n),
  //       mode: "lowest",
  //     });

  //     const currentPath = ReactEditor.findPath(editor, match[0]);

  //     Transforms.removeNodes(editor, {
  //       match: (n) => n.type === ListType.PARAGRAPH && Element.isElement(n),
  //       at: currentPath,
  //     });
  //     console.log(match[0].children.length);
  //     Transforms.insertNodes(
  //       editor,
  //       {
  //         type: (type as ListType.ORDERED_LIST) || ListType.UNORDERED_LIST,
  //         children: [
  //           {
  //             type: ListType.LIST_ITEM,
  //             children: [
  //               {
  //                 type: ListType.PARAGRAPH,
  //                 align: "left",
  //                 children: [...match[0].children],
  //               },
  //             ],
  //           },
  //         ],
  //       },
  //       {
  //         select: true,
  //         at: currentPath,
  //       }
  //     );
  //   },
  insertListItem(editor: Editor, children: any) {
    Transforms.insertNodes(
      editor,
      {
        type: ListType.LIST_ITEM,
        children: children,
      },
      {
        match: (n) => n.type === ListType.LIST_ITEM,
      }
    );
  },
  indentListItem(editor: Editor) {
    try {
      const [match] = Editor.nodes(editor, {
        match: (n) => Element.isElement(n) && n.type === ListType.LIST_ITEM,
        mode: "lowest",
      });

      const from = match[1];

      const previous = Path.previous(from);
      const to = [...previous, 1];

      Transforms.wrapNodes(
        editor,
        {
          type: ListType.UNORDERED_LIST,
          children: [],
        },
        {
          match: (n) => Element.isElement(n) && n.type === ListType.LIST_ITEM,
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
    const [currentListItem] = Editor.nodes(editor, {
      match: (n) => Element.isElement(n) && n.type == ListType.LIST_ITEM,
      mode: "lowest",
    });

    // Get the path of the current list item
    const currentListItemPath = currentListItem[1];
    const currentList = Editor.parent(editor, currentListItemPath);
    const parentListItem = Editor.parent(editor, currentList[1]);

    if (!parentListItem || parentListItem[0].type !== ListType.LIST_ITEM) {
      return;
    }

    // Get the path of the last list item in the parent list
    const lastListItemPath = ReactEditor.findPath(
      editor,
      currentList[0].children[currentList[0].children.length - 1]
    );

    // If Current list item is not the last item
    if (!Path.equals(currentListItemPath, lastListItemPath)) {
      // Construct the Range to be wraped
      const range: Range = {
        anchor: { path: Path.next(currentListItemPath), offset: 0 },
        focus: { path: lastListItemPath, offset: 0 },
      };

      Transforms.wrapNodes(
        editor,
        {
          type: currentList[0].type as
            | ListType.ORDERED_LIST
            | ListType.UNORDERED_LIST,
          children: [],
        },
        {
          at: range,
        }
      );

      // Move the below wraped list item with list to the current list item
      Transforms.moveNodes(editor, {
        at: Path.next(currentListItemPath),
        to: [...currentListItemPath, 1],
      });
    }

    // Move the current List item to the parent list

    Transforms.moveNodes(editor, {
      at: currentListItemPath,
      to: Path.next(parentListItem[1]),
    });

    // console.log("currrentPath", currentListItem[1], "lastListItem", lastListItem);
  },
};
