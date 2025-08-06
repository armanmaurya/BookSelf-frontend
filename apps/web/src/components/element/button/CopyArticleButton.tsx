"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Copy, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import TurndownService from "turndown";

interface CopyArticleButtonProps {
  title: string;
  content: string;
  author: {
    firstName: string;
    lastName: string;
    username: string;
  };
  url?: string;
}

export const CopyArticleButton = ({ 
  title, 
  content, 
  author, 
  url 
}: CopyArticleButtonProps) => {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const copyToClipboard = async () => {
    try {
      // Initialize Turndown service
      const turndownService = new TurndownService({
        headingStyle: 'atx',
        hr: '---',
        bulletListMarker: '-',
        codeBlockStyle: 'fenced',
        fence: '```',
        emDelimiter: '_',
        strongDelimiter: '**',
        linkStyle: 'inlined',
        linkReferenceStyle: 'full'
      });

      // Configure Turndown to handle common HTML elements better
      turndownService.addRule('strikethrough', {
        filter: ['del', 's'],
        replacement: function (content: string) {
          return '~~' + content + '~~';
        }
      });

      // Convert HTML to Markdown
      const markdownContent = turndownService.turndown(content);
      
      // Create formatted markdown with metadata
      const formattedMarkdown = `# ${title}

**Author:** ${author.firstName} ${author.lastName} (@${author.username})
${url ? `**Source:** ${url}` : ''}

---

${markdownContent}

---

*Copied from Infobite*`;

      // Copy to clipboard
      await navigator.clipboard.writeText(formattedMarkdown);
      
      setCopied(true);
      toast({
        title: "Copied to clipboard!",
      });
      
      // Reset the copied state after 2 seconds
      setTimeout(() => setCopied(false), 2000);
      
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
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
      <span className="text-sm">
        {copied ? "Copied!" : "Copy"}
      </span>
    </Button>
  );
};
