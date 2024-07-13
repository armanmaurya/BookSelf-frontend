import { NodeType } from "@/components/slate/types";
import {
  Transforms as SlateTransforms,
  Editor as SlateEditor,
  Path as SlatePath,
  Element as SlateElement,
  Node as SlateNode,
  Range as SlateRange,
} from "slate";
import { ReactEditor, Slate } from "slate-react";
import { toggleList } from "./toggleList";
import { outdentList } from "./outdentList";

export const deleteListItem = (editor: SlateEditor) => {
  if (editor.selection) {
    if (!SlateRange.isCollapsed(editor.selection)) {
      SlateTransforms.delete(editor, { at: editor.selection });

    } else {
      console.log("Delete list item");
      const [currentListItem] = SlateEditor.nodes(editor, {
        match: (n) => n.type === NodeType.LIST_ITEM,
        mode: "lowest",
      });
      const beforeLeaf = SlateEditor.before(editor, currentListItem[1]);

      const nestedList = isNestedList(currentListItem[0] as SlateNode);
      if (nestedList) {
        const previousNodeChildPath = getPreviousNodeChildPath(
          editor,
          currentListItem[1]
        );

        if (previousNodeChildPath) {
          SlateTransforms.moveNodes(editor, {
            at: ReactEditor.findPath(editor, nestedList),
            to: SlatePath.next(previousNodeChildPath),
          });
        }
      }

      const [parentList] = SlateEditor.parent(editor, currentListItem[1]);

      if (parentList.children.length > 1) {
        SlateTransforms.removeNodes(editor, {
          at: currentListItem[1],
        });
        if (beforeLeaf) {
          SlateTransforms.select(editor, beforeLeaf);
        } else {
          SlateTransforms.select(editor, SlateEditor.start(editor, []));
        }
      } else {
        outdentList(editor);
      }
    }
  }
};

function isNestedList(node: SlateNode) {
  if (SlateElement.isElement(node)) {
    const lastChild: SlateNode = node.children[node.children.length - 1];
    if (
      lastChild.type === NodeType.ORDERED_LIST ||
      lastChild.type === NodeType.UNORDERED_LIST
    ) {
      return lastChild;
    }
  }

  return null;
}

function getPreviousNodeChildPath(
  editor: SlateEditor,
  path: SlatePath
): SlatePath | null {
  try {
    const previousPath = SlatePath.previous(path);
    const previousNode = SlateEditor.node(editor, previousPath);
    if (SlateElement.isElement(previousNode[0])) {
      return ReactEditor.findPath(
        editor,
        previousNode[0].children[previousNode[0].children.length - 1]
      );
    }
  } catch (error) {
    console.log("No previous node found.");
  }

  return null;
}
