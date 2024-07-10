import {
  Editor as SlateEditor,
  Element as SlateElement,
  Range,
  Transforms,
} from "slate";
import { NodeType } from "../types";
import { SlateCustomEditor } from "../utils";
import { toggleList } from "./withList/transforms/toggleList";

const SHORTCUTS: { [key: string]: string } = {
  "#": NodeType.H1,
  "##": NodeType.H2,
  "###": NodeType.H3,
  "####": NodeType.H4,
  "#####": NodeType.H5,
  "######": NodeType.H6,
  "-": NodeType.UNORDERED_LIST,
  "```": NodeType.CODE,
  ">": NodeType.BLOCKQUOTE,
};

export const withShortcuts = (editor: SlateEditor) => {
  const { insertText, deleteBackward, deleteForward } = editor;

  editor.insertText = (text: string) => {
    const { selection } = editor;

    if (text.endsWith(" ") && selection && Range.isCollapsed(selection)) {
      const { anchor } = selection;
      const block = SlateEditor.above(editor, {
        match: (n) =>
          SlateElement.isElement(n) && SlateEditor.isBlock(editor, n),
      });
      const path = block ? block[1] : [];
      const start = SlateEditor.start(editor, path);
      const range = { anchor, focus: start };
      const beforeText = SlateEditor.string(editor, range) + text.slice(0, -1);
      const type = SHORTCUTS[beforeText];
      if (type) {
        Transforms.select(editor, range);

        if (!Range.isCollapsed(range)) {
          Transforms.delete(editor);
        }

        if (
          type === NodeType.ORDERED_LIST ||
          type === NodeType.UNORDERED_LIST
        ) {
          // SlateCustomEditor.toggleListBlock(editor, type);
          toggleList(editor, type);
          // SlateCustomEditor.mergePreviousAfterNodes(editor);
          return;
        }
        SlateCustomEditor.toggleBlock(editor, type);
        return;
      }
    }

    insertText(text);
  };

  return editor;
};
