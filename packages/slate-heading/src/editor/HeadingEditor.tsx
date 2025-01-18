import { Editor, Transforms } from "slate";
import { HeadingType } from "../types/type";
import { HeadingElementType } from "../types/element";

export const HeadingEditor = {
  insertHeading(editor: Editor, type: string) {
    Transforms.insertNodes(editor, {
      type: type as HeadingType,
      id: "1",
      align: "left",
      children: [{ text: "Some text", type: "default" }],
    });
  },
  replaceWithHeading(editor: Editor, headingType: string, blockType: string) {
    if (editor.selection) {
      const currentSelection = editor.selection?.anchor;
      HeadingEditor.insertHeading(editor, headingType);
      Transforms.removeNodes(editor, {
        at: currentSelection.path,
        mode: "highest",
        match: (n) => {
          return (n as HeadingElementType).type === blockType;
        },
      });
    }
  },
};
