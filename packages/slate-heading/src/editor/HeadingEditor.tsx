import { Editor, Transforms, Element, Range } from "slate";
import { HeadingType } from "../types/type";
import { HeadingElementType } from "../types/element";

export interface HeadingEditor {
  replaceWithHeading: (from: string, to: string) => void;
  isHeadingActive: (editor: Editor, type: string) => void;
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

  getHeadingType(editor: Editor) {
    const [match] = Editor.nodes(editor, {
      match: (n) =>
        Element.isElement(n) &&
        (n.type === HeadingType.H1 ||
          n.type === HeadingType.H2 ||
          n.type === HeadingType.H3 ||
          n.type === HeadingType.H4 ||
          n.type === HeadingType.H5 ||
          n.type === HeadingType.H6),
      mode: "lowest"
    });
    return (match[0] as Element).type;
  },

  toggleHeading(editor: Editor, type: string) {
    if (editor.selection && Range.isCollapsed(editor.selection)) {
      Transforms.setNodes(
        editor,
        {
          type: type as HeadingType,
        },
        {
          match: (n) => Element.isElement(n),
        }
      );
    }
  },

  isHeadingActive(editor: Editor) {
    const [match] = Editor.nodes(editor, {
      match: (n) => Element.isElement(n) && (n.type === HeadingType.H1 || n.type === HeadingType.H2 || n.type === HeadingType.H3 || n.type === HeadingType.H4 || n.type === HeadingType.H5 || n.type === HeadingType.H6),
    });
    return !!match;
  },
};
