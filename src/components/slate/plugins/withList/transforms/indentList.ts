import { NodeType } from "@/components/slate/types";
import {
  Transforms as SlateTransforms,
  Editor as SlateEditor,
  Path as SlatePath,
} from "slate";

export const indentList = (
  editor: SlateEditor,
  to: SlatePath,
  from: SlatePath,
  type: string
) => {
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
  SlateTransforms.moveNodes(editor, {
    at: from,
    to: to,
    // match: (n) => n.type === NodeType.LIST_ITEM,
  });
};
