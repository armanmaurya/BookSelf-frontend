import { Editor, Transforms, Range, Element } from "slate";
import { HeadingEditor } from "./editor/HeadingEditor";
import { HeadingType } from "./types/type";

export const withHeading = (type: string, editor: Editor) => {
  const { insertText } = editor;
  editor.insertText = (text) => {
    if (editor.selection && Range.isCollapsed(editor.selection)) {
      insertText(text);
      let fromtype = type;
      const isActive = HeadingEditor.isHeadingActive(editor);
      if (isActive) {
         const headingType = HeadingEditor.getHeadingType(editor);
         fromtype = headingType ?? type;
      }
      const blockText = editor.string(editor.selection?.anchor.path);
      switch (blockText) {
        case "# ":
          if (fromtype !== HeadingType.H1) {
            editor.replaceWithHeading(type, HeadingType.H1);
          }
          break;
        case "## ":
          if (fromtype !== HeadingType.H2) {
            editor.replaceWithHeading(type, HeadingType.H2);
          }
          break;
        case "### ":
          if (fromtype !== HeadingType.H3) {
            editor.replaceWithHeading(type, HeadingType.H3);
          }
          break;
        case "#### ":
          if (fromtype !== HeadingType.H4) {
            editor.replaceWithHeading(type, HeadingType.H4);
          }
          break;
        case "##### ":
          if (fromtype !== HeadingType.H5) {
            editor.replaceWithHeading(type, HeadingType.H5);
          }
          break;
        case "###### ":
          if (fromtype !== HeadingType.H6) {
            editor.replaceWithHeading(type, HeadingType.H6);
          }
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
            type: "heading",
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
