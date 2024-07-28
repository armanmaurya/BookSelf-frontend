import { NodeType } from "../../../types";
import {
  Editor as SlateEditor,
  Transforms as SlateTransforms,
  Path as SlatePath,
  Element as SlateElement,
  Range as SlateRange,
  BaseRange,
  Point,
} from "slate";
import { wrapList } from "./wrapList";
import { SlateCustomEditor } from "../../../utils/customEditor";
import { isListActive } from "../queries/isListActive";
// import { isListActive } from "../queries/isListActive";

export const toggleList = (editor: SlateEditor, type?: string) => {
  const { selection } = editor;
  if (selection) {
    if (SlateRange.isCollapsed(selection)) {
      // if selection is Collapsed
      const isActive = isListActive(editor);
      if (type && !isActive) {
        if (selection) {
          wrapList(editor, type);
          SlateCustomEditor.mergePreviousAfterNodes(editor, {
            match: (n) =>
              n.type === NodeType.UNORDERED_LIST ||
              n.type === NodeType.ORDERED_LIST,
            mode: "lowest",
          });

          return;
        }
      } else {
        if (editor.selection) {
          SlateCustomEditor.splitNodesDoubleEdge(editor, {
            match: (n) => n.type === NodeType.LIST_ITEM,
            mode: "lowest",
          });

          SlateTransforms.unwrapNodes(editor, {
            match: (n) => n.type === NodeType.LIST_ITEM,
            mode: "lowest",
          });

          SlateTransforms.unwrapNodes(editor, {
            match: (n) =>
              n.type === NodeType.UNORDERED_LIST ||
              n.type === NodeType.ORDERED_LIST,
            mode: "lowest",
          });

          const [currentType] = SlateEditor.nodes(editor, {
            match: (n) =>
              n.type === NodeType.UNORDERED_LIST ||
              n.type === NodeType.ORDERED_LIST,
            mode: "lowest",
          });

          if (type !== currentType?.[0].type && type) {
            wrapList(editor, type);
            SlateCustomEditor.mergePreviousAfterNodes(editor, {
              match: (n) =>
                n.type === NodeType.UNORDERED_LIST ||
                n.type === NodeType.ORDERED_LIST,
              mode: "lowest",
            });
          }
        }
      }
    } else {
      // selection is not Collapsed
      console.log("selection is not Collapsed");
      const match = SlateEditor.nodes(editor, {
        match: (n) => SlateElement.isElement(n) && n.type === NodeType.LIST_ITEM,
        mode: "lowest",
      });


      for (const ma of match) {
        console.log(ma);
      }



    }
  }
};
