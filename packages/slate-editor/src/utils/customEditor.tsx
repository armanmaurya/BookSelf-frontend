import {
  Transforms,
  Path,
  NodeEntry,
  Element as SlateElement,
  Editor as SlateEditor,
  Range,
  EditorNodesOptions,
  Node,
} from "slate";
import { CustomText, NodeType } from "../types";
import { ReactEditor } from "slate-react";
import { ParagraphEditor } from "@bookself/slate-paragraph";
import { SlateNodeType } from "../editors/WSGIEditor";
import { HeadingType } from "@bookself/slate-heading/src/types/type";
import { HeadingEditor } from "@bookself/slate-heading";
import { CodeType } from "@bookself/slate-code";

export const SlateCustomEditor = {
  /**
   * Gets the current block type in the editor.
   * @param editor - The editor instance.
   * @returns The current block type.
   */
  getCurrentBlockType(editor: SlateEditor) {
    const [match] = SlateEditor.nodes(editor, {
      match: (n) => SlateElement.isElement(n),
      mode: "lowest",
    });
    const currentNode = match ? (match[0].type as SlateNodeType) : null;
    console.log("Current Node", currentNode);
    return currentNode;
  },

  /**
   * Toggles the block type in the editor.
   * @param editor - The editor instance.
   * @param format - The block format to toggle.
   */
  toggleBlock(editor: SlateEditor, format: string) {
    const isActive = SlateCustomEditor.isBlockActive(editor, format);
    const { selection } = editor;
    if (selection) {
      if (Range.isCollapsed(selection)) {
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
      }
    }
  },

  /**
   * Toggles the block quote in the editor.
   * @param editor - The editor instance.
   */
  toggleBlockQuote(editor: SlateEditor) {
    const isActive = SlateCustomEditor.isBlockActive(
      editor,
      NodeType.BLOCKQUOTE
    );
    if (!isActive) {
      Transforms.wrapNodes(
        editor,
        { type: NodeType.BLOCKQUOTE, children: [] },
        {
          match: (n) =>
            SlateElement.isElement(n) && SlateEditor.isBlock(editor, n),
        }
      );
    } else {
      Transforms.unwrapNodes(editor, {
        match: (n) =>
          SlateElement.isElement(n) && n.type === NodeType.BLOCKQUOTE,
        split: true,
      });
    }
  },

  /**
   * Toggles the mark type in the editor.
   * @param editor - The editor instance.
   * @param format - The mark format to toggle.
   */
  toggleMark(editor: SlateEditor, format: string) {
    const isActive = SlateCustomEditor.isMarkActive(editor, format);
    if (isActive) {
      SlateEditor.removeMark(editor, format);
    } else {
      SlateEditor.addMark(editor, format, true);
    }
  },

  /**
   * Inserts an image block in the editor.
   * @param editor - The editor instance.
   */
  insertImage(editor: SlateEditor) {
    if (editor.selection) {
      const [match] = SlateEditor.nodes(editor, {
        match: (n) => SlateElement.isElement(n),
      });
      const text = SlateEditor.string(editor, editor.selection.focus.path);
      if (text.length === 0) {
        Transforms.removeNodes(editor, { at: match[1] });
        Transforms.insertNodes(editor, {
          type: NodeType.IMAGE,
          url: "",
          align: "center",
          children: [{ text: "", type: "default" }],
          width: 320,
        });
      } else {
        Transforms.insertNodes(editor, {
          type: NodeType.IMAGE,
          url: "",
          align: "center",
          children: [{ text: "", type: "default" }],
          width: 320,
        });
      }
    }
  },

  /**
   * Inserts a tabs block in the editor.
   * @param editor - The editor instance.
   */
  insertTabs(editor: SlateEditor) {
    Transforms.insertNodes(editor, {
      type: NodeType.TABS,
      children: [
        {
          type: NodeType.TAB_LIST,
          children: [
            {
              index: 0,
              type: NodeType.TAB,
              children: [{ text: "Tab 1", type: "tab" }],
            },
            {
              index: 1,
              type: NodeType.TAB,
              children: [{ text: "Tab 2", type: "tab" }],
            },
          ],
        },
        {
          index: 0,
          type: NodeType.TAB_PANEL,
          children: [
            {
              type: NodeType.PARAGRAPH,
              children: [
                {
                  text: "Tab 111",
                },
              ],
            },
          ],
        },
        {
          index: 1,
          type: NodeType.TAB_PANEL,
          children: [
            {
              type: NodeType.PARAGRAPH,
              children: [
                {
                  text: "Tab 222",
                },
              ],
            },
          ],
        },
      ],
    });
  },

  /**
   * Checks if a block type is active in the editor.
   * @param editor - The editor instance.
   * @param format - The block format to check.
   * @returns True if the block type is active, false otherwise.
   */
  isBlockActive(editor: SlateEditor, format: string) {
    const [match] = SlateEditor.nodes(editor, {
      match: (n) => SlateElement.isElement(n) && n.type === format,
    });
    return !!match;
  },

  /**
   * Checks if a mark type is active in the editor.
   * @param editor - The editor instance.
   * @param format - The mark format to check.
   * @returns True if the mark type is active, false otherwise.
   */
  isMarkActive(editor: SlateEditor, format: string) {
    const marks: Omit<Omit<CustomText, "text">, "type"> | null =
      SlateEditor.marks(editor);
    if (marks) {
      const value = marks[format as keyof typeof marks];
      return value === true;
    }
    return false;
  },

  /**
   * Checks if a heading type is active in the editor.
   * @param editor - The editor instance.
   * @returns True if a heading type is active, false otherwise.
   */
  isHeadingActive(editor: SlateEditor) {
    const [match] = SlateEditor.nodes(editor, {
      match: (n) =>
        SlateElement.isElement(n) &&
        (n.type === HeadingType.H1 ||
          n.type === HeadingType.H2 ||
          n.type === HeadingType.H3 ||
          n.type === HeadingType.H4 ||
          n.type === HeadingType.H5 ||
          n.type === HeadingType.H6),
    });
    return !!match;
  },

  /**
   * Checks if a code block is active in the editor.
   * @param editor - The editor instance.
   * @returns True if a code block is active, false otherwise.
   */
  isCodeBlockActive(editor: SlateEditor) {
    const [match] = SlateEditor.nodes(editor, {
      match: (n) => SlateElement.isElement(n) && n.type === CodeType.Code,
    });
    return !!match;
  },

  /**
   * Checks if an ordered list is active in the editor.
   * @param editor - The editor instance.
   * @returns True if an ordered list is active, false otherwise.
   */
  isOrderedListActive(editor: SlateEditor) {
    const [match] = SlateEditor.nodes(editor, {
      match: (n) =>
        SlateElement.isElement(n) &&
        (n.type as NodeType) === NodeType.ORDERED_LIST,
    });
    return !!match;
  },

  /**
   * Adds an ID to a heading block in the editor.
   * @param editor - The editor instance.
   */
  addHeadingId(editor: SlateEditor) {
    const { selection } = editor;
    if (selection) {
      const isHeading = SlateCustomEditor.isHeadingActive(editor);
      if (isHeading) {
        const nodetext = SlateEditor.string(editor, selection.anchor.path);
        const allNodes = SlateEditor.nodes(editor, {
          mode: "all",
          at: [],
          match(node) {
            return (
              SlateElement.isElement(node) &&
              (node.type === HeadingType.H1 ||
                node.type === HeadingType.H2 ||
                node.type === HeadingType.H3 ||
                node.type === HeadingType.H4 ||
                node.type === HeadingType.H5 ||
                node.type === HeadingType.H6) &&
              node.children[0].text.toLowerCase() === nodetext.toLowerCase()
            );
          },
        });

        const id = nodetext.trim().toLowerCase().replace(/\s/g, "-");
        let numberOfDuplicates = 0;

        for (const value of allNodes) {
          Transforms.setNodes(
            editor,
            {
              headingId: numberOfDuplicates > 0 ? `${id}-${numberOfDuplicates}` : id,
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

  /**
   * Gets the outdent information for a list item in the editor.
   * @param editor - The editor instance.
   * @returns The outdent information.
   */
  outdentInfo(editor: SlateEditor) {
    const [match] = SlateEditor.nodes(editor, {
      match: (n) =>
        SlateElement.isElement(n) &&
        (n.type as NodeType) === NodeType.LIST_ITEM,
      mode: "lowest",
    });

    if (!match) {
      return false;
    }
    return {
      from: match[1] as Path,
      to: Path.next(Path.parent(Path.parent(match[1]))),
    };
  },

  /**
   * Gets the indent information for a list item in the editor.
   * @param editor - The editor instance.
   * @returns The indent information.
   */
  indentInfo(editor: SlateEditor) {
    const [match] = SlateEditor.nodes(editor, {
      match: (n) =>
        SlateElement.isElement(n) &&
        ((n.type as NodeType) === NodeType.UNORDERED_LIST ||
          (n.type as NodeType) === NodeType.ORDERED_LIST),
      mode: "lowest",
    });

    if (!match) {
      return false;
    }

    const [currentListItem] = SlateEditor.nodes(editor, {
      match: (n) => n.type === NodeType.LIST_ITEM,
      mode: "lowest",
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
      SlateElement.isElement(beforeNode[0]) &&
      (beforeNode[0] as any).type === NodeType.LIST_ITEM
    ) {
      return {
        type: match[0].type as string,
        from: currentListItem[1],
        to: Path.next(
          ReactEditor.findPath(
            editor,
            (beforeNode[0] as any).children[
              (beforeNode[0] as any).children.length - 1
            ]
          )
        ),
      };
    }
  },

  /**
   * Indents a list item in the editor.
   * @param editor - The editor instance.
   * @param to - The path to move the list item to.
   * @param from - The path to move the list item from.
   * @param type - The list type.
   */
  indentList(editor: SlateEditor, to: Path, from: Path, type: string) {
    Transforms.wrapNodes(
      editor,
      {
        type: type as any, // Cast as any to avoid type error
        children: [],
      },
      {
        match: (n) => n.type === NodeType.LIST_ITEM,
      }
    );
    Transforms.moveNodes(editor, {
      at: from,
      to: to,
    });
  },

  /**
   * Checks if a list item is active in the editor.
   * @param editor - The editor instance.
   * @returns True if a list item is active, false otherwise.
   */
  isListActive(editor: SlateEditor) {
    const [match] = SlateEditor.nodes(editor, {
      match: (n) =>
        SlateElement.isElement(n) &&
        (n.type as NodeType) === NodeType.LIST_ITEM,
    });
    return !!match;
  },

  /**
   * Splits nodes at both edges in the editor.
   * @param editor - The editor instance.
   * @param options - The options for splitting nodes.
   */
  splitNodesDoubleEdge(
    editor: SlateEditor,
    options?: EditorNodesOptions<Node>
  ) {
    const { selection } = editor;

    if (selection) {
      const [currentNode] = SlateEditor.nodes(editor, options);
      try {
        const afterNode = SlateEditor.node(editor, Path.next(currentNode[1]));
        Transforms.splitNodes(editor, {
          at: afterNode[1],
        });
      } catch (error) {
        console.log("Can't Find After Node");
      }

      try {
        const beforeNode = SlateEditor.node(
          editor,
          Path.previous(currentNode[1])
        );
        Transforms.splitNodes(editor, { at: currentNode[1] });
      } catch {
        console.log("Can't Find Before Node");
      }
    }
  },

  /**
   * Merges the previous and after nodes in the editor.
   * @param editor - The editor instance.
   * @param options - The options for merging nodes.
   */
  mergePreviousAfterNodes(
    editor: SlateEditor,
    options?: EditorNodesOptions<Node>
  ) {
    const { selection } = editor;
    if (selection) {
      const [currentNode] = SlateEditor.nodes(editor, options);
      try {
        const afterNode = SlateEditor.node(editor, Path.next(currentNode[1]));
        if (afterNode[0].type === currentNode[0].type) {
          Transforms.mergeNodes(editor, {
            at: afterNode[1],
          });
        }
      } catch (error) {
        console.log("Can't Find After Node");
      }

      try {
        const beforeNode = SlateEditor.node(
          editor,
          Path.previous(currentNode[1])
        );
        if (beforeNode[0].type === currentNode[0].type) {
          Transforms.mergeNodes(editor, {
            at: currentNode[1],
          });
        }
      } catch (error) {
        console.log("Can't Find Before Node");
      }
    }
  },

  /**
   * Sets the alignment of a block in the editor.
   * @param editor - The editor instance.
   * @param alignment - The alignment to set.
   */
  setAlignment(
    editor: SlateEditor,
    alignment: "left" | "center" | "right" | "justify"
  ) {
    const [match] = SlateEditor.nodes(editor, {
      match: (n) =>
        SlateElement.isElement(n) &&
        (n.type === NodeType.PARAGRAPH ||
          n.type === HeadingType.H1 ||
          n.type === HeadingType.H2 ||
          n.type === HeadingType.H3 ||
          n.type === HeadingType.H4 ||
          n.type === HeadingType.H5 ||
          n.type === HeadingType.H6),
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

  /**
   * Replaces a block in the editor.
   * @param editor - The editor instance.
   * @param from - The block type to replace.
   * @param to - The new block to insert.
   */
  replaceBlock(editor: SlateEditor, from: string, to: Node) {
    if (editor.selection) {
      const currentSelection = editor.selection.anchor;
      Transforms.insertNodes(editor, to);
      Transforms.removeNodes(editor, {
        at: currentSelection.path,
        mode: "highest",
        match: (n) => {
          return (n as SlateElement).type === from;
        },
      });
    }
  },

  getChildrenLength(editor: SlateEditor) {
    const [match] = SlateEditor.nodes(editor, {
      match: (n) => SlateElement.isElement(n),
      mode: "highest",
    });
    return match[0].children.length;
  },

  /**
   * Gets the alignment of a block in the editor.
   * @param editor - The editor instance.
   * @returns The alignment of the block.
   */
  getAlignment(editor: SlateEditor) {
    const [match] = SlateEditor.nodes(editor, {
      match: (n) => SlateElement.isElement(n),
    });

    if (!match) {
      return "left";
    }

    if (match[0].type === NodeType.PARAGRAPH) {
      return match[0].align;
    }
  },

  /**
   * Inserts a list item in the editor.
   * @param editor - The editor instance.
   * @param at - The path to insert the list item at.
   */
  insertListItem(editor: SlateEditor, at: null = null) {
    if (editor.selection) {
      const [currentListItem] = SlateEditor.nodes(editor, {
        match: (n) =>
          SlateElement.isElement(n) &&
          (n.type as NodeType) === NodeType.LIST_ITEM,
        mode: "lowest",
      });

      const nextNode = Path.next(currentListItem[1]);
      Transforms.insertNodes(
        editor,
        {
          type: NodeType.PARAGRAPH,
          align: "left",
          children: [{ text: "", type: "text", fontSize: 16 }],
        },
        {
          at: nextNode,
          select: true,
        }
      );

      Transforms.wrapNodes(editor, {
        type: NodeType.LIST_ITEM,
        children: [],
      });
    }
  },

  /**
   * Toggles the heading type in the editor.
   * @param editor - The editor instance.
   * @param type - The heading type to toggle.
   * @param text - The text to insert in the heading.
   */
  toggleHeading(editor: SlateEditor, type: HeadingType) {
    if (editor.selection) {
      // Find the current heading node (if any)
      const [currentNode, currentPath] = SlateEditor.node(
        editor,
        editor.selection
      );
      const isHeading = HeadingEditor.isHeadingActive(editor);
      const currentType = HeadingEditor.getHeadingType(editor);
      const text = ParagraphEditor.string(editor);
      console.log("Heading Type Active", currentType);
      const headingTypes: HeadingType[] = [
        HeadingType.H1,
        HeadingType.H2,
        HeadingType.H3,
        HeadingType.H4,
        HeadingType.H5,
        HeadingType.H6,
      ];

      if (
        isHeading &&
        currentType &&
        headingTypes.includes(currentType as HeadingType)
      ) {
        if (currentType === type) {
          console.log("Same Heading Type Active");
          // If the same heading type is active, replace with paragraph at the same path
          ParagraphEditor.insertParagraph(
            editor,
            {
              at: SlateEditor.after(editor, editor.selection.focus, {
                unit: "block",
              }),
            },
            text
          );
          Transforms.removeNodes(editor, {
            match: (n) =>
              SlateElement.isElement(n) && SlateEditor.isBlock(editor, n),
            mode: "lowest",
            at: currentPath,
          });
        } else {
          // Switch to a different heading level
          HeadingEditor.insertHeading(editor, type, text);
          Transforms.removeNodes(editor, {
            match: (n) =>
              SlateElement.isElement(n) && SlateEditor.isBlock(editor, n),
            mode: "lowest",
            at: currentPath,
          });
        }
      } else {
        // If heading is not active, toggle to heading
        HeadingEditor.insertHeading(editor, type, text);
        Transforms.removeNodes(editor, {
          match: (n) =>
            SlateElement.isElement(n) && SlateEditor.isBlock(editor, n),
          mode: "lowest",
          at: currentPath,
        });
      }
    }
  },

  /**
   * Inserts a link in the editor.
   * @param editor - The editor instance.
   * @param url - The URL of the link.
   */
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
            children: [{ text: "Some Text", type: "default" }],
          },
          { split: true }
        );
        Transforms.collapse(editor, { edge: "end" });
      }
    }
  },

  /**
   * Deletes a node in the editor.
   * @param editor - The editor instance.
   */
  deleteNode(editor: SlateEditor) {
    Transforms.delete(editor, { reverse: true });
  },

  /**
   * Inserts a paragraph block in the editor.
   * @param editor - The editor instance.
   * @param block - The block type to insert.
   */
  insertParagraph(editor: SlateEditor, block: string) {
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
          children: [{ text: "", type: "text", fontSize: 16 }],
          align: "left",
        },
        {
          match: (n) =>
            SlateElement.isElement(n) &&
            SlateEditor.isBlock(editor, n) &&
            n.type === block,
          at: {
            path: editor.selection.anchor.path,
            offset: text.length,
          },
        }
      );

      const nextNode = SlateEditor.after(editor, editor.selection.anchor.path);
      if (nextNode) {
        Transforms.select(editor, {
          path: nextNode.path,
          offset: nextNode.offset,
        });
      }
    }
  },

  /**
   * Gets the node before the current selection in the editor.
   * @param editor - The editor instance.
   * @returns The node before the current selection.
   */
  beforeNode(editor: SlateEditor) {
    const { selection } = editor;
    if (selection) {
      let beforeNode: NodeEntry | undefined;
      let beforePath: Path;
      try {
        beforePath = Path.previous(Path.parent(selection.anchor.path));
      } catch (error) {
        return beforeNode;
      }

      try {
        beforeNode = SlateEditor.node(editor, beforePath);
        return beforeNode;
      } catch {
        console.log("Can't Find Before Node");
      }
      return beforeNode;
    }
  },

  /**
   * Gets the node after the current selection in the editor.
   * @param editor - The editor instance.
   * @returns The node after the current selection.
   */
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
  insertNewLine(editor: SlateEditor) {
    Transforms.insertText(editor, "\n");
  },
};
