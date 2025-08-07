"use client";

import { useEffect } from "react";
import 'katex/dist/katex.min.css';

export function ArticleBodyWithMath() {
  useEffect(() => {
    // Inject KaTeX inline math wrap override
    const styleId = 'katex-inline-wrap-style';
    if (!document.getElementById(styleId)) {
      const style = document.createElement('style');
      style.id = styleId;
      style.innerHTML = `
        /* Allow wrapping for inline KaTeX math */
        .articleBody [data-latex]:not([data-type="block-math"]) .katex {
          white-space: normal !important;
          word-break: break-word;
        }
      `;
      document.head.appendChild(style);
    }

    const container = document.querySelector('.articleBody');
    if (!container) return;
    import('katex').then(katex => {
      container.querySelectorAll('[data-latex]').forEach((el) => {
        const elem = el as HTMLElement;
        const latex = elem.getAttribute('data-latex') || '';
        const type = elem.getAttribute('data-type');
        try {
          katex.render(latex, elem, {
            throwOnError: false,
            displayMode: type === 'block-math',
          });
        } catch (e) {
          elem.textContent = latex;
        }
      });
    });
  }, []);
  return null;
}
