import { Editor, Transforms, Range, Element } from "slate";
import { HeadingEditor } from "./editor/HeadingEditor";
import { HeadingType } from "./types/type";

export const withHeading = (types: string, editor: Editor) => {
  const { insertText } = editor;
  editor.insertText = (text) => {
    if (editor.selection && Range.isCollapsed(editor.selection)) {
      insertText(text);
      const blockText = editor.string(editor.selection?.anchor.path);
      // console.log("blockText", blockText);
      // Parse the Text and get # or ## or ### or ####
      switch (blockText) {
        case "# ":
          editor.replaceWithHeading(types, HeadingType.H1);
          break;
        case "## ":
          editor.replaceWithHeading(types, HeadingType.H2);
          break;
        case "### ":
          editor.replaceWithHeading(types, HeadingType.H3);
          break;
        case "#### ":
          editor.replaceWithHeading(types, HeadingType.H4);
          break;
        case "##### ":
          editor.replaceWithHeading(types, HeadingType.H5);
          break;
        case "###### ":
          editor.replaceWithHeading(types, HeadingType.H6);
          break;
      }
    }
  };

  editor.replaceWithHeading = (from, to) => {
    // const isActive = HeadingEditor.isHeadingActive(editor, type);
    if (editor.selection && Range.isCollapsed(editor.selection)) {
      const headingElement: Element = {
        type: to as HeadingType,
        children: [
          {
            type: "default",
            text: "",
          },
        ],
        align: "left",
      };
      if (editor.selection) {
        const currentSelection = editor.selection.anchor;
        Transforms.insertNodes(editor, headingElement);
        Transforms.removeNodes(editor, {
          at: currentSelection.path,
          mode: "highest",
          match: (n) => {
            return (n as Element).type === from;
          },
        });
      }
    }
  };

  return editor;
};
