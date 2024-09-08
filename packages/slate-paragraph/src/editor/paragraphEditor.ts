import { Element as SlateElement, Node, Path, Editor as SlateEditor, Transforms, marks, Text, Range, Location, BasePoint, BaseRange, node } from "slate";
import { ParagraphElementType, ParagraphType } from "../types/element";
import { ReactEditor } from "slate-react";
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
      const value = marks[format as keyof typeof marks];
      // console.log(value);
      return value === true;
    }
    // return marks ? marks[format as keyof typeof marks] === true : false;
    return false;
  },

  insertNewLine(editor: SlateEditor) {
    Transforms.insertText(editor, "\n");
  },

  insertParagraph(editor: SlateEditor) {
    Transforms.insertNodes(editor, {
      type: "text",
      children: [
        {
          text: "",
          type: "text",
          fontSize: 16,
        },
      ],
      align: "left",
    });
  },
  string(editor: SlateEditor): string {
    if (editor.selection) {
      return SlateEditor.string(
        editor,
        Path.parent(editor.selection.anchor.path)
      );
    }
    return "";
  },
  alignNode(
    editor: SlateEditor,
    align: "left" | "center" | "right" | "justify"
  ) {
    const [match] = SlateEditor.nodes(editor, {
      match: (n) => SlateElement.isElement(n) && n.type === ParagraphType
    })
    if (!match) {
      return;
    }
    Transforms.setNodes(
      editor,
      {align}, {
        match: (n) => SlateElement.isElement(n) && SlateEditor.isBlock(editor, n) && n.type === ParagraphType
      }
    )
  },
  increaseFontSize(editor: SlateEditor) {
    if (editor.selection) {
      if (Range.isExpanded(editor.selection)) {
        const nodes = SlateEditor.nodes(editor, {
          match: (n) => Text.isText(n)
        })
        const getAnchoroffset = (currentPath: Path, editor: SlateEditor) => {
          if (editor.selection) {
            if (Path.equals(currentPath, editor.selection.anchor.path)) {
              return editor.selection.anchor.offset
            }  
            return 0
          }
        }
        const getFocusOffset = (currentPath: Path, editor: SlateEditor, text: string) => {
          if (editor.selection) {
            if (Path.equals(currentPath, editor.selection.focus.path)) {
              return editor.selection.focus.offset
            }
            return text.length
          }
        }
        for (let node of nodes) {
          if (node[0].type === ParagraphType) {
            // const anchor: BasePoint = {
            //   path: node[1],
            //   offset:  getAnchoroffset(node[1], editor) as number 
            // }
            // const focus: BasePoint = {
            //   path: node[1],
            //   offset: getFocusOffset(node[1], editor, node[0].text) as number
            // }
            // let selection:Range = {
            //   anchor: anchor,
            //   focus: focus
            // }
            // console.log(ReactEditor.findPath(editor))
            // console.log("Selection",editor.selection, selection)
            Transforms.setNodes(editor, {
              fontSize: node[0].fontSize + 1
            }, {
              match: (n) => Text.isText(n),
              
              split: true
            })
          }
        }
      }
    }
  },
  decreaseFontSize(editor: SlateEditor) {
    if (editor.selection) {
      if (Range.isExpanded(editor.selection)) {
        const nodes = SlateEditor.nodes(editor, {
          match: (n) => Text.isText(n)
        })
        for (let node of nodes) {
          if (node[0].type === ParagraphType) {
            const anchor: BasePoint = {
              path: node[1],
              offset: Path.equals(node[1], editor.selection.anchor.path) ? editor.selection.anchor.offset : 0
            }
            const focus: BasePoint = {
              path: node[1],
              offset: Path.isAfter(node[1], editor.selection.focus.path) ? node[0].text.length : editor.selection.focus.offset
            }
            let selection:Range = {
              anchor: anchor,
              focus: focus
            }
            Transforms.setNodes(editor, {
              fontSize: node[0].fontSize - 1
            }, {
              at: selection,
              match: (n) => Text.isText(n),
              split: true,
            })
          }
        }
      } else {

      }

    }
    // if (marks) {
    //   let currentFontSize: number = marks["fontSize" as keyof typeof marks]
    //   if (!currentFontSize) {
    //     currentFontSize = 16
    //   }
    //   SlateEditor.addMark(editor, "fontSize", (currentFontSize - 1))
    // }
  },

  setFontSize(editor: SlateEditor, size: number) {
    SlateEditor.addMark(editor, "fontSize", size);
  },
  getFontSize(editor: SlateEditor) {
    if (editor.selection) {
      const marks = SlateEditor.marks(editor)
      console.log(marks)
      if (Path.equals(editor.selection.anchor.path, editor.selection.focus.path)) {
        if (marks) {
          // const currentFontSize: number = marks["fontSize" as keyof typeof marks]
          // return currentFontSize
    
        }
      }
      return ""
    }
    
  }
};
