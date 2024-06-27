// "use client";
import React from "react";
import { notFound } from "next/navigation";
import {
  H1Element,
  H2Element,
  H3Element,
  H4Element,
  H5Element,
  H6Element,
  CodeElement,
  ImageElement,
  DefaultElement,
  Leaf,
  ListItemElement,
  OrderedListElement,
  UnorderedListElement,
  // Leaf,
} from "@/components/slate/element";
import { NodeType, getData } from "@/app/utils";
import { RenderElementProps, RenderLeafProps } from "slate-react";
import { EditButton } from "@/components/element/button/EditButton";
import { cookies } from "next/headers";
import { Descendant, Element } from "slate";
import Prism from "prismjs";
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

// Define a custom Element component for rendering
const ServerElement = (props: RenderElementProps) => {
  const { attributes, children, element } = props;
  switch (element.type) {
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
      const codeText = element.children
        .map((child: any) => child.text)
        .join("\n");

      const language = element.language;
      if (language) {
        const tokens = Prism.tokenize(codeText, Prism.languages[language]);

        const generateHighlightedCode = (tokens: any) => {
          return tokens.map((token: any, i: number) => {
            if (typeof token === "string") {
              return <span key={i}>{token}</span>;
            } else {
              if (Array.isArray(token.content)) {
                return (
                  <span key={i} className={`token ${token.type}`}>
                    {generateHighlightedCode(token.content)}
                  </span>
                );
              } else {
                return (
                  <span key={i} className={`token ${token.type}`}>
                    {token.content}
                  </span>
                );
              }
            }
          });
        };

        const highlightedCode: React.JSX.Element[] =
          generateHighlightedCode(tokens);

        const newProps = { ...props, children: highlightedCode };
        return <div className="relative">
          <div className="absolute right-1 m-1 text-gray-400">{Language[language as string]}</div>
          <CodeElement {...newProps} />
        </div>
      }
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
};

const Language: { [key: string]: string } = {
  "javascript": "Javascript",
  "jsx": "JSX",
  "typescript": "Typescript",
  "tsx": "TSX",
  "markdown": "Markdown",
  "python": "Python",
  "php": "PHP",
  "sql": "SQL",
  "java": "Java",
};


const ServerLeaf = (props: RenderLeafProps) => {
  return <Leaf {...props} />;
};

const Page = async ({ params: { id } }: { params: { id: string } }) => {
  const cookieStore = cookies();

  const data = await getData(id, {
    "Content-Type": "application/json",
    Accept: "application/json",
    Cookie: `${cookieStore.get("sessionid")?.name}=${
      cookieStore.get("sessionid")?.value
    }`,
  });
  if (!data) {
    return notFound();
  }

  const content = data.data.content;
  // console.log();
  if (content.length === 0) return notFound();

  const jsonContent: Descendant[] = JSON.parse(content);
  return (
    <div className="">
      {data.is_owner && <EditButton id={id} />}
      <div className="flex items-center justify-center p-2">
        <h1 className="text-4xl font-semibold">
          <u>{data.data.title}</u>
        </h1>
      </div>
      <div className="px-4">
        <Render value={jsonContent} />
        {/* {jsonContent.map((node, i) => (
          <Element
            key={i}
            element={node}
            attributes={{
              "data-slate-node": "element",
              ref: null,
            }}
          >
            {node.children.map((leaf, j) => (
              <ServerLeaf
                key={j}
                leaf={leaf}
                text={leaf}
                attributes={{
                  "data-slate-leaf": true,
                }}
              >
                {leaf.text}
              </ServerLeaf>
            ))}
          </Element>
        ))} */}
      </div>
    </div>
  );
};

const Render = ({ value }: { value: Descendant[] }) => {
  return (
    <>
      {value.map((node, i) => {
        if (Element.isElement(node)) {
          return (
            <ServerElement
              key={i}
              element={node}
              attributes={{
                "data-slate-node": "element",
                ref: null,
              }}
            >
              <Render value={node.children} />
            </ServerElement>
          );
        } else {
          return (
            <ServerLeaf
              key={i}
              leaf={node}
              text={node}
              attributes={{
                "data-slate-leaf": true,
              }}
            >
              {node.text}
            </ServerLeaf>
          );
        }
      })}
    </>
  );
};

export default Page;
