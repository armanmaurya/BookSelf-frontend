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
import { NodeType, getData } from "@/app/utils";
import { RenderElementProps, RenderLeafProps } from "slate-react";
import { CustomElement } from "@/app/components/slate/editor";
import { EditButton } from "@/app/components/decoration";
import { cookies } from "next/headers";

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

const Page = async ({ params: { id } }: { params: { id: string } }) => {
  const cookieStore = cookies();

  const data = await getData(id, {
    "Content-Type": "application/json",
    Accept: "application/json",
    "Cookie": `${cookieStore.get("sessionid")?.name}=${cookieStore.get("sessionid")?.value}`,
  });

  const content = data.data.content;
  // console.log();
  

  const jsonContent: CustomElement[] = JSON.parse(content);
  return (
    <div className="">
      {data.is_owner && <EditButton id={id} />}
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
