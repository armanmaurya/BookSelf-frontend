"use client";
import { NodeType, API_ENDPOINT, Article } from "@/app/utils";
import { useMemo, useState, useCallback, useRef, useEffect } from "react";
import { Store } from "react-notifications-component";
import { withHistory } from "slate-history";
import { withShortcuts, withPaste } from "../plugin";
import {
  withReact,
  RenderElementProps,
  RenderLeafProps,
  Slate,
  Editable,
  ReactEditor,
} from "slate-react";
import {
  H1Element,
  H2Element,
  H3Element,
  H4Element,
  H5Element,
  H6Element,
  CodeElement,
  OrderedListElement,
  UnorderedListElement,
  ListItemElement,
  ImageElement,
  DefaultElement,
  Leaf,
} from "../element";
import {
  Text as SlateText,
  Node as SlateNode,
  Path as SlatePath,
  Range as SlateRange,
  BaseRange,
  Descendant,
  createEditor,
  Element as SlateElement,
  Transforms,
} from "slate";
import { SlateToolBar } from "../toolbar";
import { handleKeyBoardFormating } from "../utils";
import Cookies from "js-cookie";

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

const editorValue: Descendant[] = [
  {
    type: NodeType.PARAGRAPH,
    align: "left",
    children: [{ text: "This is text" }],
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
    () => withPaste(withReact(withHistory(createEditor()))),
    []
  );
  const [value, setValue] = useState(initialValue.title || "");

  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [LastSaveTime, setLastSaveTime] = useState<number>(Date.now());

  const renderElement = useCallback((props: RenderElementProps) => {
    switch (props.element.type) {
      case NodeType.H1:
        return <H1Element {...props} />;
      case NodeType.H2:
        return <H2Element {...props} />;
      case NodeType.H3:
        return <H3Element {...props} />;
      case NodeType.H4:
        return <H4Element {...props} />;
      case NodeType.H5:
        return <H5Element {...props} />;
      case NodeType.H6:
        return <H6Element {...props} />;
      case NodeType.CODE:
        const { attributes, children, element } = props;
        const setLanguage = (language: string) => {
          const path = ReactEditor.findPath(editor, element);
          Transforms.setNodes(editor, { language }, { at: path });
        };
        return (
          <div>
            <div className="absolute right-0">
              <select
                defaultValue={
                  element.type === NodeType.CODE
                    ? (element.language as string)
                    : ""
                }
                name="languages"
                id=""
                className="m-1 rounded"
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
            <CodeElement {...props} />
          </div>
        );
      case NodeType.ORDERED_LIST:
        return <OrderedListElement {...props} />;
      case NodeType.UNORDERED_LIST:
        return <UnorderedListElement {...props} />;
      case NodeType.LIST_ITEM:
        return <ListItemElement {...props} />;
      case "image":
        return <ImageElement {...props} />;
      default:
        return <DefaultElement {...props} />;
    }
  }, []);
  const renderLeaf = useCallback((props: RenderLeafProps) => {
    return <Leaf {...props} />;
  }, []);
  const decorate = useCallback(([node, path]: [SlateNode, number[]]) => {
    const ranges: any[] = [];

    if (node.type === NodeType.CODE && SlateElement.isElement(node)) {
      const text = SlateNode.string(node);
      const language = node.language;

      if (language) {
        const tokens = Prism.tokenize(text, Prism.languages[language]);
        // console.log(tokens);

        const getLength = (token: string | Token): number => {
          if (typeof token === "string") {
            return token.length;
          } else if (typeof token.content === "string") {
            return token.content.length;
          } else {
            if (Array.isArray(token.content))
              return token.content.reduce((l, t) => l + getLength(t), 0);
            // return token.content.reduce((l, t) => l + getLength(t), 0);
          }
          return 0;
        };

        let start = 0;
        const generateRanges = (tokens: (string | Token)[]) => {
          for (const token of tokens) {
            const length = getLength(token);
            const end = start + length;

            if (typeof token !== "string") {
              ranges.push({
                token: true,
                anchor: { path, offset: start },
                focus: { path, offset: end },
                [token.type]: true,
              });
              if (Array.isArray(token.content)) {
                generateRanges(token.content);
              }
            }

            start = end;
          }
        };

        generateRanges(tokens);

      }

      return ranges;
    }

    return ranges;
  }, []);
  const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

  const UpdateContent = useCallback(async (body: string) => {
    setIsSaving(true);
    console.log(body);

    const csrf = Cookies.get("csrftoken");

    try {
      const res = await fetch(`${API_ENDPOINT.article.url}?id=${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": `${csrf}`,
        },
        body: body,
        // body: JSON.stringify({
        //   id: id,
        //   title: value,
        //   content: JSON.stringify(editor.children),
        // }),
        credentials: "include",
      });
      if (res.ok) {
        setIsSaving(false);
        setLastSaveTime;
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
  }, []);
  const DeleteArticle = async () => {
    const csrf = Cookies.get("csrftoken");

    try {
      const res = await fetch(`${API_ENDPOINT.article.url}?id=${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": `${csrf}`,
        },
        credentials: "include",
      });
      if (res.ok) {
        console.log("Article deleted");
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
  console.log(initialValue.tags);
  

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
        <div className="w-full flex flex-col flex-grow px-2  mt-3 h-[calc(100vh-104px)] overflow-auto">
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
          <TagInput id={id} initialTags={initialValue.tags}/>

          <Editable
            decorate={decorate}
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
            }}
          />
        </div>
      </Slate>
    </div>
  );
}

const initialValue2: Descendant[] = [
  {
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
    type: NodeType.H3,
    align: "right",
    children: [
      {
        text: "Heading Three",
      },
    ],
  },
  {
    type: NodeType.H4,
    align: "right",
    children: [
      {
        text: "Heading Four",
      },
    ],
  },
  {
    type: NodeType.H5,
    align: "center",
    children: [
      {
        text: "Heading Five",
      },
    ],
  },
  {
    type: NodeType.H6,
    align: "center",
    children: [
      {
        text: "Heading Six",
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
