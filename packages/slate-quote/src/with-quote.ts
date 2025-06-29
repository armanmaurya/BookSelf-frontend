import { Editor, Transforms, Element } from "slate";
import { QuoteEditor } from "./quote-editor";
import { QuoteElement, QuoteType } from "./types";

export const withQuote = <T extends Editor>(editor: T) => {
  const e = editor as T & QuoteEditor;

  return e;
};
