import Editor from "@/app/editor/[id]/page";
import { NodeType } from "@/app/utils";
import {
  Descendant,
  Editor as SlateEditor,
  Element as SlateElement,
  Transforms,
  isBlock,
} from "slate";
// import { CustomEditor } from "./CustomEditor";

export const SlateCustomEditor = {
  toggleBlock(editor: SlateEditor, format: string) {
    const isActive = SlateCustomEditor.isBlockActive(editor, format);
    Transforms.setNodes(
      editor,
      {
        type: isActive ? "paragraph" : format,
      },
      {
        match: (n) =>
          SlateElement.isElement(n) && SlateEditor.isBlock(editor, n),
      }
    );
    // Transforms.setNodes(editor, {
    //   type: isActive ? 'paragraph' : isList ? 'list-item' : format,
    // })
  },
  toggleMark(editor: SlateEditor, format: string) {
    const isActive = SlateCustomEditor.isMarkActive(editor, format);
    if (isActive) {
      SlateEditor.removeMark(editor, format);
    } else {
      SlateEditor.addMark(editor, format, true);
    }
  },
  isBlockActive(editor: SlateEditor, format: string) {
    const [match] = SlateEditor.nodes(editor, {
      match: (n) => SlateElement.isElement(n) && n.type === format,
    });
    return !!match;
  },
  isMarkActive(editor: SlateEditor, format: string) {
    const marks = SlateEditor.marks(editor);
    return marks ? marks[format as keyof typeof marks] === true : false;
  },

  isParagraphActive(editor: SlateEditor) {
    const [match] = SlateEditor.nodes(editor, {
      match: (n) => SlateElement.isElement(n) && n.type === "paragraph",
    });
    return !!match;
  },

  isCodeBlockActive(editor: SlateEditor) {
    const [match] = SlateEditor.nodes(editor, {
      match: (n) => SlateElement.isElement(n) && n.type === "code",
    });
    return !!match;
  },

  isOrderedListActive(editor: SlateEditor) {
    const [match] = SlateEditor.nodes(editor, {
      match: (n) =>
        SlateElement.isElement(n) && n.type === NodeType.ORDERED_LIST,
    });
    return !!match;
  },

  isUnorderedListActive(editor: SlateEditor) {
    const [match] = SlateEditor.nodes(editor, {
      match: (n) =>
        SlateElement.isElement(n) && n.type === NodeType.UNORDERED_LIST,
    });
    return !!match;
  },
  isListActive(editor: SlateEditor) {
    const [match] = SlateEditor.nodes(editor, {
      match: (n) => SlateElement.isElement(n) && n.type === NodeType.LIST_ITEM,
    });
    return !!match;
  },

  setAlignment(
    editor: SlateEditor,
    alignment: "left" | "center" | "right" | "justify"
  ) {
    const [match] = SlateEditor.nodes(editor, {
      match: (n) =>
        SlateElement.isElement(n) &&
        (n.type === NodeType.PARAGRAPH ||
          n.type === NodeType.H1 ||
          n.type === NodeType.H2 ||
          n.type === NodeType.H3 ||
          n.type === NodeType.H4 ||
          n.type === NodeType.H5 ||
          n.type === NodeType.H6),
    });

    if (!match) {
      return;
    }

    Transforms.setNodes(
      editor,
      { align: alignment },
      {
        match: (n) =>
          SlateElement.isElement(n) && SlateEditor.isBlock(editor, n),
      }
    );
  },

  toggleUnorderedListBlock(editor: SlateEditor) {
    const isActive = SlateCustomEditor.isListActive(editor);

    if (!isActive && editor.selection) {
      Transforms.setNodes(editor, {
        type: NodeType.LIST_ITEM,
      });

      Transforms.wrapNodes(editor, {
        type: NodeType.UNORDERED_LIST,
        children: [],
      });
    } else {
      if (editor.selection) {
        const before = SlateEditor.before(editor, editor.selection.anchor.path);
        const after = SlateEditor.after(editor, editor.selection.anchor.path);
        const [beforeMatch] = SlateEditor.nodes(editor, {
          match: (n) =>
            SlateElement.isElement(n) && SlateEditor.isBlock(editor, n),
          mode: "lowest",
          at: before ? before.path : editor.selection.anchor.path,
        });
        const [afterMatch] = SlateEditor.nodes(editor, {
          match: (n) =>
            SlateElement.isElement(n) && SlateEditor.isBlock(editor, n),
          mode: "lowest",
          at: after ? after.path : editor.selection.anchor.path,
        });

        if (afterMatch[0].type === NodeType.LIST_ITEM) {
          // console.log("This si runned");
          let text;
          let offset;
          if (after) {
            text = SlateEditor.string(editor, after?.path);
            // const currentText = SlateEditor.string(editor, editor.selection.anchor.path);
            if (text.length === 0) {
              offset = 1;
            } else {
              offset = after.offset;
            }
          }
          // console.log(text);

          Transforms.splitNodes(editor, {
            mode: "highest",
            at: {
              path: after ? after.path : editor.selection.anchor.path,
              offset: offset as number,
            },
          });
        }
        if (beforeMatch[0].type === NodeType.LIST_ITEM) {
          // console.log("this runned");

          let text;
          let offset;
          if (before) {
            text = SlateEditor.string(editor, before?.path);
            if (text.length === 0) {
              offset = 0;
            } else {
              offset = before.offset;
            }
          }

          Transforms.splitNodes(editor, {
            mode: "highest",
            at: {
              path: before ? before.path : editor.selection.anchor.path,
              offset: offset as number,
            },
          });
        }

        Transforms.unwrapNodes(editor);
        Transforms.setNodes(editor, {
          type: NodeType.PARAGRAPH,
        });
      }
    }
  },
  toggleOrderedListBlock(editor: SlateEditor) {
    const isActive = SlateCustomEditor.isListActive(editor);

    if (!isActive) {
      Transforms.setNodes(editor, {
        type: NodeType.LIST_ITEM,
        // children: [{ text: "some text" }],
      });
      Transforms.wrapNodes(editor, {
        type: NodeType.ORDERED_LIST,
        children: [],
      });
    } else {
      if (editor.selection) {
        const before = SlateEditor.before(editor, editor.selection.anchor.path);
        const after = SlateEditor.after(editor, editor.selection.anchor.path);
        const [beforeMatch] = SlateEditor.nodes(editor, {
          match: (n) =>
            SlateElement.isElement(n) && SlateEditor.isBlock(editor, n),
          mode: "lowest",
          at: before ? before.path : editor.selection.anchor.path,
        });
        const [afterMatch] = SlateEditor.nodes(editor, {
          match: (n) =>
            SlateElement.isElement(n) && SlateEditor.isBlock(editor, n),
          mode: "lowest",
          at: after ? after.path : editor.selection.anchor.path,
        });

        if (afterMatch[0].type === NodeType.LIST_ITEM) {
          // console.log("This si runned");
          let text;
          let offset;
          if (after) {
            text = SlateEditor.string(editor, after?.path);
            // const currentText = SlateEditor.string(editor, editor.selection.anchor.path);
            if (text.length === 0) {
              offset = 1;
            } else {
              offset = after.offset;
            }
          }
          // console.log(text);

          Transforms.splitNodes(editor, {
            mode: "highest",
            at: {
              path: after ? after.path : editor.selection.anchor.path,
              offset: offset as number,
            },
          });
        }
        if (beforeMatch[0].type === NodeType.LIST_ITEM) {
          // console.log("this runned");

          let text;
          let offset;
          if (before) {
            text = SlateEditor.string(editor, before?.path);
            if (text.length === 0) {
              offset = 0;
            } else {
              offset = before.offset;
            }
          }

          Transforms.splitNodes(editor, {
            mode: "highest",
            at: {
              path: before ? before.path : editor.selection.anchor.path,
              offset: offset as number,
            },
          });
        }

        Transforms.unwrapNodes(editor);
        Transforms.setNodes(editor, {
          type: NodeType.PARAGRAPH,
        });
      }
    }
  },

  insertLineBreak(editor: SlateEditor) {
    Transforms.insertText(editor, "\n");
  },

  insertListItem(editor: SlateEditor) {
    const isActive = SlateCustomEditor.isListActive(editor);
    if (editor.selection && isActive) {
      const text = SlateEditor.string(editor, editor.selection.focus.path);
      Transforms.insertNodes(editor, {
        type: NodeType.LIST_ITEM,
        children: [{ text: "" }],
      });
    }
  },

  insertParagraph(editor: SlateEditor) {
    // const isParagraphActive = SlateCustomEditor.isParagraphActive(editor);
    const isListItemActive = SlateCustomEditor.isOrderedListActive(editor);
    const isCodeBlockActive = SlateCustomEditor.isCodeBlockActive(editor);
    if (editor.selection && (!isListItemActive || !isCodeBlockActive)) {
      const text = SlateEditor.string(editor, editor.selection.focus.path);
      Transforms.insertNodes(
        editor,
        {
          type: NodeType.PARAGRAPH,
          children: [{ text: "" }],
          align: "left",
        },
        {
          match: (n) =>
            SlateElement.isElement(n) && SlateEditor.isBlock(editor, n),
          at: {
            path: editor.selection.anchor.path,
            offset: text.length,
          },
        }
      );

      // console.log(editor.selection.anchor.path[0] + 1, 0);
      const nextNode = SlateEditor.after(editor, editor.selection.anchor.path);
      if (nextNode) {
        Transforms.select(editor, {
          path: nextNode.path,
          offset: nextNode.offset,
        });
      }
    }
  },
};

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
      case "Enter":
        event.preventDefault();
        SlateCustomEditor.insertParagraph(editor);
      // if (SlateCustomEditor.isCodeBlockActive(editor)) {
      // }
    }
  }
  if (event.shiftKey) {
    switch (event.key) {
      case "Enter":
        event.preventDefault();
        if (SlateCustomEditor.isParagraphActive(editor)) {
          SlateCustomEditor.insertLineBreak(editor);
        }
        break;
      case "*":
        event.preventDefault();
        SlateCustomEditor.toggleUnorderedListBlock(editor);
        break;
      case "&":
        event.preventDefault();
        SlateCustomEditor.toggleOrderedListBlock(editor);
        break;
    }
  }
  if (event.key === "Enter" && !event.shiftKey && !event.ctrlKey) {
    // const isListItemActive = SlateCustomEditor.isListItemActive(editor);
    event.preventDefault();
    const [match] = SlateEditor.nodes(editor, {
      match: (n) => SlateElement.isElement(n) && SlateEditor.isBlock(editor, n),
      mode: "lowest",
    });

    if (match[0].type) {
      const shortcut = handleEnterKey[`${match[0].type}`];
      if (shortcut) {
        shortcut(editor);
      }
    }
  }
};

interface IHandleEnterKey {
  [key: string]: (editor: SlateEditor) => void;
}

export const handleEnterKey: IHandleEnterKey = {
  "list-item": SlateCustomEditor.insertListItem,
  paragraph: SlateCustomEditor.insertParagraph,
  "heading-one": SlateCustomEditor.insertParagraph,
  "heading-two": SlateCustomEditor.insertParagraph,
  "heading-three": SlateCustomEditor.insertParagraph,
  "heading-four": SlateCustomEditor.insertParagraph,
  "heading-five": SlateCustomEditor.insertParagraph,
  "heading-six": SlateCustomEditor.insertParagraph,
  code: SlateCustomEditor.insertLineBreak,
};




