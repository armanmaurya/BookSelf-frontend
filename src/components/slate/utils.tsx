import Editor from "@/app/editor/[id]/page";
import { NodeType } from "@/app/utils";
import {
  BaseRange,
  Descendant,
  Point,
  Editor as SlateEditor,
  Element as SlateElement,
  Transforms,
  Text,
  Path,
  Range,
  NodeEntry,
} from "slate";
// import { CustomEditor } from "./CustomEditor";

export const SlateCustomEditor = {
  toggleBlock(editor: SlateEditor, format: string) {
    const isActive = SlateCustomEditor.isBlockActive(editor, format);
    const { selection } = editor;
    // if (selection) {
    //   if (
    //     format === NodeType.ORDERED_LIST ||
    //     format === NodeType.UNORDERED_LIST
    //   ) {
    //     SlateCustomEditor.toggleBlock(editor, NodeType.LIST_ITEM);
    //     Transforms.wrapNodes(editor, {
    //       type: format,
    //       children: [],
    //     });
    //     const before = SlateEditor.before(editor, selection.anchor.path);
    //     const after = SlateEditor.after(editor, selection.anchor.path);
    //     let range: BaseRange | undefined;
    //     let toSelect: Point | undefined;

    //     if (before) {
    //       const [beforeMatch] = SlateEditor.nodes(editor, {
    //         match: (n) =>
    //           SlateElement.isElement(n) && SlateEditor.isBlock(editor, n),
    //         at: before ? before.path : selection.anchor.path,
    //       });

    //       if (beforeMatch[0].type === format && !Text.isText(beforeMatch[0])) {
    //         toSelect = {
    //           path: [before.path[0], beforeMatch[0].children.length, 0],
    //           offset: 0,
    //         };
    //         range = {
    //           anchor: { path: [before.path[0], 0, 0], offset: 0 },
    //           focus: {
    //             path: selection.focus.path,
    //             offset: 0,
    //           },
    //         };
    //         Transforms.select(editor, range);
    //       }
    //     }
    //     if (after) {
    //       const [afterMatch] = SlateEditor.nodes(editor, {
    //         match: (n) =>
    //           SlateElement.isElement(n) && SlateEditor.isBlock(editor, n),
    //         at: after.path,
    //       });

    //       if (afterMatch[0].type === format) {
    //         const parentNode = SlateEditor.node(
    //           editor,
    //           Path.parent(Path.parent(after.path))
    //         );

    //         if (!Text.isText(parentNode[0])) {
    //           if (range) {
    //             if (!Range.isCollapsed(range)) {
    //               Transforms.setSelection(editor, {
    //                 focus: {
    //                   path: [after.path[0], parentNode[0].children.length, 0],
    //                   offset: 1,
    //                 },
    //               });
    //             }
    //           } else {
    //             console.log("Start", selection.anchor.path, "End", parentNode);

    //             if (!Text.isText(parentNode[0])) {
    //               toSelect = {
    //                 path: [selection.anchor.path[0], 0, 0],
    //                 offset: 0,
    //               };
    //               Transforms.select(editor, {
    //                 anchor: {
    //                   path: [selection.anchor.path[0], 0, 0],
    //                   offset: 0,
    //                 },
    //                 focus: {
    //                   path: [
    //                     after.path[0],
    //                     parentNode[0].children.length - 1,
    //                     0,
    //                   ],
    //                   offset: 1,
    //                 },
    //               });
    //             }
    //           }
    //         }
    //       }
    //     }
    //     Transforms.unwrapNodes(editor, {
    //       match: (n) =>
    //         n.type === NodeType.UNORDERED_LIST ||
    //         n.type === NodeType.ORDERED_LIST,
    //     });
    //     Transforms.wrapNodes(editor, {
    //       type: format,
    //       children: [],
    //     });
    //     if (toSelect) {
    //       Transforms.select(editor, toSelect);
    //     }

    //     return;
    //   }
    // }
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

  toggleListBlock(editor: SlateEditor, format?: string) {
    const isActive = SlateCustomEditor.isListActive(editor);
    const { selection } = editor;
    if (!isActive && format) {
      if (selection) {
        const beforeNode = SlateCustomEditor.beforeNode(editor);
        const afterNode = SlateCustomEditor.afterNode(editor);
        SlateCustomEditor.toggleBlock(editor, NodeType.LIST_ITEM);
        Transforms.wrapNodes(editor, {
          type: format as NodeType.UNORDERED_LIST | NodeType.ORDERED_LIST,
          children: [],
        });
        let range: BaseRange | undefined;
        let toSelect: Point | undefined;

        if (beforeNode) {
          if (beforeNode[0].type === format && !Text.isText(beforeNode[0])) {
            console.log("this runned");

            toSelect = {
              path: [beforeNode[1][0], beforeNode[0].children.length, 0],
              offset: 0,
            };
            range = {
              anchor: { path: [beforeNode[1][0], 0, 0], offset: 0 },
              focus: {
                path: selection.focus.path,
                offset: 0,
              },
            };
            Transforms.select(editor, range);
          }
        }
        if (afterNode) {
          // const [afterMatch]: any = SlateEditor.nodes(editor, {
          //   match: (n) =>
          //     SlateElement.isElement(n) && SlateEditor.isBlock(editor, n),
          //   at: afterNode[1],
          // });
          // console.log(afterMatch);

          if (afterNode[0].type === format && !Text.isText(afterNode[0])) {
            const listLastItemLength =
              afterNode[0].children[afterNode[0].children.length - 1]
                .children[0].text.length;
            if (range) {
              if (!Range.isCollapsed(range)) {
                Transforms.setSelection(editor, {
                  focus: {
                    path: [afterNode[1][0], afterNode[0].children.length, 0],
                    offset: 1,
                  },
                });
              }
            } else {
              toSelect = {
                path: [selection.anchor.path[0], 0, 0],
                offset: 0,
              };
              Transforms.select(editor, {
                anchor: {
                  path: [selection.anchor.path[0], 0, 0],
                  offset: 0,
                },
                focus: {
                  path: [afterNode[1][0], afterNode[0].children.length - 1, 0],
                  offset: listLastItemLength,
                },
              });
            }
          }
        }
        Transforms.unwrapNodes(editor, {
          match: (n) =>
            n.type === NodeType.UNORDERED_LIST ||
            n.type === NodeType.ORDERED_LIST,
        });
        Transforms.wrapNodes(editor, {
          type: format as NodeType.UNORDERED_LIST | NodeType.ORDERED_LIST,
          children: [],
        });
        if (toSelect) {
          Transforms.select(editor, toSelect);
        }

        return;
      }
    } else {
      if (editor.selection) {
        const beforeNode = SlateCustomEditor.beforeNode(editor);

        if (beforeNode) {
          console.log(beforeNode[1]);

          if (beforeNode[0].type === NodeType.LIST_ITEM && beforeNode) {
            Transforms.splitNodes(editor, {
              at: Path.next(beforeNode[1]),
            });
          }
        }
        const afterNode = SlateCustomEditor.afterNode(editor);

        if (afterNode) {
          if (afterNode[0].type === NodeType.LIST_ITEM && afterNode) {
            Transforms.splitNodes(editor, {
              at: afterNode[1],
            });
          }
        }

        Transforms.unwrapNodes(editor, {
          match: (n) =>
            n.type === NodeType.UNORDERED_LIST ||
            n.type === NodeType.ORDERED_LIST,
        });
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
      if (text.length === 0) {
        SlateCustomEditor.toggleListBlock(editor);
        return;
      }
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
      if (editor.selection.anchor.offset < text.length) {
        Transforms.splitNodes(editor, {
          match: (n) =>
            SlateElement.isElement(n) && SlateEditor.isBlock(editor, n),
          always: true,
        });
        return;
      }
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

  beforeNode(editor: SlateEditor) {
    const { selection } = editor;
    if (selection) {
      console.log(selection.anchor.path);
      let beforeNode: NodeEntry | undefined;
      let beforePath: Path;
      try {
        beforePath = Path.previous(Path.parent(selection.anchor.path));
      } catch (error) {
        return beforeNode;
      }

      try {
        const beforeNode = SlateEditor.node(editor, beforePath);
        return beforeNode;
      } catch {
        console.log("Can't Find Before Node");
      }
      return beforeNode;
    }
  },
  afterNode(editor: SlateEditor) {
    const { selection } = editor;
    if (selection) {
      const afterPath = Path.next(Path.parent(selection.anchor.path));
      let afterNode: NodeEntry | undefined;
      try {
        afterNode = SlateEditor.node(editor, afterPath);
        return afterNode;
      } catch (error) {
        console.log("Can't Find After Node");
      }
      return afterNode;
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
      case "d":
        event.preventDefault();
        SlateCustomEditor.toggleMark(editor, "code");
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
        SlateCustomEditor.insertLineBreak(editor);

        break;
      case "*":
        event.preventDefault();
        SlateCustomEditor.toggleListBlock(editor, NodeType.UNORDERED_LIST);
        break;
      case "&":
        event.preventDefault();
        SlateCustomEditor.toggleListBlock(editor, NodeType.ORDERED_LIST);
        break;
    }
  }
  if (event.key === "Backspace") {
    if (editor.selection) {
      const text = SlateEditor.string(editor, editor.selection.focus.path);
      if (text.length === 0 && SlateCustomEditor.isListActive(editor)) {
        event.preventDefault();
        SlateCustomEditor.toggleListBlock(editor);
        return;
      }
    }
  }
  if (event.key === "Enter" && !event.shiftKey && !event.ctrlKey) {
    // const isListItemActive = SlateCustomEditor.isListItemActive(editor);
    // event.preventDefault();
    const [match] = SlateEditor.nodes(editor, {
      match: (n) => SlateElement.isElement(n) && SlateEditor.isBlock(editor, n),
      mode: "lowest",
    });

    if (match[0].type) {
      event.preventDefault();
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
