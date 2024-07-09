import { SlateCustomEditor } from "../utils";
import {
  Path,
  Editor as SlateEditor,
  Element as SlateElement,
  Transforms,
} from "slate";
import { NodeType } from "../types";
import { Text } from "slate";
import { ReactEditor } from "slate-react";

export const handleKeyBoardFormating = (
  event: React.KeyboardEvent<HTMLDivElement>,
  editor: SlateEditor
) => {
  if (event.ctrlKey) {
    switch (event.key) {
      case "1":
        event.preventDefault();
        SlateCustomEditor.toggleBlock(editor, NodeType.H1);
        break;
      case "2":
        event.preventDefault();
        SlateCustomEditor.toggleBlock(editor, NodeType.H2);
        break;
      case "3":
        event.preventDefault();
        SlateCustomEditor.toggleBlock(editor, NodeType.H3);
        break;
      case "4":
        event.preventDefault();
        SlateCustomEditor.toggleBlock(editor, NodeType.H4);
        break;
      case "5":
        event.preventDefault();
        SlateCustomEditor.toggleBlock(editor, NodeType.H5);
        break;
      case "6":
        event.preventDefault();
        SlateCustomEditor.toggleBlock(editor, NodeType.H6);
        break;
      case "`":
        event.preventDefault();
        SlateCustomEditor.toggleBlock(editor, NodeType.CODE);
        break;
      case "b":
        event.preventDefault();
        SlateCustomEditor.toggleMark(editor, "bold");
        break;
      case "i":
        event.preventDefault();
        SlateCustomEditor.toggleMark(editor, "italic");
        break;
      case "u":
        event.preventDefault();
        SlateCustomEditor.toggleMark(editor, "underline");
        break;
      case "d":
        event.preventDefault();
        SlateCustomEditor.toggleMark(editor, "code");
        break;
      case "Enter":
        event.preventDefault();
        SlateCustomEditor.insertParagraph(editor);
    }
  }
  if (event.shiftKey) {
    switch (event.key) {
      case "Enter":
        event.preventDefault();
        SlateCustomEditor.insertNewLine(editor);
        break;
    }
  }
  if (event.key === "Tab") {
    // event.preventDefault();
    if (editor.selection) {
      const [match] = SlateEditor.nodes(editor, {
        match: (n) =>
          SlateElement.isElement(n) && SlateEditor.isBlock(editor, n),
      });

      if (
        (match[0].type === NodeType.UNORDERED_LIST ||
          match[0].type === NodeType.ORDERED_LIST) &&
        SlateElement.isElement(match[0])
      ) {
        event.preventDefault();
        const [currentListItem] = SlateEditor.nodes(editor, {
          match: (n) => n.type === NodeType.LIST_ITEM,
        });

        let beforeNode;
        try {
          const beforeNodePath = Path.previous(currentListItem[1]);
          beforeNode = SlateEditor.node(editor, beforeNodePath);
        } catch (error) {
          console.log("No Before Node");
        }
        if (
          beforeNode &&
          beforeNode[0].type === NodeType.LIST_ITEM &&
          SlateElement.isElement(beforeNode[0])
        ) {
          const lastNodePath = ReactEditor.findPath(
            editor,
            beforeNode[0].children[beforeNode[0].children.length - 1]
          );

          const nextPath = Path.next(lastNodePath);

          Transforms.wrapNodes(
            editor, {
              type: match[0].type,
              children: [],
            }, {
              match: (n) => n.type === NodeType.LIST_ITEM,
            }
          )

          
          Transforms.moveNodes(editor, {
            at: currentListItem[1],
            to: nextPath,
          })
          

        }
      }
    }
  }
  if (event.key === "Backspace") {
    const [match] = SlateEditor.nodes(editor, {
      match: (n) => SlateElement.isElement(n) && SlateEditor.isBlock(editor, n),
    });
    if (editor.selection) {
      const text = SlateEditor.string(editor, editor.selection.anchor.path);
      if (match[0].type && editor.selection.focus.offset === 0) {
        switch (match[0].type) {
          case NodeType.PARAGRAPH:
            if (text.length === 0) {
              event.preventDefault();
              SlateCustomEditor.deleteNode(editor);
            }
            break;
          case NodeType.H1:
            if (text.length === 0) {
              event.preventDefault();
              SlateCustomEditor.deleteNode(editor);
            }
            break;
          case NodeType.H2:
            if (text.length === 0) {
              event.preventDefault();
              SlateCustomEditor.deleteNode(editor);
            }
            break;
          case NodeType.H3:
            if (text.length === 0) {
              event.preventDefault();
              SlateCustomEditor.deleteNode(editor);
            }
            break;
          case NodeType.H4:
            if (text.length === 0) {
              event.preventDefault();
              SlateCustomEditor.deleteNode(editor);
            }
            break;
          case NodeType.H5:
            if (text.length === 0) {
              event.preventDefault();
              SlateCustomEditor.deleteNode(editor);
            }
            break;
          case NodeType.H6:
            if (text.length === 0) {
              event.preventDefault();
              SlateCustomEditor.deleteNode(editor);
            }
            break;
          case NodeType.UNORDERED_LIST:
            event.preventDefault();
            SlateCustomEditor.toggleListBlock(editor);
            break;
          case NodeType.CODE:
            event.preventDefault();
            SlateCustomEditor.toggleBlock(editor, NodeType.CODE);
            break;
          case NodeType.BLOCKQUOTE:
            event.preventDefault();
            SlateCustomEditor.toggleBlock(editor, NodeType.BLOCKQUOTE);
            break;
        }
      }
    }
  }
  if (event.key === "Enter" && !event.shiftKey && !event.ctrlKey) {
    const [match] = SlateEditor.nodes(editor, {
      match: (n) => SlateElement.isElement(n) && SlateEditor.isBlock(editor, n),
    });

    if (match[0].type) {
      switch (match[0].type) {
        case NodeType.H1:
          event.preventDefault();
          SlateCustomEditor.insertParagraph(editor);
          break;
        case NodeType.H2:
          event.preventDefault();
          SlateCustomEditor.insertParagraph(editor);
          break;
        case NodeType.H3:
          event.preventDefault();
          SlateCustomEditor.insertParagraph(editor);
          break;
        case NodeType.H4:
          event.preventDefault();
          SlateCustomEditor.insertParagraph(editor);
          break;
        case NodeType.H5:
          event.preventDefault();
          SlateCustomEditor.insertParagraph(editor);
          break;
        case NodeType.H6:
          event.preventDefault();
          SlateCustomEditor.insertParagraph(editor);
          break;
        case NodeType.UNORDERED_LIST || NodeType.ORDERED_LIST:
          event.preventDefault();
          SlateCustomEditor.insertListItem(editor, match[1]);
          break;
        case NodeType.BLOCKQUOTE:
          event.preventDefault();
          SlateCustomEditor.insertNewLine(editor);
          break;
      }
    }
  }
  if (event.key === " ") {
    if (editor.selection) {
      const [match] = SlateEditor.nodes(editor, {
        match: (n) => SlateElement.isElement(n),
        mode: "lowest",
      });

      if (match[0].type === NodeType.LINK && SlateElement.isElement(match[0])) {
        console.log("matched");

        const string = match[0].children[0].text;
        if (string.length === editor.selection.focus.offset) {
          event.preventDefault();
          const nextPath = SlateEditor.next(editor);
          if (nextPath) {
            Transforms.select(editor, {
              anchor: { path: nextPath[1], offset: 0 },
              focus: { path: nextPath[1], offset: 0 },
            });
            Transforms.insertText(editor, " ");
          }
        }
      }
    }
  }
};

