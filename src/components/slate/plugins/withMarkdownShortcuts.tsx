import {
  Editor as SlateEditor,
  Element as SlateElement,
  Range,
  Transforms,
} from "slate";
import { NodeType } from "../types";
import { SlateCustomEditor } from "../utils";

const SHORTCUTS: { [key: string]: string } = {
  "#": "heading-one",
  "##": "heading-two",
  "###": "heading-three",
  "####": "heading-four",
  "#####": "heading-five",
  "######": "heading-six",
  "-": "unordered-list",
  "```": "code",
};

export const withShortcuts = (editor: SlateEditor) => {
  const { insertText, deleteBackward, deleteForward } = editor;

  editor.insertText = (text: string) => {
    const { selection } = editor;
    console.log(selection?.anchor.path);

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
          SlateCustomEditor.toggleListBlock(editor, type);
          return;
        }
        SlateCustomEditor.toggleBlock(editor, type);
        return;
      }
    }

    insertText(text);
  };

  // editor.deleteBackward = (...args) => {
  //   const { selection } = editor;

  //   if (selection && Range.isCollapsed(selection)) {
  //     const { anchor } = selection;
  //     const block = Editor.above(editor, {
  //       match: (n) => Element.isElement(n) && Editor.isBlock(editor, n),
  //     });
  //     const path = block ? block[1] : [];
  //     const start = Editor.start(editor, path);
  //     const range = { anchor, focus: start };

  //     const text2 = Editor.string(editor, selection.focus.path);
  //     const newText2 =
  //       text2.slice(0, selection.focus.offset - 1) +
  //       text2.slice(selection.focus.offset);
  //     // console.log("Text", newText2);

  //     const textlist = newText2.split(" ");
  //     // console.log("Text List", textlist);
  //     const type = SHORTCUTS[textlist[0]];
  //     if (type && textlist.length > 1) {
  //       SlateCustomEditor.toggleBlock(editor, type);
  //       deleteBackward(...args);
  //       return;
  //     } else {
  //       const [match] = Editor.nodes(editor, {
  //         match: (n) => n.type === "paragraph",
  //       });
  //       if (!match) {
  //         console.log("Runned");
  //         Transforms.setNodes(
  //           editor,
  //           { type: "paragraph" },
  //           { match: (n) => Element.isElement(n) && Editor.isBlock(editor, n) }
  //         );
  //       }
  //       if (match) {
  //         let rmatch;

  //         const boldRegex = /\*\*(.*?)\*\*/g; // regex to extract bold text

  //         rmatch = boldRegex.exec(newText2);
  //         if (!rmatch) {
  //           const isActive = SlateCustomEditor.isMarkActive(
  //             editor,
  //             NodeType.BOLD
  //           );
  //           deleteBackward(...args);
  //           if (isActive) {
  //             if (editor.selection) {
  //               const carotPos: number = editor.selection.anchor.offset;
  //               console.log(editor.selection?.anchor.offset);
  //               Transforms.select(editor, {
  //                 anchor: { path: anchor.path, offset: 0 },
  //                 focus: { path: anchor.path, offset: text2.length - 1 },
  //               });
  //               Editor.removeMark(editor, "bold");
  //               const text3 = Editor.string(
  //                 editor,
  //                 editor.selection.anchor.path
  //               );
  //               console.log(text3);
  //               Transforms.collapse(editor, { edge: "anchor" });
  //               Transforms.select(editor, {
  //                 path: [...editor.selection.anchor.path],
  //                 offset: editor.selection.anchor.offset + carotPos,
  //               });
  //             }
  //           }

  //           return;
  //           // while ((match = boldRegex.exec(newText2)) !== null) {
  //           //   const isActive = CustomEditor.isBoldMarkActive(editor);
  //           //   deleteBackward(...args);
  //           //   if (isActive && !match[0]) {
  //           //     const startIndex = match.index;
  //           //     const endIndex = startIndex + match[0].length;

  //           //     console.log("Transform");

  //           //     // Transforms.select(editor, {
  //           //     //   anchor: { path: anchor.path, offset:  0},
  //           //     //   focus: { path: anchor.path, offset:  },
  //           //     // });
  //           //     // Editor.addMark(editor, "bold", true);
  //           //     // Transforms.select(editor, {
  //           //     //   path: [...editor.selection.anchor.path],
  //           //     //   offset: match[0].length,
  //           //     // });
  //           //     // console.log("TRansfomed");
  //           //     return;
  //           //   }

  //           //   // console.log(`Matched text: ${match[0]}, Start index: ${startIndex}, End index: ${endIndex}`);
  //           // }
  //         }
  //       }
  //     }
  //   }
  //   deleteBackward(...args);
  // };

  // editor.deleteForward = (...args) => {
  //   const { selection } = editor;

  //   if (selection && Range.isCollapsed(selection)) {
  //     const { anchor } = selection;
  //     const block = Editor.above(editor, {
  //       match: (n) => Element.isElement(n) && Editor.isBlock(editor, n),
  //     });
  //     const path = block ? block[1] : [];
  //     const start = Editor.start(editor, path);
  //     const range = { anchor, focus: start };

  //     const text2 = Editor.string(editor, selection.focus.path);
  //     const newText2 =
  //       text2.slice(0, selection.focus.offset) +
  //       text2.slice(selection.focus.offset + 1);

  //     const textlist = newText2.split(" ");
  //     // console.log("Text List", textlist);
  //     const type = SHORTCUTS[textlist[0]];
  //     if (type && textlist.length > 1) {
  //       SlateCustomEditor.toggleBlock(editor, type);
  //     } else {
  //       const [match] = Editor.nodes(editor, {
  //         match: (n) => n.type === "paragraph",
  //       });
  //       if (!match) {
  //         Transforms.setNodes(
  //           editor,
  //           { type: "paragraph" },
  //           { match: (n) => Element.isElement(n) && Editor.isBlock(editor, n) }
  //         );
  //       }
  //     }
  //   }
  //   deleteForward(...args);
  // };

  return editor;
};
