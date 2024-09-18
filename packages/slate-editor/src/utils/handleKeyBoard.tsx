import { SlateCustomEditor } from ".";
import {
  Path,
  Editor as SlateEditor,
  Element as SlateElement,
  Transforms,
  Range as SlateRange,
} from "slate";
import { NodeType } from "../types";
import { getIndentPath } from "../plugins/withList/queries/getIndentPath";
import { indentList } from "../plugins/withList/transforms/indentList";
import { insertListItem } from "../plugins/withList/transforms/insertListItem";
import { outdentList } from "../plugins/withList/transforms/outdentList";
import { deleteListItem } from "../plugins/withList/transforms/deleteListItem";
import { ReactEditor } from "slate-react";
import { TabEditor } from "../plugins/tab-list/tab-editor";
import { ParagraphEditor } from "@bookself/slate-paragraph";
import { ListEditor } from "../plugins/withList/editor/ListEditor";

export const handleKeyBoardFormating = (
  event: React.KeyboardEvent<HTMLDivElement>,
  editor: SlateEditor
) => {
  if (editor.selection) {
    if (event.ctrlKey && event.shiftKey) {
      const text = ParagraphEditor.string(editor);
      switch (event.key) {
        case "!":
          event.preventDefault();
          // SlateCustomEditor.toggleBlock(editor, NodeType.H1);
          // Transforms.removeNodes(editor);
          // Transforms.insertNodes(editor, {
          //   type: NodeType.H1,
          //   id: "1",
          //   align: "left",
          //   children: [{
          //     type: "default",
          //     text: text
          //   }]
          // })
          // console.log(text)
          SlateCustomEditor.toggleHeading(editor, NodeType.H1, text)
          break;
        case "@":
          event.preventDefault();
          // SlateCustomEditor.toggleBlock(editor, NodeType.H1);
          SlateCustomEditor.toggleHeading(editor, NodeType.H2, text);
          break;
        case "#":
          event.preventDefault();
          // SlateCustomEditor.toggleBlock(editor, NodeType.H1);
          SlateCustomEditor.toggleHeading(editor, NodeType.H3, text);
          break;
        case "$":
          event.preventDefault();
          // SlateCustomEditor.toggleBlock(editor, NodeType.H1);
          SlateCustomEditor.toggleHeading(editor, NodeType.H4, text);
          break;
        case "%":
          event.preventDefault();
          // SlateCustomEditor.toggleBlock(editor, NodeType.H1);
          SlateCustomEditor.toggleHeading(editor, NodeType.H5, text);
          break;
        case "^":
          event.preventDefault();
          // SlateCustomEditor.toggleBlock(editor, NodeType.H1);
          SlateCustomEditor.toggleHeading(editor, NodeType.H6, text);
          break;
        case "~":
          event.preventDefault();
          console.log("runned")
          Transforms.removeNodes(editor);
          Transforms.insertNodes(editor, {
            type: NodeType.CODE,
            children: [
              {
                text: text,
                type: "default"
              }
            ],
            language: ""

          })
          // SlateCustomEditor.toggleBlock(editor, NodeType.CODE);
          break;
        // case "b":
        //   event.preventDefault();
        //   SlateCustomEditor.toggleMark(editor, "bold");
        //   break;
        // case "i":
        //   event.preventDefault();
        //   SlateCustomEditor.toggleMark(editor, "italic");
        //   break;
        // case "u":
        //   event.preventDefault();
        //   SlateCustomEditor.toggleMark(editor, "underline");
        //   break;
        case "d":
          event.preventDefault();
          SlateCustomEditor.toggleMark(editor, "code");
          break;
        case "Enter":
          const [match] = SlateEditor.nodes(editor, {
            match: (n) =>
              SlateElement.isElement(n) && SlateEditor.isBlock(editor, n),
          });
          console.log(match[0].type)
          if (match[0].type) {
            switch (match[0].type) {
              case NodeType.CODE:
                event.preventDefault();
                SlateCustomEditor.insertParagraph(editor, NodeType.CODE);
                break;
              case NodeType.BLOCKQUOTE:
                event.preventDefault();
                // SlateCustomEditor.insertParagraph(editor, NodeType.BLOCKQUOTE);
                console.log("runned")
                ParagraphEditor.insertParagraph(editor, {
                  match: (n) => n.type === NodeType.BLOCKQUOTE
                })
                break;
            }
          }
      }
    }
  }

  if (event.ctrlKey && !event.shiftKey && event.key === "Enter") {
    const [match] = SlateEditor.nodes(editor, {
      match: (n) =>
        SlateElement.isElement(n) && SlateEditor.isBlock(editor, n),
    });
    console.log(match[0].type)
    switch (match[0].type) {
      case NodeType.BLOCKQUOTE:
        event.preventDefault();
        // SlateCustomEditor.insertParagraph(editor, NodeType.BLOCKQUOTE);
        console.log("runned")
        ParagraphEditor.insertParagraph(editor, {
          match: (n) => n.type === NodeType.BLOCKQUOTE
        })
    }
  }
  if (event.altKey) {
    switch (event.key) {
      case "Delete":
        TabEditor.removeTab(editor);
        break;
    }
  }
  if (event.shiftKey) {
    switch (event.key) {
      case "Enter":
        event.preventDefault();
        // SlateCustomEditor.insertNewLine(editor);
        break;
      case "Tab":
        event.preventDefault();
        // const outdentInfo = getOutdentPath(editor);
        outdentList(editor);
    }
  }
  if (event.key === "Tab" && !event.shiftKey) {
    // event.preventDefault();
    if (editor.selection) {
      event.preventDefault();
      const indentInfo = getIndentPath(editor);
      console.log(indentInfo)
      if (indentInfo) {
        indentList(editor, indentInfo.to, indentInfo.from, indentInfo.type);
      }
    }
  }
  if (event.key === "Backspace") {
    const [match] = SlateEditor.nodes(editor, {
      match: (n) => SlateElement.isElement(n) && SlateEditor.isBlock(editor, n),
      // mode: "lowest",
    });
    console.log(match[0].type);
    if (editor.selection) {
      const text = SlateEditor.string(editor, editor.selection.anchor.path);
      console.log(text);

      if (match[0].type && editor.selection.focus.offset === 0) {
        // If Caret is at the start of Block
        switch (match[0].type) {
          // case NodeType.PARAGRAPH:
          //   if (text.length === 0) {
          //     event.preventDefault();
          //     SlateCustomEditor.deleteNode(editor);
          //   }
          //   break;
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
            if (SlateRange.isCollapsed(editor.selection)) {
              if (text.length === 0) {
                event.preventDefault();
                deleteListItem(editor);
              } else {
                event.preventDefault();
                outdentList(editor);
              }
            } else {
              event.preventDefault();
              deleteListItem(editor);
            }
            break;
          case NodeType.ORDERED_LIST:
            if (SlateRange.isCollapsed(editor.selection)) {
              if (text.length === 0) {
                event.preventDefault();
                deleteListItem(editor);
              } else {
                event.preventDefault();
                outdentList(editor);
              }
            } else {
              event.preventDefault();
              deleteListItem(editor);
            }
            break;
          case NodeType.CODE:
            event.preventDefault();
            SlateCustomEditor.toggleBlock(editor, NodeType.CODE);
            break;
          case NodeType.BLOCKQUOTE:
            event.preventDefault();
            SlateCustomEditor.toggleBlock(editor, NodeType.BLOCKQUOTE);
            break;
          case NodeType.TABS:
            const [match] = SlateEditor.nodes(editor, {
              match: (n) =>
                SlateElement.isElement(n) && SlateEditor.isBlock(editor, n),
              mode: "lowest",
            });
            switch (match[0].type) {
              case NodeType.TAB:
                console.log("runned");
                event.preventDefault();
                if (text.length === 0) {
                  // SlateCustomEditor.deleteNode(editor);
                  // const tabPanelPath = [
                  //   ...match[1].slice(0, -2),
                  //   match[1][match[1].length - 1] + 1,
                  // ];
                  // // console.log(SlateEditor.node(editor, tabPanelPath))
                  // Transforms.removeNodes(editor, {
                  //   at: tabPanelPath,
                  //   match: (n) => n.type === NodeType.TAB_PANEL,
                  // });
                  TabEditor.removeTab(editor);
                }
                break;
              default:
                try {
                  const beforeNode = SlateEditor.node(
                    editor,
                    Path.previous(match[1])
                  );
                } catch (error) {
                  event.preventDefault();
                  // console.log("Can't Find Before Node");
                }
                break;
            }

            break;
        }
      }
    }
  }
  if (event.key === "Enter" && !event.shiftKey && !event.ctrlKey) {
    const [match] = SlateEditor.nodes(editor, {
      match: (n) => SlateElement.isElement(n) && SlateEditor.isBlock(editor, n),
      // mode: "lowest",
    });
    console.log(match[0].type);
    if (match[0].type) {
      switch (match[0].type) {
        case NodeType.H1:
          event.preventDefault();
          SlateCustomEditor.insertParagraph(editor, NodeType.H1);
          break;
        case NodeType.H2:
          event.preventDefault();
          SlateCustomEditor.insertParagraph(editor, NodeType.H2);
          break;
        case NodeType.H3:
          event.preventDefault();
          SlateCustomEditor.insertParagraph(editor, NodeType.H3);
          break;
        case NodeType.H4:
          event.preventDefault();
          SlateCustomEditor.insertParagraph(editor, NodeType.H4);
          break;
        case NodeType.H5:
          event.preventDefault();
          SlateCustomEditor.insertParagraph(editor, NodeType.H5);
          break;
        case NodeType.H6:
          event.preventDefault();
          SlateCustomEditor.insertParagraph(editor, NodeType.H6);
          break;
        case NodeType.UNORDERED_LIST:
          event.preventDefault();
          // insertListItem(editor);
          ListEditor.insertListItem(editor)
          break;
        case NodeType.ORDERED_LIST:
          event.preventDefault();
          ListEditor.insertListItem(editor)
          break;
        case NodeType.BLOCKQUOTE:
          event.preventDefault();
          // SlateCustomEditor.insertParagraph(editor, NodeType.PARAGRAPH);
          ParagraphEditor.insertParagraph(editor)
          break;
        case NodeType.CODE:
          event.preventDefault();
          SlateCustomEditor.insertNewLine(editor);
          break;
        case NodeType.PARAGRAPH:
          event.preventDefault();
          // SlateCustomEditor.insertParagraph(editor, NodeType.TEXT);
          ParagraphEditor.insertParagraph(editor);
          break;
        // case NodeType.TAB:
        //   event.preventDefault();
        //   const [currentNode] = SlateEditor.nodes(editor, {
        //     match: (n) => n.type === NodeType.TAB,
        //     mode: "lowest",
        //   });
        //   const tabsNode = SlateEditor.nodes(editor, {
        //     match: (n) => n.type === NodeType.TABS,
        //     mode: "lowest",
        //   });
        //   const currentTabPanelPath = [
        //     ...currentNode[1].slice(0, -2),
        //     currentNode[1][currentNode[1].length - 1] + 1,
        //   ];
        //   const startPath = SlateEditor.start(editor, currentTabPanelPath);
        //   Transforms.select(editor, startPath);
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

interface IHandleEnterKey {
  [key: string]: (editor: SlateEditor) => void | null;
}
