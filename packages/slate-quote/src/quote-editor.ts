import { BaseEditor, BaseElement, Editor, Element, Transforms } from "slate";
import { ReactEditor } from "slate-react";
import { QuoteElement, QuoteType } from "./types";

export interface QuoteEditor extends BaseEditor, ReactEditor {
  turnIntoQuote: () => void;
}

/**
 * Provides utility methods for working with quote blocks in a Slate editor.
 */
export const QuoteEditor = {
  insertQuote: (editor: QuoteEditor, text: string = "") => {
    const quote: QuoteElement = {
      type: QuoteType.BlockQuote,
      children: [{ text }],
    };
    Transforms.insertNodes(editor, quote);
  },
  isQuoteActive: (editor: QuoteEditor) => {
    const [match] = Editor.nodes(editor, {
      match: (n) =>
        Element.isElement(n) &&
        (n as QuoteElement).type === QuoteType.BlockQuote,
    });
    return !!match;
  },
};
