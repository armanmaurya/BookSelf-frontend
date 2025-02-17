import { BaseEditor, BaseElement, Editor, Element } from "slate";
import { ReactEditor } from "slate-react";
import { QuoteElement, QuoteType } from "./types";

export interface QuoteEditor extends BaseEditor, ReactEditor {
  turnIntoQuote: () => void;
}

export const QuoteEditor = {
  turnIntoQuote: (editor: QuoteEditor) => {
    editor.turnIntoQuote();
  },
  isQuoteBlockActive: (editor: QuoteEditor) => {
    const [match] = Editor.nodes(editor, {
      match: (n) =>
        Element.isElement(n) &&
        (n as QuoteElement).type === QuoteType.BlockQuote,
    });
    return !!match;
  },
};
