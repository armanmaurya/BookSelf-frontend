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

import {
  Ol,
  Ul,
  Li,
  DefalutLeaf,
  Default,
  Quote,
  Anchor,
} from "../elements";

import { EditorHeading1, EditorHeading2, EditorHeading3, EditorHeading4, EditorHeading5, EditorHeading6, HeadingEditor, HeadingElementType } from "@bookself/slate-heading";

// import { EditableCode } from "../plugins/code/elements";
import {
  Node as SlateNode,
  Descendant,
  createEditor,
  Element as SlateElement,
  Transforms,
  Editor,
  Element,
} from "slate";
import { SlateToolBar } from "../components/Toolbar/toolbar";
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
// import { TagInput } from "@/components/element/input";
import "react-tabs/style/react-tabs.css";

import { CommandMenu, Commands } from "@bookself/slate-command-menu";

// import action from "@/app/actions";
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
  ParagraphLeaf,
} from "@bookself/slate-paragraph";
import { EditableParagraph } from "@bookself/slate-paragraph";
import { CodeEditor, EditableCode } from "@bookself/slate-code";
import { HeadingType } from "@bookself/slate-heading/src/types/type";

const editorValue: Descendant[] = [
  {
    type: NodeType.PARAGRAPH,
    align: "left",
    children: [{ text: "", type: "text", fontSize: 16 }],
  },
  // ...initialTabs,
  // {
  //   type: NodeType.TEXT,
  //   align: "left",
  //   children: [
  //     {
  //       type: "text",
  //       text: "what",
  //       bold: true,
  //       italic: true,
  //       underline: true,
  //       fontSize: 30,
  //     },
  //     {
  //       type: "text",
  //       text: "small",
  //       fontSize: 18,
  //     },
  //   ],
  // },
];

const isFocusAtStart = (path: number[]) => {
  for (let i = 0; i < path.length; i++) {
    if (path[i] !== 0) return false;
  }

  return true;
};

export type SlateNodeType = HeadingType | NodeType;

