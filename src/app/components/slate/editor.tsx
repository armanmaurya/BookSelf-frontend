"use client";
// Import React dependencies.
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { SlateCustomEditor, SlateToMarkdown } from "./utils";
import {
  H1Element,
  H2Element,
  H3Element,
  H4Element,
  H5Element,
  H6Element,
  DefaultElement,
  CodeElement,
  ImageElement,
  Leaf,
  OrderedListElement,
  UnorderedListElement,
  ListItemElement,
} from "./element";

import {
  createEditor,
  Descendant,
  Editor as SlateEditor,
  Element as SlateElement,
  Node as SlateNode,
  Text,
  Point,
  Range,
} from "slate";
// Import the Slate components and React plugin.
import {
  Slate,
  Editable,
  withReact,
  RenderElementProps,
  RenderLeafProps,
} from "slate-react";

import { withHistory } from "slate-history";
import { withMarkdownShortcuts } from "./plugin";
import { handleKeyBoardFormating, markdownTokenizer } from "./utils";
import { SlateToolBar } from "./toolbar";
import Cookies from "js-cookie";

// Initial value of the editor.
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

// --------------------------------- Editor --------------------------------- //

export function MarkdownEditor() {
  const editor = useMemo(
    () => withMarkdownShortcuts(withReact(withHistory(createEditor()))),
    []
  );

  // Define a rendering function based on the element passed to `props`. We use
  // `useCallback` here to memoize the function for subsequent renders.
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
      case "image":
        return <ImageElement {...props} />;
      default:
        return <DefaultElement {...props} />;
    }
  }, []);

  // Define a leaf rendering function that is memoized with `useCallback`.
  const renderLeaf = useCallback((props: RenderLeafProps) => {
    return <Leaf {...props} />;
  }, []);

  return (
    <div>
      <Slate
        editor={editor}
        initialValue={initialValue2}
        onChange={(value) => {
          const isAstChange = editor.operations.some(
            (op) => "set_selection" !== op.type
          );
          if (isAstChange) {
            // Save the value to Local Storage.
            // const content = JSON.stringify(value);
            // console.log(content);
            // localStorage.setItem("content", content);
          }

          // // Testing some features
          // getNodeText();
        }}
      >
        <Editable
          spellCheck
          autoFocus
          className="p-4 font-serif"
          renderElement={renderElement}
          renderLeaf={renderLeaf}
          //   onKeyDown={onKeyDown}
          placeholder="Start typing..."
        />
      </Slate>
    </div>
  );
}

const editorValue: Descendant[] = [
  {
    type: NodeType.PARAGRAPH,
    align: "left",
    children: [{ text: "This is text" }],
  },
];

