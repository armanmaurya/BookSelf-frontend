import { Editor, Transforms, Element, Range } from "slate";
import { HeadingType } from "../types/type";
import { HeadingElementType } from "../types/element";

export interface HeadingEditor {
  replaceWithHeading: (from: string, to: string) => void,
  isHeadingActive: (editor: Editor, type: string) => void
}

export const HeadingEditor = {
  // insertHeading(editor: Editor, type: string) {
  //   Transforms.insertNodes(editor, {
  //     type: type as HeadingType,
  //     id: "1",
  //     align: "left",
  //     children: [{ text: "Some text", type: "default" }],
  //   });
  // },
  // replaceWithHeading(editor: Editor, headingType: string, blockType: string) {
  //   if (editor.selection) {
  //     const currentSelection = editor.selection?.anchor;
  //     HeadingEditor.insertHeading(editor, headingType);
  //     Transforms.removeNodes(editor, {
  //       at: currentSelection.path,
  //       mode: "highest",
  //       match: (n) => {
  //         return (n as HeadingElementType).type === blockType;
  //       },
  //     });
  //   }
  // },

  toggleHeading(editor: Editor, type: string) {
    const isActive = HeadingEditor.isHeadingActive(editor, type);
    if (editor.selection && Range.isCollapsed(editor.selection)) {
      Transforms.setNodes(
        editor,
        {
          type: type as HeadingType
        },
        {
          match: (n) => Element.isElement(n)
        }
      )
    }
  },

  isHeadingActive(editor: Editor, type: string) {
      const [match] = Editor.nodes(editor, {
        match: (n) => Element.isElement(n) && n.type === type,
      });
      return !!match;
  }

};
