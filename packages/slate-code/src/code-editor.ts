import {
  BaseEditor,
  Path,
  Range,
  Editor as SlateEditor,
  Element as SlateElement,
  Transforms,
} from "slate";
import { CodeElementType, CodeType } from "./types/element";

export interface CodeEditor extends BaseEditor {
  insertCode: (editor: SlateEditor, type: string, initialText?: string) => void;
  isCodeActive: (editor: SlateEditor) => boolean;
  codeText: (editor: SlateEditor) => string;
}

export const CodeEditor = {
  insertCode(editor: SlateEditor, type: string, initialText: string = "") {
    if (!editor.selection) {
      return;
    }

    Transforms.insertNodes(editor, {
      type: CodeType.Code,
      children: [
        {
          text: initialText,
        },
      ],
      language: "",
    } as CodeElementType);
  },
  isCodeActive(editor: SlateEditor) {
    const [match] = SlateEditor.nodes(editor, {
      match: (n) =>
        SlateElement.isElement(n) && (n as CodeElementType).type === "code",
    });

    return !!match;
  },
  codeText(editor: SlateEditor) {
    return getText(editor);
  },
};

const getText = (editor: SlateEditor) => {
  if (editor.selection) {
    let text = "";
    const nodes = SlateEditor.nodes(editor, {
      at: editor.selection,
      match: (n) => SlateElement.isElement(n),
      mode: "lowest",
    });

    for (const node of nodes) {
      console.log(Path.parent(Range.edges(editor.selection)[1].path), node[1]);
      if (
        !(
          Path.equals(
            Path.parent(Range.edges(editor.selection)[1].path),
            node[1]
          ) && Range.edges(editor.selection)[1].offset === 0
        )
      ) {
        // console.log("Here");
        text += SlateEditor.string(editor, node[1]);
        text += "\n";
      }
    }

    return text;
  }
};
