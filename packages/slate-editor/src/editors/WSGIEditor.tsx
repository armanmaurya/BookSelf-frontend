"use client";
import { EditorContent, NodeType } from "../types";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { withHistory } from "slate-history";
import React from "react";
import {
  withShortcuts,
  withPaste,
  withLinks,
  withKeyCommands,
  withHeadingId,
} from "../plugins";
import {
  withReact,
  RenderElementProps,
  RenderLeafProps,
  Slate,
  Editable,
  ReactEditor,
  useSlateStatic,
  useFocused,
  useSelected,
} from "slate-react";

import { DefalutLeaf, Default, Quote, Anchor } from "../elements";

import {
  EditorHeading1,
  EditorHeading2,
  EditorHeading3,
  EditorHeading4,
  EditorHeading5,
  EditorHeading6,
  HeadingElementType,
  withHeading,
} from "@bookself/slate-heading";

import { ListItem, ListType, OrderedList, UnorderedList } from "@bookself/slate-list";

import {
  Descendant,
  createEditor,
  Element as SlateElement,
  Editor,
  Element,
  Transforms,
} from "slate";
import { SlateCustomEditor } from "../utils/customEditor";
import { handleKeyBoardFormating } from "../utils/handleKeyBoard";
import { decorate } from "../utils/decorate";

import "prismjs/components/prism-javascript";
import "prismjs/components/prism-jsx";
import "prismjs/components/prism-typescript";
import "prismjs/components/prism-tsx";
import "prismjs/components/prism-markdown";
import "prismjs/components/prism-python";
import "prismjs/components/prism-php";
import "prismjs/components/prism-sql";
import "prismjs/components/prism-java";
import "prismjs/themes/prism-solarizedlight.css";
import "react-tabs/style/react-tabs.css";

import { CommandMenu, Commands } from "@bookself/slate-command-menu";

import { withImage, EditableImage } from "../plugins/image";
import { EditableQuote } from "../plugins/quote/elements/EditableQuote";
import { withNormalize } from "../plugins/normalize";
import {
  EditableTab,
  EditableTabList,
  EditableTabPanel,
  EditableTabs,
} from "../plugins/tab-list/elements/editable";
import { initialTabs } from "../initialValue/InitialTabs";
import { withTabs } from "../plugins/tab-list";

import {
  EditableParagraphLeaf,
  ParagraphEditor,
} from "@bookself/slate-paragraph";
import { EditableParagraph } from "@bookself/slate-paragraph";
import { CodeEditor, EditableCode } from "@bookself/slate-code";
import { HeadingType } from "@bookself/slate-heading/src/types/type";

/**
 * Initial value for the editor.
 */
const editorValue: Descendant[] = [
  {
    type: NodeType.PARAGRAPH,
    align: "left",
    children: [{ text: "", type: "text", fontSize: 16 }],
  },
];

/**
 * Checks if the focus is at the start of the path.
 * @param path - The path to check.
 * @returns True if the focus is at the start, false otherwise.
 */
const isFocusAtStart = (path: number[]) => {
  for (let i = 0; i < path.length; i++) {
    if (path[i] !== 0) return false;
  }
  return true;
};

export type SlateNodeType = HeadingType | NodeType | ListType;

const withEnforceOneChild = (editor: Editor) => {
  const { normalizeNode } = editor;

  editor.normalizeNode = ([node, path]) => {
    // Ensure the editor always has at least one child
    if (Editor.isEditor(node) && node.children.length === 0) {
      Transforms.insertNodes(editor, {
        type: NodeType.PARAGRAPH,
        align: "left",
        children: [{ text: "", type: "text", fontSize: 16 }],
      });
    }

    normalizeNode([node, path]);
  };

  return editor;
};

/**
 * WSGIEditor component.
 * @param initialValue - The initial value of the editor.
 * @param onChange - Callback function to handle changes in the editor.
 * @param title - The title of the editor.
 */
