import { SlateCustomEditor } from "../utils/customEditor";
import { Editor as SlateEditor, Transforms, Node as SlateNode } from "slate";
import { NodeType } from "../types";

export const withPaste = (editor: SlateEditor) => {
  const { insertData } = editor;

  editor.insertData = (data: DataTransfer) => {
    console.log(data);

    const text = data.getData("text/plain");
    const htmltext = data.getData("text/html");
    console.log(htmltext);

    const isCodeBlockActive = SlateCustomEditor.isCodeBlockActive(editor);

    if (isCodeBlockActive) {
      const textList = text.split(/\r?\n/);
      textList.forEach((text) => {
        Transforms.insertText(editor, text);
        Transforms.insertText(editor, "\n");
      });

      return;
    }

    if (text) {
      const textlist = text.split(/\r?\n\r?\n/);

      let fragement: SlateNode[] = [];
      textlist.forEach((text) => {
        fragement.push({
          type: NodeType.PARAGRAPH,
          children: [{ text }],
          align: "left",
        });
      });

      Transforms.insertFragment(editor, fragement);

      return;
    }

    insertData(data);
  };

  return editor;
};
