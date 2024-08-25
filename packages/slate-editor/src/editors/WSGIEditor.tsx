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
  H1,
  H2,
  H3,
  H4,
  H5,
  H6,
  Ol,
  Ul,
  Li,
  Leaf,
  Default,
  Quote,
  Anchor,
} from "../elements";

import { EditableCode } from "../plugins/code/elements";
import {
  Node as SlateNode,
  Descendant,
  createEditor,
  Element as SlateElement,
  Transforms,
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

const editorValue: Descendant[] = [
  {
    type: NodeType.PARAGRAPH,
    align: "left",
    children: [{ text: "what" }],
  },
  ...initialTabs,
];

const isFocusAtStart = (path: number[]) => {
  for (let i = 0; i < path.length; i++) {
    if (path[i] !== 0) return false;
  }

  return true;
};

export const WSGIEditor = ({
  editorContent: initialValue,
  id,
  onChange,
}: {
  editorContent: EditorContent;
  title?: string;
  id: string;
  onChange: (value: string) => void;
}) => {
  const editor = useMemo(
    () =>
      withNormalize(
        withImage(
          withHeadingId(
            withKeyCommands(
              withLinks(
                withShortcuts(withPaste(withReact(withHistory(createEditor()))))
              )
            )
          )
        )
      ),
    []
  );
  const [title, setTitle] = useState(initialValue.title || "");

  const renderElement = useCallback((props: RenderElementProps) => {
    switch (props.element.type) {
      case NodeType.H1:
        return <H1 {...props} />;
      case NodeType.H2:
        return <H2 {...props} />;
      case NodeType.H3:
        return <H3 {...props} />;
      case NodeType.H4:
        return <H4 {...props} />;
      case NodeType.H5:
        return <H5 {...props} />;
      case NodeType.H6:
        return <H6 {...props} />;
      case NodeType.CODE:
        return <EditableCode {...props} />;
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
      default:
        return <Default {...props} />;
    }
  }, []);
  const renderLeaf = useCallback((props: RenderLeafProps) => {
    return <Leaf {...props} />;
  }, []);

  const debounce = (callback: any, delay: number) => {
    let timeout: string | number | NodeJS.Timeout | undefined;
    return (...args: any) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => callback(...args), delay);
    };
  };
  const debouncedSave = useMemo(() => {
    return debounce((body: string) => onChange(body), 3000);
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
  const articleValue: Descendant[] = JSON.parse(initialValue.content);

  return (
    <div className="">
      <Slate
        editor={editor}
        initialValue={articleValue.length !== 0 ? articleValue : editorValue}
        // initialValue={editorValue}
        onChange={(value) => {
          const isAstChange = editor.operations.some(
            (op) => "set_selection" !== op.type
          );
          if (isAstChange) {
            debouncedSave(
              JSON.stringify({
                title: title,
                content: JSON.stringify(value),
              })
            );
          }
        }}
      >
        <SlateToolBar />
        <div className="w-full px-2 pt-12 mt-3">
          {/* <div className="w-full">
            <img
              src="https://miro.medium.com/v2/resize:fit:720/format:webp/1*kyhNfzNWquucFB7EQBubPg.jpeg"
              className="sm:h-80 w-full object-cover"
              alt=""
            />
          </div> */}
          <input
            ref={titleRef}
            type="text"
            className="text-5xl py-2 font-extrabold bg-transparent h-14 w-full"
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
                case "Enter":
                  e.preventDefault();
                  ReactEditor.focus(editor);
                  break;
                case "ArrowDown":
                  e.preventDefault();
                  ReactEditor.focus(editor);
                  break;
                case "ArrowUp":
                  e.preventDefault();
                default:
                  break;
              }
            }}
            value={title}
            placeholder="Title"
          />

          {/* <TagInput id={id} initialTags={initialValue.tags} /> */}
          <Editable
            decorate={useCallback(decorate, [])}
            spellCheck
            autoFocus
            id="editor"
            className=""
            renderElement={renderElement}
            renderLeaf={renderLeaf}
            onKeyDown={(event) => {
              handleKeyBoardFormating(event, editor);
              if (
                event.key === "ArrowUp" &&
                isFocusAtStart(editor.selection?.anchor.path || [])
              ) {
                if (titleRef.current) {
                  event.preventDefault();
                  titleRef.current.focus();
                  const length = titleRef.current.value.length;
                  titleRef.current.setSelectionRange(length, length);
                }
              }
              if (event.ctrlKey && event.key === "s") {
                event.preventDefault();
                // UpdateContent(
                //   JSON.stringify({
                //     content: JSON.stringify(editor.children),
                //   })
                // );

                onChange(
                  JSON.stringify({
                    title: title,
                    content: JSON.stringify(editor.children),
                  })
                );
              }
            }}
          />

          <div
            onMouseDown={(e) => {
              e.preventDefault();
            }}
            ref={ref}
            className="h-96"
          ></div>
        </div>
      </Slate>
    </div>
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

