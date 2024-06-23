"use client";
import { NodeType, API_ENDPOINT } from "@/app/utils";
import { useMemo, useState, useCallback, useRef, useEffect } from "react";
import { Store } from "react-notifications-component";
import { Descendant, createEditor } from "slate";
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
import { SlateToolBar } from "../toolbar";
import { handleKeyBoardFormating } from "../utils";
import Cookies from "js-cookie";

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
}

export function WSGIEditor({
  initialValue = editorValue,
  title,
  id,
}: {
  initialValue?: Descendant[];
  title?: string;
  id: string;
}) {
  const editor = useMemo(
    () => withPaste(withReact(withHistory(createEditor()))),
    []
  );
  const [value, setValue] = useState(title || "");
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
        return <CodeElement {...props} />;
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

  const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

  const UpdateContent = async () => {
    setIsSaving(true);
    const csrf = Cookies.get("csrftoken");

    try {
      const res = await fetch(`${API_ENDPOINT.article.url}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": `${csrf}`,
        },
        body: JSON.stringify({
          id: id,
          title: value,
          content: JSON.stringify(editor.children),
        }),
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
  };
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
      })
      if (res.ok) {
        console.log("Article deleted");
        window.location.href = "/";
      }
    } catch (error) {
      console.log(error);
      
    }
  }

  const debounce = (callback: () => {}, delay: number) => {
    let timeout: string | number | NodeJS.Timeout | undefined;
    return (...args: any) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => callback(), delay);
    };
  };
  const debouncedSave = debounce(UpdateContent, 3000);

  const titleRef = useRef<HTMLInputElement>(null);

  return (
    <div className="relative">
      {isSaving ? (
        <div className="absolute right-2 top-10 text-slate-600">Saving....</div>
      ) : (
        <div className="absolute right-2 top-10 text-slate-600">
          <span className="px-2">Saved</span>
          <span>
            {Date.now() - LastSaveTime > 1000
              ? "now"
              : `${Date.now() - LastSaveTime} seconds ago`}
          </span>
        </div>
      )}
      <Slate
        editor={editor}
        initialValue={initialValue}
        onChange={(value) => {
          const isAstChange = editor.operations.some(
            (op) => "set_selection" !== op.type
          );
          if (isAstChange) {
            debouncedSave();

            // Save the value to Local Storage.

            // const content = JSON.stringify(value);
            // console.log(content);
            // localStorage.setItem("content", content);
          }
        }}
      >
        <SlateToolBar onSubmit={UpdateContent} onDelete={DeleteArticle}/>
        <div className="w-full flex flex-col flex-grow  mt-3 h-[calc(100vh-104px)] overflow-auto">
          <input
            ref={titleRef}
            type="text"
            className="h-10 bg-transparent outline-none text-3xl w-full text-center font-bold "
            onBlur={(e) => {
              setValue(e.target.value);
            }}
            onChange={(e) => {
              setValue(e.target.value);
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
          <Editable
            spellCheck
            autoFocus
            id="editor"
            className="p-4 font-serif"
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
