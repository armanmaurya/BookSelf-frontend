// "use client";
import React, { useCallback } from "react";
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
  // Leaf,
} from "@/app/components/slate/element";
import { API_ENDPOINT, NodeType } from "@/app/utils";
import { Descendant, string } from "slate";
import { RenderElementProps, RenderLeafProps } from "slate-react";
import { CustomElement } from "@/app/components/slate/editor";
import { EditButton } from "@/app/components/auth";

// Define a custom Element component for rendering
const Element = (props: RenderElementProps) => {
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
      return <CodeElement {...props} />;
    case "image":
      return <ImageElement {...props} />;
    default:
      return <DefaultElement {...props} />;
  }
};

const ServerLeaf = (props: RenderLeafProps) => {
  return <Leaf {...props} />;
};

export async function getData(
  id: string,
  headers = {
    "Content-Type": "application/json",
    Accept: "application/json",
    "Cookie": "",
  }
): Promise<Response> {
  try {
    const res = await fetch(`${API_ENDPOINT.article.url}?id=${id}`, {
      method: "GET",
      headers: headers,
    });
    if (!res.ok) {
      throw new Error("Network response was not ok");
    }
    return await res.json();
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error; // Rethrow the error to propagate it to the caller
  }
}

export interface Article {
  id: number;
  title: string;
  content: string;
  author: number;
  created_at: string;
}

interface Response {
  data: Article;
  is_owner : boolean;
}

const Page = async ({ params: { id } }: { params: { id: string } }) => {
  const data = await getData(id);

  const content = data.data.content;
  const jsonContent: CustomElement[] = JSON.parse(content);
  return (
    <div className="">
      <EditButton id={id} />
      <div className="flex items-center justify-center p-2">
        <h1 className="text-4xl font-semibold">
          <u>{data.data.title}</u>
        </h1>
      </div>
      <div className="px-4">
        {jsonContent.map((node, i) => (
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
        ))}
      </div>
    </div>
  );
};

export default Page;
