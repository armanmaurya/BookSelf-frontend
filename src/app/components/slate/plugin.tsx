import {
  Editor,
  Element,
  Transforms,
  Range,
  Point,
  setSelection,
  Node,
} from "slate";
import { SlateCustomEditor } from "./utils";
import { NodeType } from "@/app/utils";

const SHORTCUTS: { [key: string]: string } = {
  "#": "heading-one",
  "##": "heading-two",
  "###": "heading-three",
  "####": "heading-four",
  "#####": "heading-five",
  "######": "heading-six",
  "```": "code",
};

// export const toggleBlock = (editor: Editor, type: string) => {
//   switch (type) {
//     case "heading-one":
//       const [match] = Editor.nodes(editor, {
//         match: (n) => n.type === "heading-one",
//       });
//       if (!match) {
//         SlateCustomEditor.toggleH1Block(editor);
//       }
//       break;
//     case "heading-two":
//       const [match2] = Editor.nodes(editor, {
//         match: (n) => n.type === "heading-two",
//       });
//       if (!match2) {
//         SlateCustomEditor.toggleH2Block(editor);
//       }
//       break;
//     case "heading-three":
//       const [match3] = Editor.nodes(editor, {
//         match: (n) => n.type === "heading-three",
//       });
//       if (!match3) {
//         SlateCustomEditor.toggleH3Block(editor);
//       }
//       break;
//     case "heading-four":
//       const [match4] = Editor.nodes(editor, {
//         match: (n) => n.type === "heading-four",
//       });
//       if (!match4) {
//         SlateCustomEditor.toggleH4Block(editor);
//       }
//       break;
//     case "heading-five":
//       const [match5] = Editor.nodes(editor, {
//         match: (n) => n.type === "heading-five",
//       });
//       if (!match5) {
//         SlateCustomEditor.toggleH5Block(editor);
//       }
//       break;
//     case "heading-six":
//       const [match6] = Editor.nodes(editor, {
//         match: (n) => n.type === "heading-six",
//       });
//       if (!match6) {
//         SlateCustomEditor.toggleH6Block(editor);
//       }
//       break;
//     case "code":
//       const [match7] = Editor.nodes(editor, {
//         match: (n) => n.type === "code",
//       });
//       if (!match7) {
//         SlateCustomEditor.toggleCodeBlock(editor);
//       }
//       break;
//   }
// };

