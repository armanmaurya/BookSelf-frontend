import {
  H1,
  H2,
  H3,
  H4,
  H5,
  H6,
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
import { RenderParagraph } from "@bookself/slate-paragraph";
import { ParagraphLeaf } from "@bookself/slate-paragraph";
import { HeadingType } from "@bookself/slate-heading";
import { ListItem, OrderedList, UnorderedList } from "@bookself/slate-list";


export const RenderContent = ({
  value,
  title,
  children,
}: {
  value: any[];
  title: string;
  children?: React.ReactNode;
}) => {
  return (
    <div className="flex flex-col w-full h-full">
      {/* <div className="w-full">
        <img
          src="https://miro.medium.com/v2/resize:fit:720/format:webp/1*kyhNfzNWquucFB7EQBubPg.jpeg"
          className="sm:h-80 w-full object-cover"
          alt=""
        />
      </div> */}
      {/* <h1 className="text-5xl font-extrabold h-14 flex items-center">
        {title || "Untitled"}
      </h1> */}
      {value && (
        <div>
          {
            value.length === 0 ? (
              <div className="h-full">
                {children}
              </div>
            ) : (
              <div className="">
                <RenderEditorStatic value={value} />
              </div>
            )
          }
        </div>
      )}

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
              <RenderEditorStatic value={node.children as Descendant[]} />
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
  switch (props.element.type) {
    case HeadingType.H1:
      return <H1 {...props} />;
    case HeadingType.H2:
      return <H2 {...props} />;
    case HeadingType.H3:
      return <H3 {...props} />;
    case HeadingType.H4:
      return <H4 {...props} />;
    case HeadingType.H5:
      return <H5 {...props} />;
    case HeadingType.H6:
      return <H6 {...props} />;
    case NodeType.CODE:
      return <RenderCode {...props} />;
    case NodeType.ORDERED_LIST:
      return <OrderedList {...props} />;
    case NodeType.UNORDERED_LIST:
      return <UnorderedList {...props} />;
    case NodeType.LIST_ITEM:
      return <ListItem {...props} />;
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
    case NodeType.PARAGRAPH:
      return <RenderParagraph {...props} element={props.element} />
    default:
      return <Default {...props} />;
  }
};

const ServerLeaf = (props: RenderLeafProps) => {
  switch (props.leaf.type) {
    case "text":
      return <ParagraphLeaf {...props} leaf={props.leaf} />
    default:
      return <DefalutLeaf {...props} />;
  }
};
