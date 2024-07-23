import { NodeType } from "../../../types";
import { SlateCustomEditor } from "../../../utils";
import {
  Transforms as SlateTransforms,
  Editor as SlateEditor,
  Path as SlatePath,
  Location as SlateLocation,
  Element as SlateElement,
  Transforms,
  Range,
} from "slate";
import { ReactEditor } from "slate-react";
import { toggleList } from "./toggleList";

export const outdentList = (editor: SlateEditor) => {
  const [currentListItem] = SlateEditor.nodes(editor, {
    match: (n) => n.type === NodeType.LIST_ITEM,
    mode: "lowest",
  });

  
  const parentList = SlateEditor.parent(editor, currentListItem[1]);
  const parentListItem = SlateEditor.parent(editor, parentList[1]);

  if (parentListItem[0].type === NodeType.LIST_ITEM) {
    if (SlateElement.isElement(parentList[0])) {
      const lastListItemPath = ReactEditor.findPath(
        editor,
        parentList[0].children[parentList[0].children.length - 1]
      );

      if (!SlatePath.equals(currentListItem[1], lastListItemPath)) {
        var range: Range = {
          anchor: {
            path: SlatePath.next(currentListItem[1]),
            offset: 0,
          },
          focus: {
            path: lastListItemPath,
            offset: 0,
          },
        };

        SlateTransforms.wrapNodes(
          editor,
          {
            type: parentList[0].type as
              | NodeType.ORDERED_LIST
              | NodeType.UNORDERED_LIST,
            children: [],
          },
          {
            at: Range.isCollapsed(range) ? lastListItemPath : range,
          }
        );
        if (SlateElement.isElement(currentListItem[0])) {
          const lastNodePath = ReactEditor.findPath(
            editor,
            currentListItem[0].children[currentListItem[0].children.length - 1]
          );
          SlateTransforms.moveNodes(editor, {
            at: SlatePath.next(currentListItem[1]),
            to: SlatePath.next(lastNodePath),
          });
        }
      }

      console.log(
        ReactEditor.findPath(editor, parentList[0].children[0]),
        "currentItem",
        currentListItem[1]
      );

      const firstListItemPath = ReactEditor.findPath(
        editor,
        parentList[0].children[0]
      );

      Transforms.moveNodes(editor, {
        at: currentListItem[1],
        to: SlatePath.next(parentListItem[1]),
      });

      if (SlatePath.equals(firstListItemPath, currentListItem[1])) {
        console.log("remove parent list");
        Transforms.removeNodes(editor, {
          at: parentList[1],
        });
      }
    }
  } else {
    toggleList(editor);
  }
};