const handleBackspace: IHandleEnterKey = {
  paragraph: SlateCustomEditor.deleteNode,
  "heading-one": SlateCustomEditor.deleteNode,
  "heading-two": SlateCustomEditor.deleteNode,
  "heading-three": SlateCustomEditor.deleteNode,
  "heading-four": SlateCustomEditor.deleteNode,
  "heading-five": SlateCustomEditor.deleteNode,
  "heading-six": SlateCustomEditor.deleteNode,
  "list-item": SlateCustomEditor.toggleListBlock,
  // "code": SlateCustomEditor.toggleBlock( NodeType.CODE),
};

interface IHandleEnterKey {
  [key: string]: (editor: SlateEditor) => void | null;
}

const handleEnterKey: IHandleEnterKey = {
  // "list-item": SlateCustomEditor.insertListItem,
  paragraph: SlateCustomEditor.insertParagraph,
  "heading-one": SlateCustomEditor.insertParagraph,
  "heading-two": SlateCustomEditor.insertParagraph,
  "heading-three": SlateCustomEditor.insertParagraph,
  "heading-four": SlateCustomEditor.insertParagraph,
  "heading-five": SlateCustomEditor.insertParagraph,
  "heading-six": SlateCustomEditor.insertParagraph,
  code: SlateCustomEditor.insertNewLine,
  quote: SlateCustomEditor.insertNewLine,
};