export const WSGIEditor = ({
  initialValue,
  onContentChange,
  title,
  onTitleChange,
}: {
  initialValue?: string;
  title?: string;
  onContentChange?: (value: string) => void;
  onTitleChange?: (value: string) => void;
}) => {
  const editor = useMemo(
    () =>
      withEnforceOneChild(
        withHeading(NodeType.PARAGRAPH,
          withTabs(
            withNormalize(
              withImage(
                withLinks(
                  withPaste(withReact(withHistory(createEditor())))
                )
              )
            )
          ),
        )
      ),
    []
  );
  const [pageTitle, setTitle] = useState(title || "");

  /**
   * Renders the elements in the editor.
   * @param props - The properties of the element to render.
   * @returns The rendered element.
   */
  const renderElement = useCallback((props: RenderElementProps) => {
    switch (props.element.type) {
      case HeadingType.H1:
        return <EditorHeading1 {...props} />;
      case HeadingType.H2:
        return <EditorHeading2 {...props} />;
      case HeadingType.H3:
        return <EditorHeading3 {...props} />;
      case HeadingType.H4:
        return <EditorHeading4 {...props} />;
      case HeadingType.H5:
        return <EditorHeading5 {...props} />;
      case HeadingType.H6:
        return <EditorHeading6 {...props} />;
      case NodeType.CODE:
        return <EditableCode {...props} element={props.element} />;
      case ListType.ORDERED_LIST:
        return <OrderedList {...props} element={props.element} />;
      case ListType.UNORDERED_LIST:
        return <UnorderedList {...props} element={props.element} />;
      case ListType.LIST_ITEM:
        return <ListItem {...props} element={props.element} />;
      case NodeType.IMAGE:
        return <EditableImage {...props} />;
      case NodeType.BLOCKQUOTE:
        return <EditableQuote {...props} />;
      case NodeType.LINK:
        return <SlateAnchorTag {...props} />;
      case NodeType.TABS:
        return <EditableTabs {...props} />;
      case NodeType.TAB_LIST:
        return <EditableTabList {...props} />;
      case NodeType.TAB:
        return <EditableTab {...props} />;
      case NodeType.TAB_PANEL:
        return <EditableTabPanel {...props} />;
      case NodeType.PARAGRAPH:
        return <EditableParagraph {...props} element={props.element} />;
      default:
        return <Default {...props} />;
    }
  }, []);



  /**
   * Commands for the command menu.
   */
  const commands: Commands[] = [
    {
      name: "bold",
      command: (editor) => {
        SlateCustomEditor.toggleMark(editor, "bold");
      },
    },
    {
      name: "Text",
      command: (editor) => {
        const [match] = Editor.nodes(editor, {
          match: (n) => SlateElement.isElement(n),
        });
        const currentNode = match ? (match[0].type as SlateNodeType) : null;
        if (currentNode) {
          SlateCustomEditor.replaceBlock(editor, currentNode, {
            type: NodeType.PARAGRAPH,
            align: "left",
            children: [
              {
                type: "text",
                text: "",
                fontSize: 16,
              },
            ],
          });
        }
      },
    },
    {
      name: "Heading 1",
      command: (editor) => {
        // const heading1: HeadingElementType = {
        //   type: HeadingType.H1,
        //   align: "left",
        //   children: [
        //     {
        //       type: "default",
        //       text: "",
        //     },
        //   ],
        // };
        const currentNode = SlateCustomEditor.getCurrentBlockType(editor);
        // if (currentNode) {
        //   SlateCustomEditor.replaceBlock(editor, currentNode, heading1);
        // }
        if (currentNode) {
          editor.replaceWithHeading(currentNode, HeadingType.H1);
        }
      },
    },
    {
      name: "Heading 2",
      command: (editor) => {
        const heading2: HeadingElementType = {
          type: HeadingType.H2,
          align: "left",
          children: [
            {
              type: "default",
              text: "",
            },
          ],
        };
        const currentNode = SlateCustomEditor.getCurrentBlockType(editor);
        if (currentNode) {
          SlateCustomEditor.replaceBlock(editor, currentNode, heading2);
        }
      },
    },
    {
      name: "Heading 3",
      command: (editor) => {
        const heading3: HeadingElementType = {
          type: HeadingType.H3,
          align: "left",
          children: [
            {
              type: "default",
              text: "",
            },
          ],
        };
        const currentNode = SlateCustomEditor.getCurrentBlockType(editor);
        if (currentNode) {
          SlateCustomEditor.replaceBlock(editor, currentNode, heading3);
        }
      },
    },
    {
      name: "Heading 4",
      command: (editor) => {
        const heading4: HeadingElementType = {
          type: HeadingType.H4,
          align: "left",
          children: [
            {
              type: "default",
              text: "",
            },
          ],
        };
        const currentNode = SlateCustomEditor.getCurrentBlockType(editor);
        if (currentNode) {
          SlateCustomEditor.replaceBlock(editor, currentNode, heading4);
        }
      },
    },
    {
      name: "Heading 5",
      command: (editor) => {
        const heading5: HeadingElementType = {
          type: HeadingType.H5,
          align: "left",
          children: [
            {
              type: "default",
              text: "",
            },
          ],
        };
        const currentNode = SlateCustomEditor.getCurrentBlockType(editor);
        if (currentNode) {
          SlateCustomEditor.replaceBlock(editor, currentNode, heading5);
        }
      },
    },
    {
      name: "Heading 6",
      command: (editor) => {
        const heading6: HeadingElementType = {
          type: HeadingType.H6,
          align: "left",
          children: [
            {
              type: "default",
              text: "",
            },
          ],
        };
        const currentNode = SlateCustomEditor.getCurrentBlockType(editor);
        if (currentNode) {
          SlateCustomEditor.replaceBlock(editor, currentNode, heading6);
        }
      },
    },
    {
      name: "Unordered List",
      command(editor) {
        const currentNode = SlateCustomEditor.getCurrentBlockType(editor);
        if (currentNode) {
          SlateCustomEditor.replaceBlock(editor, currentNode, {
            type: ListType.UNORDERED_LIST,
            children: [{
              type: ListType.LIST_ITEM, children: [{
                type: "text",
                children: [{ text: "", type: "text", fontSize: 16 }],
                align: "left",
              }]
            }],
          });
        }
      },
    },
    {
      name: "Quote",
      command: (editor) => {
        SlateCustomEditor.toggleBlockQuote(editor);
      },
    },
    {
      name: "Code",
      command: (editor) => {
        const currentNode = SlateCustomEditor.getCurrentBlockType(editor);

        if (currentNode) {
          SlateCustomEditor.replaceBlock(editor, currentNode, {
            type: NodeType.CODE,
            children: [{ text: "", type: "default" }],
            language: "",
          });
        }
      },
    },
    {
      name: "link",
      command: (editor) => {
        console.log("link");
      },
    },
    {
      name: "image",
      command: (editor) => {
        console.log("image");
      },
    },
    {
      name: "ordered list",
      command: (editor) => {
        console.log("ordered list");
      },
    },
    {
      name: "tab",
      command: (editor) => {
        console.log("tab");
      },
    },
    {
      name: "tab list",
      command: (editor) => {
        console.log("tab list");
      },
    },
  ];

  const [isCommendMenuOpen, setIsCommendMenuOpen] = useState(false);

  /**
   * Renders the leaves in the editor.
   * @param props - The properties of the leaf to render.
   * @returns The rendered leaf.
   */
  const renderLeaf = useCallback((props: RenderLeafProps) => {
    switch (props.leaf.type) {
      case "text":
        return <EditableParagraphLeaf {...props} leaf={props.leaf} />;
      default:
        return <DefalutLeaf {...props} />;
    }
  }, []);

  /**
   * Debounces a callback function.
   * @param callback - The callback function to debounce.
   * @param delay - The delay in milliseconds.
   * @returns The debounced function.
   */
  const debounce = (callback: any, delay: number) => {
    let timeout: string | number | NodeJS.Timeout | undefined;
    return (...args: any) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => callback(...args), delay);
    };
  };
  const debouncedContentSave = useMemo(() => {
    return debounce((body: string) => onContentChange && onContentChange(body), 3000);
  }, [onContentChange]);

  const debouncedTitleSave = useMemo(() => {
    return debounce((title: string) => onTitleChange && onTitleChange(title), 500);
  }
    , [onTitleChange]);

  const titleRef = useRef<HTMLInputElement>(null);
  const ref = useRef<HTMLDivElement>(null);

  /**
   * Handles click events outside the editor.
   * @param event - The mouse event.
   */
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && ref.current.contains(event.target as Node)) {
        SlateCustomEditor.insertParagraph(editor, NodeType.PARAGRAPH);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  });

  const [match] = Editor.nodes(editor, {
    match: (n) => Element.isElement(n),
    mode: "lowest",
  });

  const currentNode = match ? (match[0].type as string) : null;

  return (
    <div className="">
      <Slate
        editor={editor}
        initialValue={initialValue ? JSON.parse(initialValue) : editorValue}
        onChange={(value) => {
          const isAstChange = editor.operations.some(
            (op) => "set_selection" !== op.type
          );
          if (isAstChange) {
            debouncedContentSave(JSON.stringify(value));
          }
        }}
      >
        <div className="w-full">
          <input
            ref={titleRef}
            type="text"
            className="text-3xl font-extrabold bg-transparent h-14 w-full"
            onChange={(e) => {
              setTitle(e.target.value);
              debouncedTitleSave(e.target.value);
            }}
            value={pageTitle}
            placeholder="Title"
          />
          <Editable
            placeholder="Start Writing..."
            decorate={useCallback(decorate, [])}
            spellCheck
            autoFocus
            id="editor"
            style={{ position: "inherit", zIndex: 0 }}
            renderElement={renderElement}
            renderLeaf={renderLeaf}
            onKeyDown={(event) => {
              handleKeyBoardFormating(event, editor, isCommendMenuOpen);
              if (event.ctrlKey && event.key === "s") {
                event.preventDefault();
                onContentChange && onContentChange(JSON.stringify(editor.children));
              }
            }}
          />
          <div
            onMouseDown={(e) => {
              e.preventDefault();
              ParagraphEditor.insertParagraph(editor, {
                at: [editor.children.length],
                select: true,
              });
            }}
            className="h-60"
          ></div>
        </div>
        <CommandMenu
          commands={commands}
          isCommandMenuOpen={isCommendMenuOpen}
          setIsCommandMenuOpen={setIsCommendMenuOpen}
        />
      </Slate>
    </div>
  );
};

/**
 * Renders an anchor tag in the editor.
 * @param props - The properties of the element to render.
 * @returns The rendered anchor tag.
 */
const SlateAnchorTag = (props: RenderElementProps) => {
  const editor = useSlateStatic();
  const selected = useSelected();
  const focused = useFocused();
  const [isHovering, setIsHovering] = useState(false);
  return (
    <span
      className="relative"
      onMouseEnter={() => {
        setIsHovering(true);
      }}
      onMouseLeave={() => {
        setIsHovering(false);
      }}
    >
      <Anchor {...props} />
      {((selected && focused) || isHovering) && (
        <span
          className="absolute top-4 left-0 pt-4 hover:cursor-pointer bg-neutral-800"
          contentEditable={false}
        >
          <span className="border p-2 underline text-blue-500 rounded">
            <a
              href={
                props.element.type === NodeType.LINK ? props.element.url : ""
              }
              rel="noreferrer"
              target="_blank"
            >
              {props.element.type === NodeType.LINK ? props.element.url : ""}
            </a>
          </span>
        </span>
      )}
    </span>
  );
};
