import { NodeType } from "../../../types";
import { Editor as SlateEditor, Element as SlateElement } from "slate";

export const isListActive = (editor: SlateEditor) => {
    const [match] = SlateEditor.nodes(editor, {
      match: (n) => SlateElement.isElement(n) && n.type === NodeType.LIST_ITEM
    });
    return !!match;
  }