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

  const tableofcontent = constructTableOfContents(jsonContent);

  return (
    <div className="">
      {data.is_owner && <EditButton id={id} />}
      <div className="flex">
        <div className="px-4 flex-1 overflow-auto h-[calc(100vh-48px)]">
          <div className="flex items-center justify-center p-1">
            <h1 className="text-4xl font-semibold">
              <u>{data.data.title || "Untitled"}</u>
            </h1>
          </div>
          <RenderPage value={jsonContent} />
        </div>
        <div className="p-3 flex flex-col">
          <RenderTableOfContents value={tableofcontent} />
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

type TableOfContentType = {
  id: string;
  text: string;
  children: TableOfContentType[];
  headingNumber: number;
};

/*When you push an object to the stack, you are not creating a new copy of the object; 
you are merely storing a reference to the same object in memory. 
Thus, when you update the children property of an object in the stack, 
the same object in the tableOfContents is also updated because they are references to the same object. */
const constructTableOfContents = (value: Descendant[]) => {
  let tableOfContents: TableOfContentType[] = [];
  let stack: any[] = [];

  value.forEach((node, i) => {
    if (
      Element.isElement(node) &&
      (node.type === NodeType.H1 ||
        node.type === NodeType.H2 ||
        node.type === NodeType.H3 ||
        node.type === NodeType.H4 ||
        node.type === NodeType.H5 ||
        node.type === NodeType.H6)
    ) {
      // console.log(tableOfContents);

      const headingNumber = headings[node.type as string];
      const Item = {
        id: `${node.id}`,
        text: node.children[0].text,
        children: [],
        headingNumber: headingNumber,
      };

      while (
        stack.length > 0 &&
        stack[stack.length - 1].headingNumber >= headingNumber
      ) {
        stack.pop();
      }

      if (stack.length > 0) {
        // If we update the value of the children property of the object in the stack, the same object in the tableOfContents is also updated because they are references to the same object.
        stack[stack.length - 1].children.push(Item);
      } else {
        // H1 Item added to root
        tableOfContents.push(Item);
      }

      // We also push the Item to the stack as if we update the value of the children property of the object in the stack, the same object in the tableOfContents is also updated because they are references to the same object.
      stack.push(Item);
      // console.log(JSON.stringify(stack, null, 2));
    }
  });

  return tableOfContents;
};

// Rucussive function to render the table of contents
const RenderTableOfContents = ({ value, className }: { value: TableOfContentType[]; className?:string }) => {
  return (
    <>
      {value.map((node, i) => {
        if (node.children.length > 0) {
          return (
            <div key={i} className={`${className}`}>
              <a
                className="text-blue-400 hover:text-blue-500"
                href={`#${node.id}`}
              >
                {node.text}
              </a>
              <RenderTableOfContents className="pl-4"  value={node.children} />
            </div>
          );
        } else {
          return (
            <div className={`${className}`} key={i} >
              <a
                className="py-1 text-blue-400 hover:text-blue-500"
                href={`#${node.id}`}
              >
                {node.text}
              </a>
            </div>
          );
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
