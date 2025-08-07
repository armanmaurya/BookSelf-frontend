"use client";

import { useEffect } from 'react';

interface SyntaxHighlightProps {
  children: React.ReactNode;
}

export const SyntaxHighlight = ({ children }: SyntaxHighlightProps) => {
  useEffect(() => {
    const applyHighlighting = async () => {
      if (typeof window !== 'undefined') {
        try {
          // Dynamic import to avoid SSR issues
          const { default: hljs } = await import('highlight.js');
          
          // Find all code blocks that haven't been highlighted yet
          const codeBlocks = document.querySelectorAll('pre code:not(.hljs)');
          
          codeBlocks.forEach((block) => {
            // Apply syntax highlighting
            hljs.highlightElement(block as HTMLElement);
            // Remove the hljs class that highlight.js automatically adds
            block.classList.remove('hljs');
          });
        } catch (error) {
          console.warn('Failed to apply syntax highlighting:', error);
        }
      }
    };

    // Apply highlighting after component mounts
    const timeoutId = setTimeout(applyHighlighting, 100);
    
    return () => clearTimeout(timeoutId);
  }, [children]);

  return <>{children}</>;
};
