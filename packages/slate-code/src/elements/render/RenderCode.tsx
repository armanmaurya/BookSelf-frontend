// import { NodeType } from "../../../types";
import Prism from "prismjs";
import { RenderElementProps } from "slate-react";
import { BaseCode } from "../base/baseCode";
import React from "react";

import "prismjs/components/prism-javascript";
import "prismjs/components/prism-jsx";
import "prismjs/components/prism-typescript";
import "prismjs/components/prism-tsx";
import "prismjs/components/prism-markdown";
import "prismjs/components/prism-python";
import "prismjs/components/prism-php";
import "prismjs/components/prism-sql";
import "prismjs/components/prism-java";
import "prismjs/themes/prism-solarizedlight.css";
import { CodeElementType, CodeType } from "../../types/element";

const Language: { [key: string]: string } = {
  javascript: "Javascript",
  jsx: "JSX",
  typescript: "Typescript",
  tsx: "TSX",
  markdown: "Markdown",
  python: "Python",
  php: "PHP",
  sql: "SQL",
  java: "Java",
};

export const RenderCode = (props: RenderElementProps) => {
  const { attributes, children, element } = props;

  const codeText = element.children.map((child: any) => child.text).join("\n");

  const language =
    (element as CodeElementType).type === CodeType.Code
      ? (element as CodeElementType).language
      : null;
  if (language) {
    const tokens = Prism.tokenize(codeText, Prism.languages[language]);

    const generateHighlightedCode = (tokens: any) => {
      return tokens.map((token: any, i: number) => {
        if (typeof token === "string") {
          return <span key={i}>{token}</span>;
        } else {
          if (Array.isArray(token.content)) {
            return (
              <span key={i} className={`token ${token.type}`}>
                {generateHighlightedCode(token.content)}
              </span>
            );
          } else {
            return (
              <span key={i} className={`token ${token.type}`}>
                {token.content}
              </span>
            );
          }
        }
      });
    };

    const highlightedCode: React.JSX.Element[] =
      generateHighlightedCode(tokens);

    return (
      <div className="relative">
        <div className="absolute right-1 m-1 text-gray-400">
          {Language[language as string]}
        </div>
        <BaseCode attributes={attributes} element={element as any}>
          {highlightedCode}
        </BaseCode>
      </div>
    );
  }
  return (
    <BaseCode attributes={attributes} element={element as any}>
      {children}
    </BaseCode>
  );
};
