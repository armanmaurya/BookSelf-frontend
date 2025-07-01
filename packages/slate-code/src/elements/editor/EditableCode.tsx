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
import { useEffect, useState, useRef } from "react";

export const EditableCode = (props: CodeElementProps) => {
  const editor = useSlateStatic() as any;
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const languageOptions = [
    { value: "", label: "Select language" },
    { value: "javascript", label: "JavaScript" },
    { value: "typescript", label: "TypeScript" },
    { value: "jsx", label: "JSX" },
    { value: "tsx", label: "TSX" },
    { value: "python", label: "Python" },
    { value: "java", label: "Java" },
    { value: "c", label: "C" },
    { value: "cpp", label: "C++" },
    { value: "csharp", label: "C#" },
    { value: "go", label: "Go" },
    { value: "ruby", label: "Ruby" },
    { value: "swift", label: "Swift" },
    { value: "kotlin", label: "Kotlin" },
    { value: "perl", label: "Perl" },
    { value: "rust", label: "Rust" },
    { value: "scss", label: "SCSS" },
    { value: "css", label: "CSS" },
    { value: "json", label: "JSON" },
    { value: "bash", label: "Bash" },
    { value: "shell-session", label: "Shell" },
    { value: "docker", label: "Docker" },
    { value: "yaml", label: "YAML" },
    { value: "graphql", label: "GraphQL" },
    { value: "matlab", label: "MATLAB" },
    { value: "objectivec", label: "Objective-C" },
    { value: "powershell", label: "PowerShell" },
    { value: "lua", label: "Lua" },
    { value: "scala", label: "Scala" },
    { value: "dart", label: "Dart" },
    { value: "haskell", label: "Haskell" },
    { value: "clojure", label: "Clojure" },
    { value: "elixir", label: "Elixir" },
    { value: "erlang", label: "Erlang" },
    { value: "markdown", label: "Markdown" },
    { value: "markup", label: "Html" },
    { value: "php", label: "PHP" },
    { value: "sql", label: "SQL" },
  ];

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
    setOpen(false);
  };

  return (
    <div className="relative group">
      <div
        contentEditable={false}
        className="absolute left-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-20"
        ref={dropdownRef}
      >
        <button
          type="button"
          className="px-2 bg-transparent mt-1.5 text-sm font-mono bg-background focus:outline-none flex items-center gap-2"
          onClick={() => setOpen((v) => !v)}
        >
          {languageOptions.find((opt) => opt.value === element.language)?.label || "Select language"}
          <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
        </button>
        {open && (
          <div className="absolute left-0 mt-1 w-44 max-h-64 overflow-y-auto bg-background dark:bg-zinc-900 border border-border rounded shadow-lg z-50">
            <div className="p-2">
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search language..."
                className="w-full px-2 py-1 text-sm rounded border border-border bg-background focus:outline-none mb-2"
                autoFocus
              />
            </div>
            {languageOptions
              .filter(opt =>
                opt.label.toLowerCase().includes(search.toLowerCase())
              )
              .map(opt => (
                <div
                  key={opt.value}
                  className={`px-3 py-2 text-sm cursor-pointer hover:bg-accent hover:text-primary ${element.language === opt.value ? 'bg-accent text-primary' : ''}`}
                  onClick={() => setLanguage(opt.value)}
                >
                  {opt.label}
                </div>
              ))}
            {languageOptions.filter(opt => opt.label.toLowerCase().includes(search.toLowerCase())).length === 0 && (
              <div className="px-3 py-2 text-xs text-muted-foreground">No results</div>
            )}
          </div>
        )}
      </div>
      <BaseCode {...props} />
    </div>
  );
};
