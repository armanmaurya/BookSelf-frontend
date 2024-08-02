import { Text, View } from "react-native";
import { RenderElementProps, RenderLeafProps } from "slate-react";
import { NodeType } from "../types";
import {
  H1,
  H2,
  H3,
  H4,
  H5,
  H6,
} from "../plugins/heading/elements/NativeRenderHeading";
import { Descendant, Element } from "slate";
import React from "react";
import { Leaf } from "../elements/native/leaf";

export const ArticleRenderer: React.FC = () => {
  return (
    <View>
      <RenderEditorStatic value={content} />
    </View>
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
    // case NodeType.CODE:
    //   return <RenderCode {...props} />;
    // case NodeType.ORDERED_LIST:
    //   return <Ol {...props} />;
    // case NodeType.UNORDERED_LIST:
    //   return <Ul {...props} />;
    // case NodeType.LIST_ITEM:
    //   return <Li {...props} />;
    // case NodeType.IMAGE:
    //   return <RenderImage {...props} />;
    // case NodeType.BLOCKQUOTE:
    //   return <Quote {...props} />;
    // case NodeType.LINK:
    //   return <Anchor {...props} />;
    // default:
    //   return <Default {...props} />;
  }
};

const ServerLeaf = (props: RenderLeafProps) => {
  return <Leaf {...props} />;
};

const content: Descendant[] = [
  {
    id: "heading-one",
    type: NodeType.H1,
    align: "left",
    children: [
      {
        text: "Heading One 1",
      },
    ],
  },
  {
    id: "heading-two 2",
    type: NodeType.H2,
    align: "center",
    children: [
      {
        text: "Heading Two",
      },
    ],
  },
  {
    id: "heading-three",
    type: NodeType.H3,
    align: "left",
    children: [
      {
        text: "Heading Three and this heading of soo cool for you  now you can't see ",
      },
    ],
  },
];
