import { useCallback } from "react";
import { NodeType } from "../types";
import { range, Element as SlateElement, Node as SlateNode } from "slate";
import Prism, { Token } from "prismjs";

export const decorate = ([node, path]: [SlateNode, number[]]) => {
  const ranges: any[] = [];

  if (node.type === NodeType.CODE && SlateElement.isElement(node)) {
    const text = SlateNode.string(node);
    console.log(text)
    const language = node.language;

    if (language) {
      const tokens = Prism.tokenize(text, Prism.languages[language]);
      // console.log(tokens);

      const getLength = (token: string | Token): number => {
        if (typeof token === "string") {
          return token.length;
        } else if (typeof token.content === "string") {
          return token.content.length;
        } else {
          if (Array.isArray(token.content))
            return token.content.reduce((l, t) => l + getLength(t), 0);
          // return token.content.reduce((l, t) => l + getLength(t), 0);
        }
        return 0;
      };

      let start = 0;
      const generateRanges = (tokens: (string | Token)[]) => {
        for (const token of tokens) {
          const length = getLength(token);
          const end = start + length;

          if (typeof token !== "string") {
            ranges.push({
              token: true,
              anchor: { path, offset: start },
              focus: { path, offset: end },
              [token.type]: true,
            });
            if (Array.isArray(token.content)) {
              generateRanges(token.content);
            }
          }

          start = end;
        }
      };

      generateRanges(tokens);
    }
    console.log(ranges)

    return ranges;
  }

  return ranges;
};
