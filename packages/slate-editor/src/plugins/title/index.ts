import {
  Editor as SlateEditor,
  Transforms,
  Element as SlateElement,
  Node,
} from "slate";
import { NodeType } from "../../types";

export const withTitle = (editor: SlateEditor) => {
  const { normalizeNode } = editor;

  editor.normalizeNode = ([node, path]) => {
    if (path.length === 0) {
      // if Document don't contain title node, insert it
      if (
        editor.children.length <= 1 &&
        SlateEditor.string(editor, [0, 0]) === ""
      ) {
        Transforms.insertNodes(
          editor,
          {
            type: NodeType.TITLE,
            children: [{ text: "" }],
          },
          {
            at: path.concat(0),
            select: true,
          }
        );
      }

      for (const [child, childPath] of Node.children(editor, path)) {
        let type: string;
        const slateIndex = childPath[0];
        const enforceType = (type: string) => {
          if (SlateElement.isElement(child) && child.type !== type) {
            Transforms.setNodes(
              editor,
              {
                type: type,
              },
              {
                at: childPath,
              }
            );
          }
        };

        switch (slateIndex) {
          case 0:
            type = NodeType.TITLE;
            enforceType(type);
            break;
          default:
            break;
        }
      }
    }
    return normalizeNode([node, path]);
  };

  return editor;
};
