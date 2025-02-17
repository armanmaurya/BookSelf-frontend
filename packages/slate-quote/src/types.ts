import { Descendant } from "slate";

export enum QuoteType {
    BlockQuote = "block-quote",
}


export type QuoteElement = {
    type: QuoteType.BlockQuote;
    children: Descendant[];
};