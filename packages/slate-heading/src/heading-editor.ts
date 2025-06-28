import { Editor, Transforms, Element, Range, BaseEditor } from "slate";
import { HeadingType } from "./types/type";
import { HeadingElementType } from "./types/element";

export interface HeadingEditor extends BaseEditor {
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

  setHeadingId(editor: Editor, id: string) {
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
    // slugify the id
    id = id
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

    if (!match) {
      return;
    }

    const allHeadings = Array.from(
      Editor.nodes(editor, {
        match: (n) =>
          Element.isElement(n) &&
          ((n as HeadingElementType).type === HeadingType.H1 ||
            (n as HeadingElementType).type === HeadingType.H2 ||
            (n as HeadingElementType).type === HeadingType.H3 ||
            (n as HeadingElementType).type === HeadingType.H4 ||
            (n as HeadingElementType).type === HeadingType.H5 ||
            (n as HeadingElementType).type === HeadingType.H6),
      })
    );

    const numberOfDuplicates = allHeadings.filter(
      ([node]) => (node as HeadingElementType).headingId === id
    ).length;

    Transforms.setNodes(
      editor,
      {
        headingId: numberOfDuplicates > 0 ? `${id}-${numberOfDuplicates}` : id,
      } as Partial<HeadingElementType>,
      { at: match[1] }
    );
  },

  /**
   * Aligns the currently selected heading node in the editor to the specified alignment.
   *
   * This method searches for the first heading node (H1-H6) in the current selection.
   * If a heading node is found, it updates its `align` property to the provided value.
   *
   * @param editor - The Slate editor instance extended with heading support.
   * @param align - The desired text alignment for the heading. Can be "left", "center", "right", or "justify".
   */
  alignNode(
    editor: HeadingEditor,
    align: "left" | "center" | "right" | "justify"
  ) {
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

    if (!match) {
      return;
    }

    Transforms.setNodes(
      editor,
      { align: align } as Partial<HeadingElementType>,
      {
        match: (n) =>
          Element.isElement(n) &&
          ((n as HeadingElementType).type === HeadingType.H1 ||
            (n as HeadingElementType).type === HeadingType.H2 ||
            (n as HeadingElementType).type === HeadingType.H3 ||
            (n as HeadingElementType).type === HeadingType.H4 ||
            (n as HeadingElementType).type === HeadingType.H5 ||
            (n as HeadingElementType).type === HeadingType.H6),
      }
    );
  },

  /**
   * Retrieves the text alignment of the first heading element (H1-H6) found in the Slate editor.
   *
   * @param editor - The Slate editor instance to search for heading elements.
   * @returns The alignment value ("left", "center", "right", or "justify") of the matched heading element,
   *          or `undefined` if no heading element is found.
   */
  getAlignment(
    editor: Editor
  ): "left" | "center" | "right" | "justify" | undefined {
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
    return match ? (match[0] as HeadingElementType).align : undefined;
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
