import { Editor, Transforms, Element } from "slate";
import { QuoteEditor } from "./QuoteEditor";
import { QuoteElement, QuoteType } from "./types";

export const withQuote = <T extends Editor>(editor: T) => {
  const e = editor as T & QuoteEditor;

  e.turnIntoQuote = () => {
    const isActive = QuoteEditor.isQuoteBlockActive(e);
    if (!isActive) {
      Transforms.wrapNodes(
        editor,
        { type: QuoteType.BlockQuote, children: [] } as QuoteElement,
        {
          match: (n) => Element.isElement(n),
        }
      );
    }
  };

  return e;
};
