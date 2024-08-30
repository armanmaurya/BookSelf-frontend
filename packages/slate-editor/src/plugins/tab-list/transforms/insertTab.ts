import { Editor, Transforms, Path, Element } from "slate";
import { ReactEditor } from "slate-react";
import { NodeType } from "../../../types";

export const insertTab = (editor: Editor) => {
  if (editor.selection) {
    const [currentTab] = Editor.nodes(editor, {
      match: (n) => n.type === NodeType.TAB,
      mode: "lowest",
    });
    const currentTabPath = ReactEditor.findPath(
      editor,

      currentTab[0]
    );

    Transforms.insertNodes(
      editor,
      {
        type: NodeType.TAB,
        children: [{ text: "Untitled" }],
        index: currentTabPath[currentTabPath.length - 1] + 1,
      },
      {
        at: Path.next(currentTabPath),
        select: true,
      }
    );

    const [tabs] = Editor.nodes(editor, {
      match: (n) => n.type === NodeType.TABS && Element.isElement(n),
      mode: "lowest",
    });

    const currentTabPanelPath = [
      ...tabs[1],
      currentTabPath[currentTabPath.length - 1] + 1,
    ];

    Transforms.insertNodes(
      editor,
      {
        type: NodeType.TAB_PANEL,
        children: [{ type: NodeType.PARAGRAPH, children: [{ text: "" }] }],
        index: currentTabPath[currentTabPath.length - 1] + 1,
      },
      {
        at: Path.next(currentTabPanelPath),
      }
    );
  }
};
