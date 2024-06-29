import { SlateCustomEditor } from "../utils";
import { Editor as SlateEditor, Transforms, Node as SlateNode } from "slate";
import { NodeType } from "../types";



export const withPaste = (editor: SlateEditor) => {
    const { insertData } = editor;
  
    editor.insertData = (data: DataTransfer) => {
      console.log(data);
  
      const text = data.getData("text/plain");
      const isCodeBlockActive = SlateCustomEditor.isCodeBlockActive(editor);
  
      if (isCodeBlockActive) {
        console.log("inserting Code");
        const textList = text.split(/\r?\n/);
        textList.forEach((text) => {
          Transforms.insertText(editor, text);
          Transforms.insertText(editor, "\n");
        });
  
        return;
      }
  
      if (text) {
        console.log("Inserting Text");
        console.log("Text", text);
  
        const textlist = text.split(/\r?\n\r?\n/);
        console.log(textlist);
  
        let fragement: SlateNode[] = [];
        textlist.forEach((text) => {
          fragement.push({
            type: NodeType.PARAGRAPH,
            children: [{ text }],
            align: "left",
          });
        });
  
        Transforms.insertFragment(editor, fragement);
  
        // Transforms.insertNodes(editor)
        return;
      }
  
      insertData(data);
    };
  
    return editor;
  };