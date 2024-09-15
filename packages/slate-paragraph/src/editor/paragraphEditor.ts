import {
  Element as SlateElement,
  Node,
  Path,
  Editor as SlateEditor,
  Transforms,
  marks,
  Text,
  Range,
  Location,
  BasePoint,
  BaseRange,
  node,
} from "slate";
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
      match: (n) => SlateElement.isElement(n) && n.type === ParagraphType,
    });
    if (!match) {
      return;
    }
    Transforms.setNodes(
      editor,
      { align },
      {
        match: (n) =>
          SlateElement.isElement(n) &&
          SlateEditor.isBlock(editor, n) &&
          n.type === ParagraphType,
      }
    );
  },
  increaseFontSize(editor: SlateEditor) {
    SlateEditor.withoutNormalizing(editor, () => {
      if (editor.selection) {
        if (Range.isExpanded(editor.selection)) {
          const nodes = SlateEditor.nodes(editor, {
            match: (n) => Text.isText(n),
          });
          const rangeRef = SlateEditor.rangeRef(editor, editor.selection, {
            affinity: "inward",
          });
          const [start, end] = Range.edges(editor.selection);
          const splitMode = "highest";
          const endAtEndOfNode = SlateEditor.isEnd(editor, end, end.path);
          Transforms.splitNodes(editor, {
            match: (n) => Text.isText(n),
            at: end,
            mode: splitMode,
            always: !endAtEndOfNode,
          });
          const startAtStartOfNode = SlateEditor.isStart(
            editor,
            start,
            start.path
          );
          Transforms.splitNodes(editor, {
            at: start,
            mode: splitMode,
            match: (n) => Text.isText(n),
            always: !startAtStartOfNode,
          });

          editor.selection = rangeRef.unref()!;
          

          for (let node of nodes) {
            if (node[0].type === ParagraphType) {
              const properties: Partial<Node> = {};
              // FIXME: is this correct?
              const newProperties: Partial<Node> & { [key: string]: unknown } =
                {
                  fontSize: node[0].fontSize + 1
                };
              editor.apply({
                type: "set_node",
                path: node[1],
                properties,
                newProperties,
              });
            }
          }
        }
      }
    });
  },
  decreaseFontSize(editor: SlateEditor) {
    if (editor.selection) {
      if (Range.isExpanded(editor.selection)) {
        const nodes = SlateEditor.nodes(editor, {
          match: (n) => Text.isText(n),
        });
        for (let node of nodes) {
          if (node[0].type === ParagraphType) {
            const anchor: BasePoint = {
              path: node[1],
              offset: Path.equals(node[1], editor.selection.anchor.path)
                ? editor.selection.anchor.offset
                : 0,
            };
            const focus: BasePoint = {
              path: node[1],
              offset: Path.isAfter(node[1], editor.selection.focus.path)
                ? node[0].text.length
                : editor.selection.focus.offset,
            };
            let selection: Range = {
              anchor: anchor,
              focus: focus,
            };
            Transforms.setNodes(
              editor,
              {
                fontSize: node[0].fontSize - 1,
              },
              {
                at: selection,
                match: (n) => Text.isText(n),
                split: true,
              }
            );
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
      const marks = SlateEditor.marks(editor);
      console.log(marks);
      if (
        Path.equals(editor.selection.anchor.path, editor.selection.focus.path)
      ) {
        if (marks) {
          // const currentFontSize: number = marks["fontSize" as keyof typeof marks]
          // return currentFontSize
        }
      }
      return "";
    }
  },
};
