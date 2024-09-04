import { Node, Editor as SlateEditor, Transforms } from "slate";
import { ParagraphElementType } from "../types/element";
export const ParagraphEditor = {
  toggleMark(editor: SlateEditor, format: string) {
    const isActive = ParagraphEditor.isMarkActive(editor, format);
    if (isActive) {
      SlateEditor.removeMark(editor, format);
    } else {
      SlateEditor.addMark(editor, format, true);
    }
  },
  isMarkActive(editor: SlateEditor, format: string) {
    const marks = SlateEditor.marks(editor);
    // console.log(marks)
    // return marks marks?.type==="text" ? marks[format as keyof typeof marks]
    if (marks) {
      const value = marks[format as keyof typeof marks]
      console.log(value)
      return value === true

    }
    // return marks ? marks[format as keyof typeof marks] === true : false;
    return false
  },
  
  insertNewLine(editor: SlateEditor) {
    Transforms.insertText(editor, "\n");
  },

  insertParagraph(editor: SlateEditor) {
    Transforms.insertNodes(
      editor,
      {
        type: "text",
        children: [{
          text: "", type: "text"
        }],
        align: "left"
      }
    )
  }
};

