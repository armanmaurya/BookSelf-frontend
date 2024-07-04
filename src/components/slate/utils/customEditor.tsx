import {
  Transforms,
  BaseRange,
  Point,
  Path,
  NodeEntry,
  Element as SlateElement,
  Editor as SlateEditor,
  Text,
  Range,
} from "slate";
import { NodeType } from "../types";
import { text } from "stream/consumers";

export const SlateCustomEditor = {
  toggleBlock(editor: SlateEditor, format: string) {
    const isActive = SlateCustomEditor.isBlockActive(editor, format);
    const { selection } = editor;

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

  isHeadingActive(editor: SlateEditor) {
    const [match] = SlateEditor.nodes(editor, {
      match: (n) =>
        SlateElement.isElement(n) &&
        (n.type === NodeType.H1 ||
          n.type === NodeType.H2 ||
          n.type === NodeType.H3 ||
          n.type === NodeType.H4 ||
          n.type === NodeType.H5 ||
          n.type === NodeType.H6),
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

  addHeadingId(editor: SlateEditor) {
    const { selection } = editor;
    if (selection) {
      const isHeading = SlateCustomEditor.isHeadingActive(editor);
      if (isHeading) {
        const nodetext = SlateEditor.string(editor, selection.anchor.path);
        console.log(nodetext);

        const allNodes = SlateEditor.nodes(editor, {
          mode: "all",
          at: [],
          match(node, path) {
            return (
              SlateElement.isElement(node) &&
              (node.type === NodeType.H1 ||
                node.type === NodeType.H2 ||
                node.type === NodeType.H3 ||
                node.type === NodeType.H4 ||
                node.type === NodeType.H5 ||
                node.type === NodeType.H6) &&
              node.children[0].text.toLowerCase() === nodetext
            );
          },
        });

        const id = nodetext.trim().toLowerCase().replace(/\s/g, "-");
        let numberOfDuplicates: number = 0;

        for (const value of allNodes) {
          Transforms.setNodes(
            editor,
            {
              id: numberOfDuplicates > 0 ? `${id}-${numberOfDuplicates}` : id,
            },
            {
              at: value[1],
              match: (n) => SlateElement.isElement(n),
            }
          );
          numberOfDuplicates++;
        }
      }
    }
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

  insertLink(editor: SlateEditor, url?: string | null) {
    if (!url) {
      return;
    }
    const { selection } = editor;
    if (selection) {
      if (!Range.isCollapsed(selection)) {
        Transforms.wrapNodes(
          editor,
          {
            type: NodeType.LINK,
            url,
            children: [{ text: "Some Text" }],
          },
          { split: true }
        );
        Transforms.collapse(editor, { edge: "end" });
      }
    }
  },

  deleteNode(editor: SlateEditor) {
    Transforms.delete(editor, { reverse: true });
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
