"use client";
import {
  Element,
  Path,
  Editor,
  Transforms,
  Range,
  Node,
  EditorNodesOptions,
} from "slate";
import { NodeType } from "@bookself/slate-editor/src/types";
import { ReactEditor } from "slate-react";


export const ListEditor = {
  // Insert a new list item with the given children
  insertListItem(editor: Editor, children: any) {
    Transforms.insertNodes(
      editor,
      {
        type: NodeType.LIST_ITEM,
        children: children,
      },
      {
        match: (n) => Element.isElement(n) && n.type === NodeType.LIST_ITEM,
      }
    );
  },

  // Indent the current list item
  indentListItem(editor: Editor) {
    const [currentListItem] = Editor.nodes(editor, {
      match: (n) => Element.isElement(n) && n.type === NodeType.LIST_ITEM,
      mode: "lowest",
    });

    const fromPath = currentListItem[1];
    if (Path.hasPrevious(fromPath)) {
      const previousListItemPath = Path.previous(fromPath);
      const previousListItemChildLength = (
        Editor.node(editor, previousListItemPath)[0] as Element
      ).children.length;

      const toPath = [...previousListItemPath, previousListItemChildLength];
      // Wrap the current list item in a new unordered list
      Transforms.wrapNodes(
        editor,
        {
          type: NodeType.UNORDERED_LIST,
          children: [],
        },
        {
          match: (n) => Element.isElement(n) && n.type === NodeType.LIST_ITEM,
        }
      );

      // Move the current list item to the new position
      Transforms.moveNodes(editor, {
        at: fromPath,
        to: toPath,
      });

      // -------------- Operations after moving Nodes -----------------------------

      // If the previous node is also the List then merge it with current
      const previousNode = Editor.node(editor, Path.previous(toPath));
      if (Element.isElement(previousNode[0]) && previousNode[0].type === NodeType.UNORDERED_LIST) {
        Transforms.mergeNodes(editor, {
          at: toPath,
        });
      }
      
      // -----------------------Operations For Moving Children----------------------
      // TO-DO implement is later
    }

    // // Merge the current list item with the previous

    // outdentChildren(toPath);
  },

  // Outdent the current list item
  outdentListItem(editor: Editor) {
    const [currentListItem] = Editor.nodes(editor, {
      at: editor.selection?.anchor,
      match: (n) => Element.isElement(n) && n.type == NodeType.LIST_ITEM,
      mode: "lowest",
    });

    const currentListItemPath = currentListItem[1];
    const currentList = Editor.parent(editor, currentListItemPath);
    const parentListItem = Editor.parent(editor, currentList[1]);

    // If there is no parent list item, cannot outdent further
    if (
      !parentListItem ||
      !Element.isElement(parentListItem[0]) ||
      parentListItem[0].type !== NodeType.LIST_ITEM
    ) {
      console.log("Cannot outdent further");
      return;
    }

    const lastListItemPath = ReactEditor.findPath(
      editor,
      currentList[0].children[currentList[0].children.length - 1]
    );

    if (Element.isElement(currentList[0])) {
      if (!Path.equals(currentListItemPath, lastListItemPath)) {
        const range: Range = {
          anchor: { path: Path.next(currentListItemPath), offset: 0 },
          focus: { path: lastListItemPath, offset: 0 },
        };

        // Wrap the range of nodes in a new list
        Transforms.wrapNodes(
          editor,
          {
            type: currentList[0].type as NodeType.ORDERED_LIST | NodeType.UNORDERED_LIST,
            children: [],
          },
          {
            at: Range.isCollapsed(range) ? lastListItemPath : range,
          }
        );

        // Move the wrapped nodes to the current list item
        Transforms.moveNodes(editor, {
          at: Path.next(currentListItemPath),
          to: [...currentListItemPath, 1],
        });
      }
    }

    // Move the current list item to the parent list
    Transforms.moveNodes(editor, {
      at: currentListItemPath,
      to: Path.next(parentListItem[1]),
    });

    // Remove the current list if it is empty
    if (!Path.hasPrevious(currentListItemPath)) {
      Transforms.removeNodes(editor, {
        at: currentList[1],
        match: (n) =>
          Element.isElement(n) && n.type === (currentList[0] as Element).type,
      });
    }
  },
};
