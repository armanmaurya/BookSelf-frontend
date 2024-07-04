"use client";
import { API_ENDPOINT } from "@/app/utils";
import { Article } from "@/app/types";
import { NodeType } from "../types";
import { useMemo, useState, useCallback, useRef, useEffect } from "react";
import { Store } from "react-notifications-component";
import { withHistory } from "slate-history";
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
  Code,
  Leaf,
  Default,
  Image,
  Quote,
  Anchor,
} from "@/components/slate/elements";
import {
  Node as SlateNode,
  Descendant,
  createEditor,
  Element as SlateElement,
  Transforms,
} from "slate";
import { SlateToolBar } from "../components/Toolbar/toolbar";
import { SlateCustomEditor, handleKeyBoardFormating } from "../utils";
import Cookies from "js-cookie";
import { decorate } from "../utils/decorate";

import Prism, { Token } from "prismjs";
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
import { TagInput } from "@/components/element/input";

import action from "@/app/actions";

const editorValue: Descendant[] = [
  {
    type: NodeType.PARAGRAPH,
    align: "left",
    children: [{ text: "" }],
  },
];

const isFocusAtStart = (path: number[]) => {
  for (let i = 0; i < path.length; i++) {
    if (path[i] !== 0) return false;
  }

  return true;
};

export function WSGIEditor({
  initialValue,
  id,
}: {
  initialValue: Article;
  title?: string;
  id: string;
}) {
  const editor = useMemo(
    () =>
      withHeadingId(withKeyCommands(
        withLinks(
          withShortcuts(withPaste(withReact(withHistory(createEditor()))))
        )
      )),
    []
  );
  const [value, setValue] = useState(initialValue.title || "");
  const [articleSlug, setArticleSlug] = useState<string>(id);

  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [LastSaveTime, setLastSaveTime] = useState<number>(Date.now());

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
        const { attributes, children, element } = props;
        const setLanguage = (language: string) => {
          const path = ReactEditor.findPath(editor, element);
          Transforms.setNodes(editor, { language }, { at: path });
        };
        return (
          <div className="relative">
            <div contentEditable={false} className="absolute">
              <select
                defaultValue={
                  element.type === NodeType.CODE
                    ? (element.language as string)
                    : ""
                }
                name="languages"
                id=""
                className="m-1 text-xs bg-transparent rounded"
                onChange={(e) => {
                  const language = e.target.value;
                  setLanguage(language);
                }}
              >
                <option value="" selected>
                  Select
                </option>
                <option value="javascript">Javascript</option>
                <option value="python">Python</option>
                <option value="java">Java</option>
                <option value="jsx">JSX</option>
              </select>
            </div>
            <Code {...props} />
          </div>
        );
      case NodeType.ORDERED_LIST:
        return <Ol {...props} />;
      case NodeType.UNORDERED_LIST:
        return <Ul {...props} />;
      case NodeType.LIST_ITEM:
        return <Li {...props} />;
      case "image":
        return <Image {...props} />;
      case NodeType.QUOTE:
        return <Quote {...props} />;
      case NodeType.LINK:
        return <SlateAnchorTag {...props} />;
      default:
        return <Default {...props} />;
    }
  }, []);
  const renderLeaf = useCallback((props: RenderLeafProps) => {
    return <Leaf {...props} />;
  }, []);
  const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

  const UpdateContent = useCallback(
    async (body: string) => {
      setIsSaving(true);
      console.log(body);

      const csrf = Cookies.get("csrftoken");
      console.log(articleSlug);

      try {
        const res = await fetch(
          `${API_ENDPOINT.article.url}?slug=${articleSlug}`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              "X-CSRFToken": `${csrf}`,
            },
            body: body,
            credentials: "include",
          }
        );
        if (res.ok) {
          setIsSaving(false);
          setLastSaveTime;
          const data: Article = await res.json();
          if (data.slug) {
            window.history.pushState({}, "", `/editor/${data.slug}`);
            setArticleSlug(data.slug);
            console.log(articleSlug);
            const res = await fetch("/api/revalidate?path=/");
            const ata = await res.json();
            console.log(ata);
            action();
          }
          console.log("Success");
        } else {
          setIsSaving(false);
          console.log("Failed");
          Store.addNotification({
            title: "Error",
            message: "Article upload failed",
            type: "danger",
            insert: "top",
            container: "top-center",
            animationIn: ["animate__animated", "animate__fadeIn"],
            animationOut: ["animate__animated", "animate__fadeOut"],
            dismiss: {
              duration: 5000,
              // onScreen: true,
            },
          });
        }
      } catch (error) {
        console.log(error);
      }
    },
    [articleSlug]
  );
  const DeleteArticle = async () => {
    const csrf = Cookies.get("csrftoken");

    try {
      const res = await fetch(
        `${API_ENDPOINT.article.url}?slug=${articleSlug}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": `${csrf}`,
          },
          credentials: "include",
        }
      );
      if (res.ok) {
        console.log("Article deleted");
        const res = await fetch("/api/revalidate?path=/");
        const ata = await res.json();
        console.log(ata);
        action();
        window.location.href = "/";
      }
    } catch (error) {
      console.log(error);
    }
  };

  const debounce = (callback: any, delay: number) => {
    let timeout: string | number | NodeJS.Timeout | undefined;
    return (...args: any) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => callback(...args), delay);
    };
  };
  const debouncedSave = useMemo(() => {
    return debounce((body: string) => UpdateContent(body), 3000);
  }, [UpdateContent]);

  const titleRef = useRef<HTMLInputElement>(null);

  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && ref.current.contains(event.target as Node)) {
        SlateCustomEditor.insertParagraph(editor);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  });

  // console.log(JSON.parse(initialValue.content));

  return (
    <div className="relative">
      {isSaving ? (
        <div className="absolute right-2 top-10 text-slate-600">Saving....</div>
      ) : (
        <div className="absolute right-2 top-10 text-slate-600">
          <span className="px-2">Saved</span>
          {/* <span>
            {Date.now() - LastSaveTime > 1000
              ? "now"
              : `${Date.now() - LastSaveTime} seconds ago`}
          </span> */}
        </div>
      )}
      <Slate
        editor={editor}
        initialValue={JSON.parse(initialValue.content) || editorValue}
        onChange={(value) => {
          const isAstChange = editor.operations.some(
            (op) => "set_selection" !== op.type
          );
          if (isAstChange) {
            debouncedSave(
              JSON.stringify({
                content: JSON.stringify(value),
              })
            );
          }
        }}
      >
        <SlateToolBar onDelete={DeleteArticle} />
        <div className="w-full px-2  mt-3 h-[calc(100vh-104px)]  overflow-y-scroll">
          <input
            ref={titleRef}
            type="text"
            className="h-10 bg-transparent outline-none text-3xl w-full text-center font-bold "
            onChange={(e) => {
              setValue(e.target.value);
              debouncedSave(
                JSON.stringify({
                  title: e.target.value,
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
            value={value}
            placeholder="Title"
          />
          <TagInput id={id} initialTags={initialValue.tags} />
          <Editable
            decorate={useCallback(decorate, [])}
            spellCheck
            autoFocus
            id="editor"
            className="pt-2"
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
                UpdateContent(
                  JSON.stringify({
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
}

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
