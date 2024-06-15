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
import { Descendant } from "slate";
import { RenderElementProps, RenderLeafProps } from "slate-react";
import { CustomElement } from "@/app/components/slate/editor";

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

async function getData(id: string): Promise<Article> {
  try {
    const res = await fetch(`${API_ENDPOINT.article.url}?id=${id}`);
    if (!res.ok) {
      throw new Error("Network response was not ok");
    }
    return await res.json();
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error; // Rethrow the error to propagate it to the caller
  }
}

interface Article {
  id: number;
  title: string;
  content: string;
  author: number;
  created_at: string;
}

const Page = async ({ params: { id } }: { params: { id: string } }) => {
  const data: Article = await getData(id);

  const content = data.content;
  // const content = `[{"type":"heading-one","align":"center","children":[{"text":"Heading One"}]},{"type":"heading-one","align":"center","children":[{"text":"Heading One"}]},{"type":"heading-two","align":"left","children":[{"text":"Heading Two"}]},{"type":"paragraph","align":"center","children":[{"text":"A line of text in a paragraph."},{"text":"Bold","bold":true},{"text":" Some More Text "},{"text":"Italic","italic":true},{"text":" Some more text "},{"text":"Underlined","underline":true},{"text":" Some more text "},{"text":"Bold Italic","bold":true,"italic":true}]},{"type":"heading-three","align":"right","children":[{"text":"Heading Three"}]},{"type":"heading-four","align":"right","children":[{"text":"Heading Four"}]},{"type":"heading-five","align":"center","children":[{"text":"Heading Five"}]},{"type":"heading-six","align":"center","children":[{"text":"Heading Six"}]},{"type":"code","language":"javascript","children":[{"text":"const a = 5;"},{"text":"const b = 10;"}]},{"type":"paragraph","align":"right","children":[{"text":"A line of text \nin a paragraph."},{"text":"Bold","bold":true},{"text":" Some More Text "},{"text":"Italic","italic":true},{"text":" Some more text "},{"text":"Underlined","underline":true},{"text":" Some more text "},{"text":"Bold Italic","bold":true,"italic":true}]}]`;
  const jsonContent: CustomElement[] = JSON.parse(content);
  return (
    <div className="">
      <div className="flex items-center justify-center p-2">
        <h1 className="text-4xl font-semibold">
          <u>{data.title}</u>
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
              <ServerLeaf key={j} leaf={leaf} text={leaf} attributes={{
                'data-slate-leaf': true,
              }}>
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
