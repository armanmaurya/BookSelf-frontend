"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Copy, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import TurndownService from "turndown";
import { Contrail_One } from "next/font/google";
import { useArticle } from "@/hooks/useArticle";

export const CopyArticleButton = () => {
  const { article } = useArticle();
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();
  const url = `${window.location.origin}/user/${article.author.username}/article/${article.slug}`;

  const copyToClipboard = async () => {
    try {
      const turndownService = new TurndownService({
        headingStyle: "atx",
        hr: "---",
        bulletListMarker: "-",
        codeBlockStyle: "fenced",
        fence: "```",
        emDelimiter: "_",
        strongDelimiter: "**",
        linkStyle: "inlined",
        linkReferenceStyle: "full",
      });

      // ✅ LaTeX Rule
      turndownService.addRule("latex-math", {
        filter: (node) => {
          const el = node as Element;
          const tag = el.nodeName.toLowerCase();
          return (
            (tag === "span" || tag === "div") &&
            el.hasAttribute("data-latex")
          );
        },
        replacement: (_content, node) => {
          const el = node as Element;
          const latex = el.getAttribute("data-latex") || "";
          const type = el.getAttribute("data-type");
          return type === "block-math"
            ? `\n\n$$${latex}$$\n\n`
            : `$${latex}$`;
        },
      });

      // ✅ Strikethrough
      turndownService.addRule("strikethrough", {
        filter: ["del", "s"],
        replacement: (content) => `~~${content}~~`,
      });

      // ✅ Parse HTML safely
      const parser = new DOMParser();
      const doc = parser.parseFromString(`<div>${article.content}</div>`, "text/html");
      const root = doc.body.firstElementChild;
      if (!root) throw new Error("Invalid HTML content");

      // Fallback: Replace all <span|div data-latex> with Markdown before Turndown
      interface ReplaceLatexNodesOptions {
        doc: Document;
      }

      function replaceLatexNodes(node: Node, options: ReplaceLatexNodesOptions = { doc }): void {
        if (!(node instanceof Element)) return;
        const tag = node.nodeName.toLowerCase();
        if ((tag === "span" || tag === "div") && node.hasAttribute("data-latex")) {
          const latex: string = node.getAttribute("data-latex") || "";
          const type: string | null = node.getAttribute("data-type");
          const md: string = type === "block-math"
        ? `\n\n$$${latex}$$\n\n`
        : `$${latex}$`;
          const textNode: Text = options.doc.createTextNode(md);
          node.parentNode?.replaceChild(textNode, node);
          return;
        }
        // Recurse for children
        Array.from(node.childNodes).forEach((child: Node) => replaceLatexNodes(child, options));
      }
      replaceLatexNodes(root);

      // ✅ Convert to Markdown
      const markdownContent = turndownService.turndown(root as HTMLElement);

      // ✅ Final formatted Markdown
      const formattedMarkdown = `# ${article.title}

**Author:** ${article.author.firstName} ${article.author.lastName} (@${article.author.username})
${url ? `**Source:** ${url}` : ""}

---

${markdownContent}

---

*Copied from Infobite*`;

      await navigator.clipboard.writeText(formattedMarkdown);

      setCopied(true);
      toast({ title: "Copied to clipboard!" });
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Copy failed:", error);
      toast({
        title: "Copy failed",
        description: "Unable to copy to clipboard. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={copyToClipboard}
      className="flex items-center gap-2 hover:bg-accent transition-colors"
      title="Copy as Markdown"
    >
      <AnimatePresence mode="wait">
        {copied ? (
          <motion.div
            key="check"
            initial={{ scale: 0, rotate: -90 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 90 }}
            transition={{ duration: 0.2 }}
            className="text-green-600"
          >
            <Check className="h-4 w-4" />
          </motion.div>
        ) : (
          <motion.div
            key="copy"
            initial={{ scale: 0, rotate: 90 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: -90 }}
            transition={{ duration: 0.2 }}
          >
            <Copy className="h-4 w-4" />
          </motion.div>
        )}
      </AnimatePresence>
      <span className="text-sm">{copied ? "Copied!" : "Copy"}</span>
    </Button>
  );
};
