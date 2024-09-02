import {
  H1,
  H2,
  H3,
  H4,
  H5,
  H6,
  Li,
  Ol,
  Ul,
  DefalutLeaf,
  Default,
  // Image,
  Quote,
  Anchor,
} from "../elements";
import React from "react";

import { RenderElementProps, RenderLeafProps } from "slate-react";
import { NodeType } from "../types";
import { Descendant, Element } from "slate";
import { RenderImage } from "../plugins/image/elements/RenderImage";
import { RenderCode } from "../plugins/code/elements/RenderCode";
import { RenderQuote } from "../plugins/quote/elements/RenderQuote";
import {
  RenderTab,
  RenderTabList,
  RenderTabPanel,
  RenderTabs,
} from "../plugins/tab-list/elements/render";

export const RenderContent = ({
  value,
  title,
}: {
  value: Descendant[];
  title: string;
}) => {
  return (
    <div className="flex flex-col w-full p-2">
      {/* <div className="w-full">
        <img
          src="https://miro.medium.com/v2/resize:fit:720/format:webp/1*kyhNfzNWquucFB7EQBubPg.jpeg"
          className="sm:h-80 w-full object-cover"
          alt=""
        />
      </div> */}
      <h1 className="text-5xl font-extrabold h-14 flex items-center">
        {title || "Untitled"}
      </h1>
      <div>
        <RenderEditorStatic value={value} />
      </div>
    </div>
  );
};

export const RenderEditorStatic = ({ value }: { value: Descendant[] }) => {
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
              <RenderEditorStatic value={node.children} />
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
      return <RenderCode {...props} />;
    case NodeType.ORDERED_LIST:
      return <Ol {...props} />;
    case NodeType.UNORDERED_LIST:
      return <Ul {...props} />;
    case NodeType.LIST_ITEM:
      return <Li {...props} />;
    case NodeType.IMAGE:
      return <RenderImage {...props} />;
    case NodeType.BLOCKQUOTE:
      return <RenderQuote {...props} />;
    case NodeType.LINK:
      return <Anchor {...props} />;
    case NodeType.TABS:
      return <RenderTabs {...props} />;
    case NodeType.TAB_LIST:
      return <RenderTabList {...props} />;
    case NodeType.TAB:
      return <RenderTab {...props} />;
    case NodeType.TAB_PANEL:
      return <RenderTabPanel {...props} />;
    default:
      return <Default {...props} />;
  }
};

const ServerLeaf = (props: RenderLeafProps) => {
  return <DefalutLeaf {...props} />;
};
