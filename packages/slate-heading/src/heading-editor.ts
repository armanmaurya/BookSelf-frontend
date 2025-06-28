import { Editor, Transforms, Element, Range } from "slate";
import { HeadingType } from "./types/type";
import { HeadingElementType } from "./types/element";

export interface HeadingEditor {
  insertHeading: (editor: Editor, type: HeadingType) => void;
  getHeadingType: (editor: Editor) => HeadingType | undefined;
  isHeadingActive: (editor: Editor, type: string) => void;
}

export const HeadingEditor = {
  insertHeading(editor: Editor, type: HeadingType, text: string = "") {
    if (editor.selection && Range.isCollapsed(editor.selection)) {
      Transforms.insertNodes(
        editor,
        {
          type: type,
          align: "left",
          children: [{ text: text, type: "heading" }],
        } as HeadingElementType,
        { at: Editor.after(editor, editor.selection.focus, { unit: "block" }) }
      );
    }
  },

  getHeadingType(editor: Editor) {
    const [match] = Editor.nodes(editor, {
      match: (n) =>
        Element.isElement(n) &&
        ((n as HeadingElementType).type === HeadingType.H1 ||
          (n as HeadingElementType).type === HeadingType.H2 ||
          (n as HeadingElementType).type === HeadingType.H3 ||
          (n as HeadingElementType).type === HeadingType.H4 ||
          (n as HeadingElementType).type === HeadingType.H5 ||
          (n as HeadingElementType).type === HeadingType.H6),
    });
    return match ? (match[0] as HeadingElementType).type : undefined;
  },

  isHeadingActive(editor: Editor) {
    const [match] = Editor.nodes(editor, {
      match: (n) =>
        Element.isElement(n) &&
        ((n as HeadingElementType).type === HeadingType.H1 ||
          (n as HeadingElementType).type === HeadingType.H2 ||
          (n as HeadingElementType).type === HeadingType.H3 ||
          (n as HeadingElementType).type === HeadingType.H4 ||
          (n as HeadingElementType).type === HeadingType.H5 ||
          (n as HeadingElementType).type === HeadingType.H6),
    });
    return !!match;
  },
};
