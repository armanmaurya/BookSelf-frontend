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
  Leaf,
  Default,
  // Image,
  Quote,
  Anchor,
} from "../elements";

import { RenderElementProps, RenderLeafProps } from "slate-react";
import { NodeType } from "../types";
import { Descendant, Element } from "slate";
import { RenderImage } from "../plugins/image/elements/RenderImage";
import { RenderCode } from "../plugins/code/elements/RenderCode";

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
      return <Quote {...props} />;
    case NodeType.LINK:
      return <Anchor {...props} />;
    default:
      return <Default {...props} />;
  }
};

const ServerLeaf = (props: RenderLeafProps) => {
  return <Leaf {...props} />;
};

