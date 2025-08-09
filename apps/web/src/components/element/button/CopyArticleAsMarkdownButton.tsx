"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Copy, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { useArticle } from "@/hooks/useArticle";
import { convertToMarkdown } from "@/utils/markdownConverter";

export const CopyArticleAsMarkdownButton = () => {
  const { article } = useArticle();
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();
  
  const copyToClipboard = async () => {
    const url = `${window.location.origin}/user/${article.author.username}/article/${article.slug}`;
    try {
      const formattedMarkdown = convertToMarkdown({
        title: article.title,
        author: article.author,
        url,
        content: article.content,
      });

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