export const withMarkdownShortcuts = (editor: Editor) => {
  const { insertText, deleteBackward, deleteForward } = editor;

  editor.insertText = (text1: string) => {
    const { selection } = editor;

    if (selection && Range.isCollapsed(selection)) {
      const { anchor } = selection;
      const block = Editor.above(editor, {
        match: (n) => Element.isElement(n) && Editor.isBlock(editor, n),
      });
      const path = block ? block[1] : [];
      const start = Editor.start(editor, path);

      const text2 = Editor.string(editor, selection.focus.path);
      const newText2 =
        text2.slice(0, selection.focus.offset) +
        text1 +
        text2.slice(selection.focus.offset);

      const textlist = newText2.split(" ");

      const type = SHORTCUTS[textlist[0]];
      //   console.log("type", type);
      if (type && textlist.length > 1) {
        SlateCustomEditor.toggleBlock(editor, type);
        insertText(text1);
        return;
      } else {
        const [match] = Editor.nodes(editor, {
          match: (n) => n.type === "paragraph",
        });
        if (match) {
          let match;

          const boldRegex = /\*\*(.*?)\*\*/g; // regex to extract bold text

          while ((match = boldRegex.exec(newText2)) !== null) {
            const isActive = SlateCustomEditor.isMarkActive(editor, NodeType.BOLD);
            insertText(text1);
            if (isActive) {
              return;
            }
            const startIndex = match.index;
            const endIndex = startIndex + match[0].length;
            // const carotPos:number = editor.selection.anchor.offset;

            Transforms.select(editor, {
              anchor: { path: anchor.path, offset: startIndex },
              focus: { path: anchor.path, offset: endIndex },
            });
            Editor.addMark(editor, "bold", true);
            // const text3 = Editor.string(editor, editor.selection.anchor.path);
            // Transforms.select(editor, {
            //   path: [...editor.selection.anchor.path],
            //   offset:  ,
            // });
            const somenode = Editor.above(editor, {
              match: (n) => n.type === "paragraph",
              at: {
                anchor: { path: anchor.path, offset: startIndex },
                focus: { path: anchor.path, offset: endIndex },
              },
            });
            console.log(somenode);
            console.log("TRansfomed");
            return;

            // console.log(`Matched text: ${match[0]}, Start index: ${startIndex}, End index: ${endIndex}`);
          }
        }
      }
      insertText(text1);
    }
  };

  editor.deleteBackward = (...args) => {
    const { selection } = editor;

    if (selection && Range.isCollapsed(selection)) {
      const { anchor } = selection;
      const block = Editor.above(editor, {
        match: (n) => Element.isElement(n) && Editor.isBlock(editor, n),
      });
      const path = block ? block[1] : [];
      const start = Editor.start(editor, path);
      const range = { anchor, focus: start };

      const text2 = Editor.string(editor, selection.focus.path);
      const newText2 =
        text2.slice(0, selection.focus.offset - 1) +
        text2.slice(selection.focus.offset);
      // console.log("Text", newText2);

      const textlist = newText2.split(" ");
      // console.log("Text List", textlist);
      const type = SHORTCUTS[textlist[0]];
      if (type && textlist.length > 1) {
        SlateCustomEditor.toggleBlock(editor, type);
        deleteBackward(...args);
        return;
      } else {
        const [match] = Editor.nodes(editor, {
          match: (n) => n.type === "paragraph",
        });
        if (!match) {
          console.log("Runned");
          Transforms.setNodes(
            editor,
            { type: "paragraph" },
            { match: (n) => Element.isElement(n) && Editor.isBlock(editor, n) }
          );
        }
        if (match) {
          let rmatch;

          const boldRegex = /\*\*(.*?)\*\*/g; // regex to extract bold text

          rmatch = boldRegex.exec(newText2);
          if (!rmatch) {
            const isActive = SlateCustomEditor.isMarkActive(editor, NodeType.BOLD);
            deleteBackward(...args);
            if (isActive) {
              if (editor.selection) {
                const carotPos: number = editor.selection.anchor.offset;
                console.log(editor.selection?.anchor.offset);
                Transforms.select(editor, {
                  anchor: { path: anchor.path, offset: 0 },
                  focus: { path: anchor.path, offset: text2.length - 1 },
                });
                Editor.removeMark(editor, "bold");
                const text3 = Editor.string(
                  editor,
                  editor.selection.anchor.path
                );
                console.log(text3);
                Transforms.collapse(editor, { edge: "anchor" });
                Transforms.select(editor, {
                  path: [...editor.selection.anchor.path],
                  offset: editor.selection.anchor.offset + carotPos,
                });
              }
            }

            return;
            // while ((match = boldRegex.exec(newText2)) !== null) {
            //   const isActive = CustomEditor.isBoldMarkActive(editor);
            //   deleteBackward(...args);
            //   if (isActive && !match[0]) {
            //     const startIndex = match.index;
            //     const endIndex = startIndex + match[0].length;

            //     console.log("Transform");

            //     // Transforms.select(editor, {
            //     //   anchor: { path: anchor.path, offset:  0},
            //     //   focus: { path: anchor.path, offset:  },
            //     // });
            //     // Editor.addMark(editor, "bold", true);
            //     // Transforms.select(editor, {
            //     //   path: [...editor.selection.anchor.path],
            //     //   offset: match[0].length,
            //     // });
            //     // console.log("TRansfomed");
            //     return;
            //   }

            //   // console.log(`Matched text: ${match[0]}, Start index: ${startIndex}, End index: ${endIndex}`);
            // }
          }
        }
      }
    }
    deleteBackward(...args);
  };

  editor.deleteForward = (...args) => {
    const { selection } = editor;

    if (selection && Range.isCollapsed(selection)) {
      const { anchor } = selection;
      const block = Editor.above(editor, {
        match: (n) => Element.isElement(n) && Editor.isBlock(editor, n),
      });
      const path = block ? block[1] : [];
      const start = Editor.start(editor, path);
      const range = { anchor, focus: start };

      const text2 = Editor.string(editor, selection.focus.path);
      const newText2 =
        text2.slice(0, selection.focus.offset) +
        text2.slice(selection.focus.offset + 1);

      const textlist = newText2.split(" ");
      // console.log("Text List", textlist);
      const type = SHORTCUTS[textlist[0]];
      if (type && textlist.length > 1) {
        SlateCustomEditor.toggleBlock(editor, type);
      } else {
        const [match] = Editor.nodes(editor, {
          match: (n) => n.type === "paragraph",
        });
        if (!match) {
          Transforms.setNodes(
            editor,
            { type: "paragraph" },
            { match: (n) => Element.isElement(n) && Editor.isBlock(editor, n) }
          );
        }
      }
    }
    deleteForward(...args);
  };

  return editor;
};
