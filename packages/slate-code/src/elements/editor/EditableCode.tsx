"use client";
import { BaseEditor, Editor, Transforms } from "slate";
import { ReactEditor, useSlateStatic } from "slate-react";
import { BaseCode } from "../base/baseCode";
import {
  CodeElementProps,
  CodeElementType,
  CodeType,
} from "../../types/element";
import Prism from "prismjs";
import "prismjs/themes/prism-solarizedlight.css";
import { useEffect } from "react";

export const EditableCode = (props: CodeElementProps) => {
  const editor = useSlateStatic() as any;

  useEffect(() => {
    require("prismjs/components/prism-javascript");
    require("prismjs/components/prism-jsx");
    require("prismjs/components/prism-typescript");
    require("prismjs/components/prism-tsx");
    require("prismjs/components/prism-markdown");
    require("prismjs/components/prism-python");
    require("prismjs/components/prism-php");
    require("prismjs/components/prism-sql");
    require("prismjs/components/prism-java");
    require("prismjs/components/prism-c");
    require("prismjs/components/prism-cpp");
    require("prismjs/components/prism-csharp");
    require("prismjs/components/prism-go");
    require("prismjs/components/prism-ruby");
    require("prismjs/components/prism-swift");
    require("prismjs/components/prism-kotlin");
    require("prismjs/components/prism-perl");
    require("prismjs/components/prism-rust");
    require("prismjs/components/prism-scss");
    require("prismjs/components/prism-css");
    require("prismjs/components/prism-markup");
    require("prismjs/components/prism-json");
    require("prismjs/components/prism-bash");
    require("prismjs/components/prism-shell-session");
    require("prismjs/components/prism-docker");
    require("prismjs/components/prism-yaml");
    require("prismjs/components/prism-graphql");
    require("prismjs/components/prism-matlab");
    require("prismjs/components/prism-objectivec");
    require("prismjs/components/prism-powershell");
    require("prismjs/components/prism-lua");
    require("prismjs/components/prism-sql");
    require("prismjs/components/prism-typescript");
    require("prismjs/components/prism-scala");
    require("prismjs/components/prism-dart");
    require("prismjs/components/prism-haskell");
    require("prismjs/components/prism-clojure");
    require("prismjs/components/prism-elixir");
    require("prismjs/components/prism-erlang");
    require("prismjs/components/prism-sql");
  }, []);

  const { attributes, children, element } = props;
  const setLanguage = (language: string) => {
    const path = ReactEditor.findPath(editor, element);
    Transforms.setNodes(editor, { language } as Partial<CodeElementType>, {
      at: path,
    });
  };

  return (
    <div className="relative group">
      <div
        contentEditable={false}
        className="absolute left-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
      >
        <select
          defaultValue={
            element.type === CodeType.Code ? (element.language as string) : ""
          }
          name="languages"
          className="px-2 text-sm font-mono bg-gray-100 dark:bg-neutral-700 border border-gray-300 dark:border-neutral-600 rounded focus:outline-none focus:ring-2 focus:border-transparent transition-colors duration-200 shadow-md hover:shadow-lg"
          onChange={(e) => {
            const language = e.target.value;
            setLanguage(language);
          }}
        >
          <option value="">Select language</option>
          <option value="javascript">JavaScript</option>
          <option value="typescript">TypeScript</option>
          <option value="jsx">JSX</option>
          <option value="tsx">TSX</option>
          <option value="python">Python</option>
          <option value="java">Java</option>
          <option value="c">C</option>
          <option value="cpp">C++</option>
          <option value="csharp">C#</option>
          <option value="go">Go</option>
          <option value="ruby">Ruby</option>
          <option value="swift">Swift</option>
          <option value="kotlin">Kotlin</option>
          <option value="perl">Perl</option>
          <option value="rust">Rust</option>
          <option value="scss">SCSS</option>
          <option value="css">CSS</option>
          <option value="json">JSON</option>
          <option value="bash">Bash</option>
          <option value="shell-session">Shell</option>
          <option value="docker">Docker</option>
          <option value="yaml">YAML</option>
          <option value="graphql">GraphQL</option>
          <option value="matlab">MATLAB</option>
          <option value="objectivec">Objective-C</option>
          <option value="powershell">PowerShell</option>
          <option value="lua">Lua</option>
          <option value="scala">Scala</option>
          <option value="dart">Dart</option>
          <option value="haskell">Haskell</option>
          <option value="clojure">Clojure</option>
          <option value="elixir">Elixir</option>
          <option value="erlang">Erlang</option>
          <option value="markdown">Markdown</option>
          <option value="markup">Html</option>
          <option value="php">PHP</option>
          <option value="sql">SQL</option>
        </select>
      </div>
      <BaseCode {...props} />
    </div>
  );
};
