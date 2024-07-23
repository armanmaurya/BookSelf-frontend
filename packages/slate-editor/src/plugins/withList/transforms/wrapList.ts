import { NodeType } from "../../../types";
import {
  Editor as SlateEditor,
  Transforms as SlateTransforms,
  Path as SlatePath,
  Element as SlateElement,
  Range as SlateRange,
} from "slate";

export const wrapList = (editor: SlateEditor, type: string) => {
  SlateTransforms.wrapNodes(
    editor,
    {
      type: NodeType.LIST_ITEM,
      children: [],
    },
    {
      match: (n) => n.type === NodeType.PARAGRAPH,
    }
  );

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
};