export const WSGIEditor = ({
  initialValue,
  onChange,
  title,
}: {
  initialValue?: string;
  title?: string;
  onChange?: (value: string) => void;
}) => {
  const editor = useMemo(
    () =>
      withTabs(
        withNormalize(
          withImage(
            withHeadingId(
              withKeyCommands(
                withLinks(
                  withShortcuts(
                    withPaste(withReact(withHistory(createEditor())))
                  )
                )
              )
            )
          )
        )
      ),
    []
  );
  const [pageTitle, setTitle] = useState(title || "");

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
      case NodeType.ORDERED_LIST:
        return <Ol {...props} />;
      case NodeType.UNORDERED_LIST:
        return <Ul {...props} />;
      case NodeType.LIST_ITEM:
        return <Li {...props} />;
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

  const getCurrentNodeType = (editor: Editor) => {
    if (editor.selection) {
      const [node] = Editor.node(editor, editor.selection);
      if (Element.isElement(node) && node.type) {
        return node.type as NodeType;
      }
    }
    return null;
  };

  const commands: Commands[] = [
    {
      name: "bold",
      command: (editor) => {

      },
    },
    {
      name: "Text",
      command: (editor) => {
        const [match] = Editor.nodes(editor, {
          match: (n) => SlateElement.isElement(n),
        });
        const currentNode = match[0].type as SlateNodeType;
        switch (currentNode) {
          default:
            SlateCustomEditor.replaceBlock(editor, currentNode, {
              type: NodeType.PARAGRAPH,
              align: "left",
              children: [
                {
                  type: "text",
                  text: "",
                  fontSize: 16,
                }
              ]
            })

        }
      }
    },
    {
      name: "Heading 1",
      command: (editor) => {
        const heading1: HeadingElementType = {
          type: HeadingType.H1,
          align: "left",
          children: [
            {
              type: "default",
              text: ""
            }
          ]
        }
        const currentNode = SlateCustomEditor.getCurrentBlockType(editor);
        switch (currentNode) {
          default:
            SlateCustomEditor.replaceBlock(editor, currentNode, heading1)
            break;
        }
      },
    },
    {
      name: "Heading 2",
      command: () => {
        const heading2: HeadingElementType = {
          type: HeadingType.H2,
          align: "left",
          children: [
            {
              type: "default",
              text: ""
            }
          ]
        }
        const currentNode = SlateCustomEditor.getCurrentBlockType(editor);
        switch (currentNode) {
          case NodeType.PARAGRAPH:
            const text = ParagraphEditor.string(editor);
            SlateCustomEditor.replaceBlock(editor, currentNode, {
              type: HeadingType.H2,
              align: "left",
              children: [
                {
                  type: "default",
                  text: text
                }
              ]
            })
            break;
          default:
            SlateCustomEditor.replaceBlock(editor, currentNode, heading2)
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
              text: ""
            }
          ]
        }
        const currentNode = SlateCustomEditor.getCurrentBlockType(editor);
        switch (currentNode) {
          case NodeType.PARAGRAPH:
            const text = ParagraphEditor.string(editor);
            SlateCustomEditor.replaceBlock(editor, currentNode, {
              type: HeadingType.H3,
              align: "left",
              children: [
                {
                  type: "default",
                  text: text
                }
              ]
            })
            break;
          default:
            SlateCustomEditor.replaceBlock(editor, currentNode, heading3)
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
              text: ""
            }
          ]
        }
        const currentNode = SlateCustomEditor.getCurrentBlockType(editor);
        switch (currentNode) {
          case NodeType.PARAGRAPH:
            const text = ParagraphEditor.string(editor);
            SlateCustomEditor.replaceBlock(editor, currentNode, {
              type: HeadingType.H4,
              align: "left",
              children: [
                {
                  type: "default",
                  text: text
                }
              ]
            })
            break;
          default:
            SlateCustomEditor.replaceBlock(editor, currentNode, heading4)
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
              text: ""
            }
          ]
        }
        const currentNode = SlateCustomEditor.getCurrentBlockType(editor);
        switch (currentNode) {
          case NodeType.PARAGRAPH:
            const text = ParagraphEditor.string(editor);
            SlateCustomEditor.replaceBlock(editor, currentNode, {
              type: HeadingType.H5,
              align: "left",
              children: [
                {
                  type: "default",
                  text: text
                }
              ]
            })
            break;
          default:
            SlateCustomEditor.replaceBlock(editor, currentNode, heading5)
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
              text: ""
            }
          ]
        }
        const currentNode = SlateCustomEditor.getCurrentBlockType(editor);
        switch (currentNode) {
          case NodeType.PARAGRAPH:
            const text = ParagraphEditor.string(editor);
            SlateCustomEditor.replaceBlock(editor, currentNode, {
              type: HeadingType.H6,
              align: "left",
              children: [
                {
                  type: "default",
                  text: text
                }
              ]
            })
            break;
          default:
            SlateCustomEditor.replaceBlock(editor, currentNode, heading6)
        }
      },
    },
    {
      name: "Quote",
      command: () => {
        SlateCustomEditor.toggleBlockQuote(editor);
      },
    },
    {
      name: "Code",
      command: () => {
        CodeEditor.insertCode(editor, NodeType.PARAGRAPH, "");
      },
    },
    {
      name: "link",
      command: () => {
        console.log("link");
      },
    },
    {
      name: "image",
      command: () => {
        console.log("image");
      },
    },
    {
      name: "unordered list",
      command: () => {
        console.log("unordered list");
      },
    },
    {
      name: "ordered list",
      command: () => {
        console.log("ordered list");
      },
    },
    {
      name: "tab",
      command: () => {
        console.log("tab");
      },
    },
    {
      name: "tab list",
      command: () => {
        console.log("tab list");
      },
    },
  ]

  const [isCommendMenuOpen, setIsCommendMenuOpen] = useState(false);

  const renderLeaf = useCallback((props: RenderLeafProps) => {
    switch (props.leaf.type) {
      case "text":
        // return <ParagraphLeaf {...props} leaf={props.leaf}/>;
        return <EditableParagraphLeaf {...props} leaf={props.leaf} />;
      default:
        return <DefalutLeaf {...props} />;
    }
  }, []);

  const debounce = (callback: any, delay: number) => {
    let timeout: string | number | NodeJS.Timeout | undefined;
    return (...args: any) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => callback(...args), delay);
    };
  };
  const debouncedSave = useMemo(() => {
    return debounce((body: string) => onChange && onChange(body), 3000);
  }, [onChange]);

  const titleRef = useRef<HTMLInputElement>(null);

  const ref = useRef<HTMLDivElement>(null);

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

  // console.log(JSON.parse(initialValue.content));
  // const articleValue: Descendant[] = JSON.parse(
  //   initialValue == "" ? "[]" : initialValue
  // );

  return (
    <div className="transition-all">
      <Slate
        editor={editor}
        initialValue={
          initialValue ? JSON.parse(initialValue) : editorValue
        }
        // initialValue={editorValue}
        onChange={(value) => {
          const isAstChange = editor.operations.some(
            (op) => "set_selection" !== op.type
          );
          if (isAstChange) {
            debouncedSave(
              JSON.stringify(value),
            );
          }
        }}
      >
        {/* <SlateToolBar /> */}
        <div className="w-full">
          <input
            ref={titleRef}
            type="text"
            className="text-5xl font-extrabold bg-transparent h-14 w-full"
            onChange={(e) => {
              setTitle(e.target.value);
              debouncedSave(
                JSON.stringify({
                  title: e.target.value,
                  content: JSON.stringify(editor.children),
                })
              );
            }}
            onKeyDown={(e) => {
              switch (e.key) {
                // case "Enter":
                //   e.preventDefault();
                //   ReactEditor.focus(editor);
                //   break;
                // case "ArrowDown":
                //   e.preventDefault();
                //   ReactEditor.focus(editor);
                //   break;
                // case "ArrowUp":
                //   e.preventDefault();
                // default:
                //   break;
              }
            }}
            value={pageTitle}
            placeholder="Title"
          />

          {/* <TagInput id={id} initialTags={initialValue.tags} /> */}
          <Editable
            placeholder="Start Writing..."
            decorate={useCallback(decorate, [])}
            spellCheck
            autoFocus
            id="editor"
            className=""
            renderElement={renderElement}
            renderLeaf={renderLeaf}
            onKeyDown={(event) => {
              handleKeyBoardFormating(event, editor, isCommendMenuOpen);
              // if (
              //   event.key === "ArrowUp" &&
              //   isFocusAtStart(editor.selection?.anchor.path || [])
              // ) {
              //   if (titleRef.current) {
              //     event.preventDefault();
              //     titleRef.current.focus();
              //     const length = titleRef.current.value.length;
              //     titleRef.current.setSelectionRange(length, length);
              //   }
              // }
              if (event.ctrlKey && event.key === "s") {
                event.preventDefault();
                // UpdateContent(
                //   JSON.stringify({
                //     content: JSON.stringify(editor.children),
                //   })
                // );

                onChange &&
                  onChange(
                    // JSON.stringify({
                    //   // title: pageTitle,
                    //   content: JSON.stringify(editor.children),
                    // })
                    JSON.stringify(editor.children)
                  );
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
            // ref={ref}

            className="h-96"
          ></div>
        </div>
        <CommandMenu commands={commands} isCommandMenuOpen={isCommendMenuOpen} setIsCommandMenuOpen={setIsCommendMenuOpen} />
      </Slate>
    </div >
  );
};

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
          <span className=" border p-2 underline text-blue-500 rounded">
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
