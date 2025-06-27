import {
  Node,
  Path,
  Editor,
  Transforms,
  Text,
  Range,
  Location,
  NodeMatch,
  RangeMode,
  BaseEditor,
  Element,
} from "slate";
import { ParagraphElementType, ParagraphType } from "./types/element";
import { ReactEditor } from "slate-react";

/**
 * `ParagraphEditor` contains helpers for paragraph editing.
 */
export interface ParagraphEditor extends BaseEditor {
  toggleBold(): void;
  toggleItalic(): void;
  toggleUnderline(): void;
  insertNewLine(): void;
  insertParagraph(options?: NodeInsertNodesOptions<Node>, text?: string): void;
  // string(): string;
  alignNode(align: "left" | "center" | "right" | "justify"): void;
  increaseFontSize(): void;
  decreaseFontSize(): void;
  setFontSize(size: number): void;
  getFontSize(): number | string;
  isMarkActive(format: string): boolean;
  getAlignment(
    editor: ParagraphEditor
  ): "left" | "center" | "right" | "justify" | undefined;
}

export const ParagraphEditor = {
  getAlignment(editor: ParagraphEditor) {
    const [match] = Editor.nodes(editor, {
      match: (n) => Element.isElement(n),
    });

    if (!match) {
      return "left";
    }

    if (
      Element.isElement(match[0]) &&
      (match[0] as ParagraphElementType).type === ParagraphType
    ) {
      return (match[0] as ParagraphElementType).align;
    }
  },
  toggleMark(editor: Editor, format: string) {
    const isActive = ParagraphEditor.isMarkActive(editor, format);
    if (isActive) {
      Editor.removeMark(editor, format);
    } else {
      Editor.addMark(editor, format, true);
    }
  },

  toggleBold(editor: Editor) {
    ParagraphEditor.toggleMark(editor, "bold");
  },
  toggleItalic(editor: Editor) {
    ParagraphEditor.toggleMark(editor, "italic");
  },
  toggleUnderline(editor: Editor) {
    ParagraphEditor.toggleMark(editor, "underline");
  },
  isMarkActive(editor: Editor, format: string) {
    const marks = Editor.marks(editor);
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

  insertNewLine(editor: Editor) {
    Transforms.insertText(editor, "\n");
  },

  insertParagraph(
    editor: Editor,
    options?: NodeInsertNodesOptions<Node>,
    text?: string
  ) {
    Transforms.insertNodes(
      editor,
      {
        type: "text",
        children: [
          {
            text: text ? text : "",
            type: "text",
            fontSize: 16,
          },
        ],
        align: "left",
      } as ParagraphElementType,
      options
    );
  },
  string(editor: Editor): string {
    if (editor.selection) {
      return Editor.string(editor, Path.parent(editor.selection.anchor.path));
    }
    return "";
  },
  alignNode(
    editor: ParagraphEditor,
    align: "left" | "center" | "right" | "justify"
  ) {
    const [match] = Editor.nodes(editor, {
      match: (n) =>
        Element.isElement(n) &&
        (n as ParagraphElementType).type === ParagraphType,
    });

    if (!match) {
      return;
    }

    Transforms.setNodes(
      editor,

      { align: align } as Partial<ParagraphElementType>,
      {
        match: (n) => Element.isElement(n) && Editor.isBlock(editor, n),
      }
    );
  },
  increaseFontSize(editor: Editor) {
    Editor.withoutNormalizing(editor, () => {
      if (editor.selection) {
        if (Range.isExpanded(editor.selection)) {
          const nodes = Editor.nodes(editor, {
            match: (n) => Text.isText(n),
          });
          const rangeRef = Editor.rangeRef(editor, editor.selection, {
            affinity: "inward",
          });
          const [start, end] = Range.edges(editor.selection);
          const splitMode = "highest";
          const endAtEndOfNode = Editor.isEnd(editor, end, end.path);
          Transforms.splitNodes(editor, {
            match: (n) => Text.isText(n),
            at: end,
            mode: splitMode,
            always: !endAtEndOfNode,
          });
          const startAtStartOfNode = Editor.isStart(editor, start, start.path);
          Transforms.splitNodes(editor, {
            at: start,
            mode: splitMode,
            match: (n) => Text.isText(n),
            always: !startAtStartOfNode,
          });

          editor.selection = rangeRef.unref()!;

          for (let node of nodes) {
            if ((node[0] as any).type === ParagraphType) {
              const properties: Partial<Node> = {};
              // FIXME: is this correct?
              const newProperties: Partial<Node> & { [key: string]: unknown } =
                {
                  fontSize: (node[0] as any).fontSize + 1,
                };
              editor.apply({
                type: "set_node",
                path: node[1],
                properties,
                newProperties,
              });
            }
          }
        } else {
          const [currentNode] = Editor.nodes(editor, {
            match: (n) => Text.isText(n),
          });

          console.log(currentNode[0]);
          const old_marks = Editor.marks(editor);
          // if (old_marks) {
          //   const marks: any = {
          //     ...old_marks,
          //     ["fontSize"]: old_marks?.fontSize + 1,
          //   };
          //   console.log(marks);

          //   editor.marks = marks;
          //   editor.onChange();
          // }
        }
      }
    });
  },
  decreaseFontSize(editor: Editor) {
    Editor.withoutNormalizing(editor, () => {
      if (editor.selection) {
        if (Range.isExpanded(editor.selection)) {
          const nodes = Editor.nodes(editor, {
            match: (n) => Text.isText(n),
          });
          const rangeRef = Editor.rangeRef(editor, editor.selection, {
            affinity: "inward",
          });
          const [start, end] = Range.edges(editor.selection);
          const splitMode = "highest";
          const endAtEndOfNode = Editor.isEnd(editor, end, end.path);
          Transforms.splitNodes(editor, {
            match: (n) => Text.isText(n),
            at: end,
            mode: splitMode,
            always: !endAtEndOfNode,
          });
          const startAtStartOfNode = Editor.isStart(editor, start, start.path);
          Transforms.splitNodes(editor, {
            at: start,
            mode: splitMode,
            match: (n) => Text.isText(n),
            always: !startAtStartOfNode,
          });

          editor.selection = rangeRef.unref()!;

          for (let node of nodes) {
            if ((node[0] as any).type === ParagraphType) {
              const properties: Partial<Node> = {};
              // FIXME: is this correct?
              const newProperties: Partial<Node> & { [key: string]: unknown } =
                {
                  fontSize: (node[0] as any).fontSize - 1,
                };
              editor.apply({
                type: "set_node",
                path: node[1],
                properties,
                newProperties,
              });
            }
          }
        } else {
          const [currentNode] = Editor.nodes(editor, {
            match: (n) => Text.isText(n),
          });

          console.log(currentNode[0]);
          const old_marks = Editor.marks(editor);
          // if (old_marks) {
          //   const marks: any = {
          //     ...old_marks,
          //     ["fontSize"]: old_marks?.fontSize + 1,
          //   };
          //   console.log(marks);

          //   editor.marks = marks;
          //   editor.onChange();
          // }
        }
      }
    });
  },

  setFontSize(editor: Editor, size: number) {
    Editor.addMark(editor, "fontSize", size);
  },
  getFontSize(editor: Editor) {
    if (editor.selection) {
      const marks = Editor.marks(editor);
      console.log(marks);
      if (
        Path.equals(editor.selection.anchor.path, editor.selection.focus.path)
      ) {
        if (marks) {
          return marks["fontSize" as keyof typeof marks];
          // return currentFontSize
        }
      }
      return "";
    }
  },
};

export interface NodeInsertNodesOptions<T extends Node> {
  at?: Location;
  match?: NodeMatch<T>;
  mode?: RangeMode;
  hanging?: boolean;
  select?: boolean;
  voids?: boolean;
  batchDirty?: boolean;
}
