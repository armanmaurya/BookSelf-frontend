import { Editor, Element as SlateElement, Transforms } from "slate";
import { NodeType } from "../../types";

export const withTabs = (editor: Editor) => {
  const { normalizeNode } = editor;

  editor.normalizeNode = (entry) => {
    const [node, path] = entry;
    if (SlateElement.isElement(node) && node.type === NodeType.TAB_LIST) {
      node.children.forEach((child, index) => {
        // console.log("Tab List", path.concat(index));
        Transforms.setNodes(
          editor,
          {
            index: index,
          },
          {
            at: path.concat(index),
          }
        );
      });
    }
    if (SlateElement.isElement(node) && node.type === NodeType.TABS) {
      let panelIndex = 0;
      node.children.forEach((child, index) => {
        if (child.type === NodeType.TAB_PANEL) {
          // console.log("Tab Panel", path.concat(index));
          Transforms.setNodes(
            editor,
            {
              index: panelIndex,
            },
            {
              at: path.concat(index),
            }
          );
          panelIndex++;
        }
      });
    }
    if (SlateElement.isElement(node) && node.type === NodeType.TAB_PANEL) {
      if (node.children.length === 0) {
        // console.log("Tab Panel is Empty");

        Transforms.insertNodes(
          editor,
          {
            type: NodeType.PARAGRAPH,
            children: [{ text: "", type: "text" , fontSize: 16}],
            align: "left",
          },
          {
            at: path.concat(0),
            // select: true,
          }
        );
        return;
      }
    }
    return normalizeNode(entry);
  };

  return editor;
};