const initialValue2: Descendant[] = [
  {
    id: "heading-one",
    type: NodeType.H1,
    align: "center",
    children: [
      {
        text: "Heading One",
      },
    ],
  },
  {
    type: NodeType.UNORDERED_LIST,
    children: [
      {
        type: NodeType.LIST_ITEM,
        children: [
          {
            text: "List Item 1",
          },
        ],
      },
      {
        type: NodeType.LIST_ITEM,
        children: [
          {
            text: "List Item 2",
          },
        ],
      },
      {
        type: NodeType.ORDERED_LIST,
        children: [
          {
            type: NodeType.LIST_ITEM,
            children: [
              {
                text: "List Item 1",
              },
            ],
          },
          {
            type: NodeType.LIST_ITEM,
            children: [
              {
                text: "List Item 2",
              },
            ],
          },
        ],
      },
    ],
  },
  {
    type: NodeType.ORDERED_LIST,
    children: [
      {
        type: NodeType.LIST_ITEM,
        children: [
          {
            text: "List Item 1",
          },
        ],
      },
      {
        type: NodeType.LIST_ITEM,
        children: [
          {
            text: "List Item 2",
          },
        ],
      },
      {
        type: NodeType.ORDERED_LIST,
        children: [
          {
            type: NodeType.LIST_ITEM,
            children: [
              {
                text: "List Item 1",
              },
            ],
          },
          {
            type: NodeType.LIST_ITEM,
            children: [
              {
                text: "List Item 2",
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "heading-on-1e",
    type: NodeType.H1,
    align: "center",
    children: [
      {
        text: "Heading One",
      },
    ],
  },
  {
    type: NodeType.UNORDERED_LIST,
    children: [
      {
        type: NodeType.LIST_ITEM,
        children: [{ text: "List Item 1" }],
      },
    ],
  },
  {
    type: NodeType.PARAGRAPH,
    align: "left",
    children: [
      {
        text: "Heading Two",
      },
    ],
  },
  {
    type: NodeType.PARAGRAPH,
    align: "center",
    children: [
      {
        text: "A line of text in a paragraph.",
        bold: true,
      },
      {
        text: "Bold",
        bold: true,
      },
      {
        text: " Some More Text ",
      },
      {
        text: "Italic",
        italic: true,
      },
      {
        text: " Some more text ",
      },
      {
        text: "Underlined",
        underline: true,
      },
      {
        text: " Some more text ",
      },
      {
        text: "Bold Italic",
        bold: true,
        italic: true,
      },
    ],
  },
  {
    type: NodeType.CODE,
    language: "javascript",
    children: [
      {
        text: "const a = 5;",
      },
      {
        text: "const b = 10;",
      },
    ],
  },
  {
    type: NodeType.PARAGRAPH,
    align: "right",
    children: [
      {
        text: "A line of text \nin a paragraph.",
        // bold: true,
      },
      {
        text: "Bold",
        bold: true,
      },
      {
        text: " Some More Text ",
      },
      {
        text: "Italic",
        italic: true,
      },
      {
        text: " Some more text ",
      },
      {
        text: "Underlined",
        underline: true,
      },
      {
        text: " Some more text ",
      },
      {
        text: "Bold Italic",
        bold: true,
        italic: true,
      },
    ],
  },

  // {
  //   type: "code",
  //   language: "javascript",
  //   children: [
  //     {
  //       text: "const a = 5;",
  //     },
  //     {
  //       text: "const b = 10;",
  //     },
  //   ],
  // },
];
