// "use client";
import React from "react";
import { notFound } from "next/navigation";

import {
  H1,
  H2,
  H3,
  H4,
  H5,
  H6,
  Code,
  Li,
  Ol,
  Ul,
  Leaf,
  Default,
  Image,
  Quote,
  Anchor,
} from "@/components/slate/elements";
import { getData } from "@/app/utils";
import { NodeType } from "@/components/slate/types";
import { RenderElementProps, RenderLeafProps } from "slate-react";
import { EditButton } from "@/components/element/button/EditButton";
import { cookies } from "next/headers";
import { Descendant, Element, node, Text } from "slate";
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
        return (
          <div className="relative">
            <div className="absolute right-1 m-1 text-gray-400">
              {Language[language as string]}
            </div>
            <Code {...newProps} />
          </div>
        );
      }
      return <Code {...props} />;
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
      return <Anchor {...props} />;
    default:
      return <Default {...props} />;
  }
};

const Language: { [key: string]: string } = {
  javascript: "Javascript",
  jsx: "JSX",
  typescript: "Typescript",
  tsx: "TSX",
  markdown: "Markdown",
  python: "Python",
  php: "PHP",
  sql: "SQL",
  java: "Java",
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
  // if (!content) return notFound();

  const jsonContent: Descendant[] = JSON.parse(content) || [];
  return (
    <div className="">
      {data.is_owner && <EditButton id={id} />}
      <div className="flex items-center justify-center p-2">
        <h1 className="text-4xl font-semibold">
          <u>{data.data.title || "Untitled"}</u>
        </h1>
      </div>
      <div className="flex">
        <div className="px-4 flex-1">
          <RenderPage value={jsonContent} />
        </div>
        <div className="mx-4 px-4">
          <RenderTableOfContents value={jsonContent} />
        </div>
      </div>
    </div>
  );
};

const headings: { [key: string]: number } = {
  "heading-one": 1,
  "heading-two": 2,
  "heading-three": 3,
  "heading-four": 4,
  "heading-five": 5,
  "heading-six": 6,
};

const RenderTableOfContents = ({ value }: { value: Descendant[] }) => {
  let previousHeadingNumber: number;
  return (
    <>
      {value.map((node, i) => {
        if (Element.isElement(node)) {
          const headingNumber = headings[node.type as string];

          if (headingNumber) {
            if (headingNumber > previousHeadingNumber) {
              return <div key={i} className="pl-4">{node.children[0].text}</div>;
            }
            previousHeadingNumber = headingNumber;
            return <div key={i}>{node.children[0].text}</div>;
          }
        }
      })}
    </>
  );
};

const RenderPage = ({ value }: { value: Descendant[] }) => {
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
              <RenderPage value={node.children} />
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
