import { Element, Path, Editor, Transforms } from "slate";
import { ListType } from "./types";

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
        match: (n) => Element.isElement(n) && (n).type === ListType.LIST_ITEM,
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
    const [currentList] = Editor.nodes(editor, {
      match: (n) => Element.isElement(n) && (n.type === (ListType.UNORDERED_LIST || ListType.ORDERED_LIST)),
      mode: "lowest",
    });
    const from = currentList[1];
    const parentListItem = Editor.parent(editor, from);

    if ( Element.isElement(parentListItem[0]) && parentListItem[0].type === ListType.LIST_ITEM && parentListItem) {
      Transforms.unwrapNodes(editor, {
        match: (n) => Element.isElement(n) &&
          (n.type === ListType.UNORDERED_LIST || n.type === ListType.ORDERED_LIST),
      })

      Transforms.moveNodes(editor, {
        at: from,
        to: Path.next(parentListItem[1])
      })
    }
  }
};
