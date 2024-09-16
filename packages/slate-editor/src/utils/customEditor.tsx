import {
  Transforms,
  BaseRange,
  Point,
  Path,
  NodeEntry,
  Element as SlateElement,
  Editor as SlateEditor,
  Range,
  Location as SlateLocation,
  EditorNodesOptions,
  Node,
} from "slate";
import { CustomText, NodeType } from "../types";
import { ReactEditor } from "slate-react";

export const SlateCustomEditor = {
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
      } else {
        // selection is not collapsed
      }
    }
  },

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
  toggleMark(editor: SlateEditor, format: string) {
    const isActive = SlateCustomEditor.isMarkActive(editor, format);
    if (isActive) {
      SlateEditor.removeMark(editor, format);
    } else {
      SlateEditor.addMark(editor, format, true);
    }
  },

  toggleImage(editor: SlateEditor) {
    Transforms.setNodes(
      editor,
      {
        type: NodeType.IMAGE,
        url: "",
        align: "center",
        children: [{ text: "", type: "default" }],
        width: 320,
      },
      {
        match: (n) =>
          SlateElement.isElement(n) && SlateEditor.isBlock(editor, n),
      }
    );
    // Transforms.select(editor, SlateEditor.start(editor, []));
  },

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



  isBlockActive(editor: SlateEditor, format: string) {
    const [match] = SlateEditor.nodes(editor, {
      match: (n) => SlateElement.isElement(n) && n.type === format,
    });
    return !!match;
  },
  isMarkActive(editor: SlateEditor, format: string) {
    const marks: Omit<Omit<CustomText, "text">, "type"> | null = SlateEditor.marks(editor);
    // console.log(marks)
    // return marks marks?.type==="text" ? marks[format as keyof typeof marks]
    if (marks) {
      const value = marks[format as keyof typeof marks]
      // console.log(value)
      return value === true

    }
    // return marks ? marks[format as keyof typeof marks] === true : false;
    return false
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
              node.children[0].text.toLowerCase() === nodetext.toLowerCase()
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

  outdentInfo(editor: SlateEditor) {
    const [match] = SlateEditor.nodes(editor, {
      match: (n) => SlateElement.isElement(n) && n.type === NodeType.LIST_ITEM,
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

  outdentList(editor: SlateEditor, from: Path, to: Path) {
    // Transforms.unwrapNodes(editor, {
    //   match: (n) => n.type === NodeType.ORDERED_LIST || n.type === NodeType.UNORDERED_LIST,
    // })
    // const afterNodes = SlateEditor
    // Transforms.moveNodes(editor, {
    //   at: from,
    //   to: to,
    // });
  },

  indentInfo(editor: SlateEditor) {
    const [match] = SlateEditor.nodes(editor, {
      match: (n) =>
        SlateElement.isElement(n) &&
        (n.type === NodeType.UNORDERED_LIST ||
          n.type === NodeType.ORDERED_LIST),
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
      beforeNode[0].type === NodeType.LIST_ITEM &&
      SlateElement.isElement(beforeNode[0])
    ) {
      return {
        type: match[0].type as string,
        from: currentListItem[1],
        to: Path.next(
          ReactEditor.findPath(
            editor,
            beforeNode[0].children[beforeNode[0].children.length - 1]
          )
        ),
      };
    }
  },
  indentList(editor: SlateEditor, to: Path, from: Path, type: string) {
    Transforms.wrapNodes(
      editor,
      {
        type: type as NodeType.UNORDERED_LIST | NodeType.ORDERED_LIST,
        children: [],
      },
      {
        match: (n) => n.type === NodeType.LIST_ITEM,
      }
    );
    Transforms.moveNodes(editor, {
      at: from,
      to: to,
      // match: (n) => n.type === NodeType.LIST_ITEM,
    });
  },

  isListActive(editor: SlateEditor) {
    const [match] = SlateEditor.nodes(editor, {
      match: (n) => SlateElement.isElement(n) && n.type === NodeType.LIST_ITEM,
    });
    return !!match;
  },

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

  getAlignment(editor: SlateEditor) {
    const [match] = SlateEditor.nodes(editor, {
      match: (n) => SlateElement.isElement(n),
    });

    if (!match) {
      return "left";
    }

    if (
      match[0].type === NodeType.PARAGRAPH ||
      match[0].type === NodeType.H1 ||
      match[0].type === NodeType.H2 ||
      match[0].type === NodeType.H3 ||
      match[0].type === NodeType.H4 ||
      match[0].type === NodeType.H5 ||
      match[0].type === NodeType.H6
    ) {
      return match[0].align;
    }
  },

  // toggleListBlock(editor: SlateEditor, format?: string) {
  //   const isActive = SlateCustomEditor.isListActive(editor);
  //   const { selection } = editor;
  //   if (!isActive && format) {
  //     if (selection) {
  //       Transforms.wrapNodes(editor, {
  //         type: NodeType.LIST_ITEM,
  //         children: [],
  //       });
  //       Transforms.wrapNodes(
  //         editor,
  //         {
  //           type: format as NodeType.UNORDERED_LIST | NodeType.ORDERED_LIST,
  //           children: [],
  //         },
  //         {
  //           match: (n) => n.type === NodeType.LIST_ITEM,
  //         }
  //       );

  //       const [match] = SlateEditor.nodes(editor, {
  //         match: (n) =>
  //           SlateElement.isElement(n) &&
  //           SlateEditor.isBlock(editor, n) &&
  //           (n.type === NodeType.UNORDERED_LIST ||
  //             n.type === NodeType.ORDERED_LIST),
  //       });

  //       let beforeNode;
  //       try {
  //         const beforeNodePath = Path.previous(match[1]);
  //         beforeNode = SlateEditor.node(editor, beforeNodePath);
  //       } catch (error) {
  //         console.log("Can't Find Before Node");
  //       }

  //       let afterNode;
  //       try {
  //         const afterNodePath = Path.next(match[1]);
  //         afterNode = SlateEditor.node(editor, afterNodePath);
  //       } catch (error) {
  //         console.log("Can't Find Before Node");
  //       }

  //       let range: BaseRange | undefined;
  //       let toSelect: Point | undefined;

  //       if (beforeNode) {
  //         if (
  //           beforeNode[0].type === format &&
  //           SlateElement.isElement(beforeNode[0])
  //         ) {
  //           toSelect = {
  //             path: [beforeNode[1][0], beforeNode[0].children.length, 0, 0],
  //             offset: 0,
  //           };
  //           range = {
  //             anchor: { path: [beforeNode[1][0], 0, 0, 0], offset: 0 },
  //             focus: {
  //               path: selection.focus.path,
  //               offset: 0,
  //             },
  //           };
  //           Transforms.select(editor, range);
  //         }
  //       }

  //       if (afterNode) {
  //         if (
  //           afterNode[0].type === format &&
  //           SlateElement.isElement(afterNode[0])
  //         ) {
  //           const listLastItemLength =
  //             afterNode[0].children[afterNode[0].children.length - 1]
  //               .children[0].children[0].text.length;
  //           console.log(listLastItemLength);

  //           if (range) {
  //             if (!Range.isCollapsed(range)) {
  //               Transforms.setSelection(editor, {
  //                 focus: {
  //                   path: [
  //                     afterNode[1][0],
  //                     afterNode[0].children.length - 1,
  //                     0,
  //                     0,
  //                   ],
  //                   offset: listLastItemLength,
  //                 },
  //               });
  //             }
  //           } else {
  //             toSelect = {
  //               path: [selection.anchor.path[0], 0, 0, 0],
  //               offset: 0,
  //             };
  //             Transforms.select(editor, {
  //               anchor: {
  //                 path: [selection.anchor.path[0], 0, 0, 0],
  //                 offset: 0,
  //               },
  //               focus: {
  //                 path: [
  //                   afterNode[1][0],
  //                   afterNode[0].children.length - 1,
  //                   0,
  //                   0,
  //                 ],
  //                 offset: listLastItemLength,
  //               },
  //             });
  //           }
  //         }
  //       }

  //       Transforms.unwrapNodes(editor, {
  //         match: (n) =>
  //           n.type === NodeType.UNORDERED_LIST ||
  //           n.type === NodeType.ORDERED_LIST,
  //       });
  //       Transforms.wrapNodes(
  //         editor,
  //         {
  //           type: format as NodeType.UNORDERED_LIST | NodeType.ORDERED_LIST,
  //           children: [],
  //         },
  //         {
  //           match: (n) => n.type === NodeType.LIST_ITEM,
  //         }
  //       );
  //       if (toSelect) {
  //         Transforms.select(editor, toSelect);
  //       }

  //       return;
  //     }
  //   } else {
  //     if (editor.selection) {
  //       const [beforeMatch] = SlateEditor.nodes(editor, {
  //         match: (n) =>
  //           SlateElement.isElement(n) && n.type === NodeType.LIST_ITEM,
  //         mode: "lowest",
  //       });

  //       if (
  //         beforeMatch[0].type === NodeType.LIST_ITEM &&
  //         SlateElement.isElement(beforeMatch[0])
  //       ) {
  //         const lastChildNode =
  //           beforeMatch[0].children[beforeMatch[0].children.length - 1];
  //         if (
  //           lastChildNode.type === NodeType.UNORDERED_LIST ||
  //           lastChildNode.type === NodeType.ORDERED_LIST
  //         ) {
  //         }
  //       }

  //       let beforeNode;
  //       try {
  //         const beforeNodePath = Path.previous(beforeMatch[1]);
  //         beforeNode = SlateEditor.node(editor, beforeNodePath);
  //       } catch (error) {
  //         console.log("Can't Find Before Node");
  //       }

  //       if (beforeNode) {
  //         if (beforeNode[0].type === NodeType.LIST_ITEM && beforeNode) {
  //           Transforms.splitNodes(editor, {
  //             at: Path.next(beforeNode[1]),
  //           });
  //         }
  //       }

  //       // -----------------------------------------------
  //       const [afterMatch] = SlateEditor.nodes(editor, {
  //         match: (n) =>
  //           SlateElement.isElement(n) && n.type === NodeType.LIST_ITEM,
  //         mode: "lowest",
  //       });

  //       let afterNode;
  //       try {
  //         const afterNodePath = Path.next(afterMatch[1]);
  //         afterNode = SlateEditor.node(editor, afterNodePath);
  //         console.log(afterNode);
  //       } catch (error) {
  //         console.log("Can't Find After Node");
  //       }

  //       if (afterNode) {
  //         if (afterNode[0].type === NodeType.LIST_ITEM) {
  //           Transforms.splitNodes(editor, {
  //             at: afterNode[1],
  //           });
  //         }
  //       }

  //       // -----------------------------------------------

  //       Transforms.unwrapNodes(editor, {
  //         match: (n) => n.type === NodeType.LIST_ITEM,
  //       });

  //       Transforms.unwrapNodes(editor, {
  //         match: (n) =>
  //           n.type === NodeType.UNORDERED_LIST ||
  //           n.type === NodeType.ORDERED_LIST,
  //       });
  //     }
  //   }
  // },

  insertListBlock(editor: SlateEditor, format: string) {
    const isActive = SlateCustomEditor.isListActive(editor);
  },

  insertNewLine(editor: SlateEditor) {
    Transforms.insertText(editor, "\n");
  },

  insertListItem(editor: SlateEditor, at: SlateLocation | null = null) {
    // const isActive = SlateCustomEditor.isListActive(editor);
    if (editor.selection) {
      const [currentListItem] = SlateEditor.nodes(editor, {
        match: (n) =>
          SlateElement.isElement(n) && n.type === NodeType.LIST_ITEM,
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
      // const text = SlateEditor.string(editor, editor.selection.focus.path);
      // if (text.length === 0) {
      //   SlateCustomEditor.toggleListBlock(editor);
      //   // Transforms.unwrapNodes(editor);
      //   return;
      // }

      // const [match] = SlateEditor.nodes(editor, {
      //   match: (n) =>
      //     SlateElement.isElement(n) && n.type === NodeType.LIST_ITEM,
      // });

      // const nextPath = Path.next(match[1]);
      // Transforms.insertNodes(
      //   editor,
      //   {
      //     type: NodeType.PARAGRAPH,
      //     align: "left",
      //     children: [{ text: "" }],
      //   },
      //   {
      //     at: nextPath,
      //   }
      // );

      // Transforms.select(editor, nextPath);

      // Transforms.wrapNodes(editor, {
      //   type: NodeType.LIST_ITEM,
      //   children: [],
      // });
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
            children: [{ text: "Some Text", type: "default" }],
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

  insertParagraph(editor: SlateEditor, block: string) {
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
