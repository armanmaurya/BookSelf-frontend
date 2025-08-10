"use client";

import { type Editor } from "@tiptap/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, FileCode, Search } from "lucide-react";
import Fuse from "fuse.js";
import { useMemo } from "react";

interface CodeBlockControlsProps {
  editor: Editor;
  safeEditorState: any;
  languageSearch: string;
  setLanguageSearch: (search: string) => void;
}

const CodeBlockControls = ({
  editor,
  safeEditorState,
  languageSearch,
  setLanguageSearch,
}: CodeBlockControlsProps) => {
  const codeLanguages = [
    { value: "javascript", label: "JavaScript" },
    { value: "typescript", label: "TypeScript" },
    { value: "python", label: "Python" },
    { value: "java", label: "Java" },
    { value: "cpp", label: "C++" },
    { value: "c", label: "C" },
    { value: "csharp", label: "C#" },
    { value: "php", label: "PHP" },
    { value: "ruby", label: "Ruby" },
    { value: "go", label: "Go" },
    { value: "rust", label: "Rust" },
    { value: "swift", label: "Swift" },
    { value: "kotlin", label: "Kotlin" },
    { value: "scala", label: "Scala" },
    { value: "dart", label: "Dart" },
    // ...rest of your list
    { value: "plaintext", label: "Plain Text" },
    { value: "text", label: "Text" },
  ];

  // Fuse.js setup - only created once
  const fuse = useMemo(
    () =>
      new Fuse(codeLanguages, {
        keys: ["label", "value"],
        threshold: 0.3, // smaller = stricter
      }),
    []
  );

  const setCodeBlockLanguage = (language: string) => {
    editor.chain().focus().updateAttributes("codeBlock", { language }).run();
  };

  const getCurrentCodeLanguage = () => {
    return safeEditorState.currentCodeLanguage || "javascript";
  };

  const getCurrentCodeLanguageLabel = () => {
    const current = codeLanguages.find(
      (lang) => lang.value === getCurrentCodeLanguage()
    );
    return current ? current.label : "JavaScript";
  };

  const getFilteredLanguages = () => {
    const search = languageSearch.trim();
    if (!search) return codeLanguages;
    return fuse.search(search).map((res) => res.item);
  };

  const highlightMatch = (text: string, search: string) => {
    if (!search) return text;
    const regex = new RegExp(`(${search})`, "ig");
    return text.replace(regex, `<mark class="bg-yellow-300">$1</mark>`);
  };

  return (
    <>
      {safeEditorState.isCodeBlock && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="px-2 py-1 h-8 text-xs overflow-hidden text-ellipsis whitespace-nowrap"
              title={`Code Language: ${getCurrentCodeLanguageLabel()}`}
            >
              {getCurrentCodeLanguageLabel()}
              <ChevronDown className="ml-1 h-3 w-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-48 max-h-80 overflow-y-auto">
            <DropdownMenuLabel className="p-2 border-b">
              <div className="relative">
                <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-3 w-3 text-muted-foreground" />
                <Input
                  placeholder="Search languages..."
                  value={languageSearch}
                  onChange={(e) => setLanguageSearch(e.target.value)}
                  onKeyDown={(e) => {
                    e.stopPropagation();
                    if (e.key === "Enter") {
                      e.preventDefault();
                    }
                  }}
                  className="h-7 pl-7 text-xs"
                  autoFocus
                />
              </div>
            </DropdownMenuLabel>

            <div className="max-h-48 overflow-y-auto">
              {getFilteredLanguages().map((lang) => (
                <DropdownMenuItem
                  key={lang.value}
                  onClick={() => {
                    setCodeBlockLanguage(lang.value);
                    setLanguageSearch("");
                  }}
                  className={
                    getCurrentCodeLanguage() === lang.value ? "bg-accent" : ""
                  }
                >
                  <span
                    className="font-mono text-xs"
                    dangerouslySetInnerHTML={{
                      __html: highlightMatch(lang.label, languageSearch),
                    }}
                  />
                </DropdownMenuItem>
              ))}

              {getFilteredLanguages().length === 0 && (
                <div className="px-3 py-2 text-xs text-muted-foreground text-center">
                  No languages found
                </div>
              )}
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </>
  );
};

export const CodeBlockToggle = ({ editor }: { editor: Editor }) => (
  <DropdownMenuItem onClick={() => editor.chain().focus().toggleCodeBlock().run()}>
    <FileCode className="h-4 w-4 mr-2" />
    Code Block
  </DropdownMenuItem>
);

export default CodeBlockControls;