export function WSGIEditor({
  initialValue = editorValue,
  title,
  id,
}: {
  initialValue?: Descendant[];
  title?: string;
  id: string;
}) {
  const editor = useMemo(() => withReact(withHistory(createEditor())), []);
  const [value, setValue] = useState(title || "");

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

  const SubmitContent = async () => {
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
        console.log("Success");
        console.log(await res.json());

        Store.addNotification({
          title: "Success",
          message: "Article uploaded successfully",
          type: "success",
          insert: "top",
          container: "top-center",
          animationIn: ["animate__animated", "animate__fadeIn"],
          animationOut: ["animate__animated", "animate__fadeOut"],
          dismiss: {
            duration: 5000,
            // onScreen: true,
          },
        });

        await delay(2000);
        // window.location.href = "/";
      } else {
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

  return (
    <div>
      {/* {isLoading ? <div className="absolute bg-yellow-400 h-full w-full z-10"></div> : ""} */}
      <Slate
        editor={editor}
        initialValue={initialValue2}
        onChange={(value) => {
          const isAstChange = editor.operations.some(
            (op) => "set_selection" !== op.type
          );
          if (isAstChange) {
            // Save the value to Local Storage.
            // setValue(value);
            // const content = JSON.stringify(value);
            // console.log(content);
            // localStorage.setItem("content", content);
          }
        }}
      >
        <SlateToolBar onSubmit={SubmitContent} />
        <div className="w-full flex items-center justify-center mt-3">
          <input
            type="text"
            className="h-10 bg-transparent outline-none text-3xl w-full text-center font-bold "
            onBlur={(e) => {
              setValue(e.target.value);
            }}
            onChange={(e) => {
              setValue(e.target.value);
            }}
            value={value}
            placeholder="Title"
          />
        </div>
        <Editable
          spellCheck
          autoFocus
          className="p-4 font-serif"
          renderElement={renderElement}
          renderLeaf={renderLeaf}
          onKeyDown={(event) => handleKeyBoardFormating(event, editor)}
        />
      </Slate>
      {/* <button onClick={SubmitContent} className="bg-blue-400 mb-14">
        what
      </button> */}
    </div>
  );
}

import Prism, { Token } from "prismjs";
import "prismjs/components/prism-markdown";
import { css } from "@emotion/css";
import { API_ENDPOINT, NodeType } from "@/app/utils";
import { Store } from "react-notifications-component";

export const MarkdownPreviewExample = () => {
  //   const renderLeaf = useCallback((props) => <Lef {...props} />, []);
  const editor = useMemo(() => withHistory(withReact(createEditor())), []);
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
      default:
        return <DefaultElement {...props} />;
    }
  }, []);
  const renderLeaf = useCallback((props: RenderLeafProps) => {
    return <Lef {...props} />;
  }, []);

  const decorate = useCallback(([node, path]: [SlateNode, number[]]) => {
    const ranges: Range[] = [];

    if (!Text.isText(node)) {
      return ranges;
    }

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

    // console.log(node.text);

    const tokens = Prism.tokenize(node.text, Prism.languages.markdown);
    const tokens2 = markdownTokenizer(node.text);
    // console.log(tokens2);

    let start = 0;
    // console.log(tokens);
    // console.log(tokens);
    // console.log(tokens)

    for (const token of tokens2) {
      const length = getLength(token);
      const end = start + length;

      if (typeof token !== "string") {
        ranges.push({
          [token.type]: true,
          anchor: { path, offset: start },
          focus: { path, offset: end },
        });
        // console.log("This is runned");
      }

      start = end;
    }
    // console.log(ranges)
    return ranges;
  }, []);

  return (
    <Slate editor={editor} initialValue={initialValue2}>
      <Editable
        decorate={decorate}
        renderLeaf={renderLeaf}
        renderElement={renderElement}
        placeholder="Write some markdown..."
      />
    </Slate>
  );
};

const Lef = ({ attributes, children, leaf }: RenderLeafProps) => {
  return (
    <span
      {...attributes}
      className={`
        ${leaf.bold ? "font-bold" : ""}
        ${leaf.italic ? "italic" : ""}
        ${leaf.underlined ? "underline" : ""}
        ${leaf.h1 ? "text-4xl font-bold" : ""}
        ${leaf.h2 ? "text-3xl font-bold" : ""}
        ${leaf.h3 ? "text-2xl font-bold" : ""}
        ${leaf.h4 ? "text-xl font-bold" : ""}
        ${leaf.h5 ? "text-lg font-bold" : ""}
        ${leaf.h6 ? "text-base font-bold" : ""}
        ${leaf.bold_italic ? "font-bold italic" : ""}
        ${leaf.strike ? "line-through" : ""}
        ${
          leaf.list &&
          css`
            padding-left: 10px;
            font-size: 20px;
            line-height: 10px;
          `
        }
        ${
          leaf.hr &&
          css`
            display: block;
            text-align: center;
            border-bottom: 2px solid #ddd;
          `
        }
        ${
          leaf.blockquote &&
          css`
            display: inline-block;
            border-left: 2px solid #ddd;
            padding-left: 10px;
            color: #aaa;
            font-style: italic;
          `
        }
        ${
          leaf.code &&
          css`
            font-family: monospace;
            background-color: #eee;
            padding: 3px;
          `
        }
      `}
    >
      {children}
    </span>
  );
};
