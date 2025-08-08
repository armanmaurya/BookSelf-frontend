import TurndownService from "turndown";

export interface ConvertToMarkdownOptions {
  title: string;
  author: {
    firstName: string;
    lastName: string;
    username: string;
  };
  url?: string;
  content: string;
}

export const convertToMarkdown = ({
  title,
  author,
  url,
  content,
}: ConvertToMarkdownOptions): string => {
  const turndownService = createTurndownService();
  const root = parseHtmlContent(content);

  replaceLatexNodes(root);

  const markdownContent = turndownService.turndown(root as HTMLElement);

  return formatFinalMarkdown({
    title,
    author,
    url,
    markdownContent,
  });
};

// -----------------------------
// 🔧 Helper: Configure Turndown
// -----------------------------
function createTurndownService(): TurndownService {
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

  turndownService.addRule("latex-math", {
    filter: (node) => {
      const el = node as Element;
      const tag = el.nodeName.toLowerCase();
      return (tag === "span" || tag === "div") && el.hasAttribute("data-latex");
    },
    replacement: (_content, node) => {
      const el = node as Element;
      const latex = el.getAttribute("data-latex") || "";
      const type = el.getAttribute("data-type");
      return type === "block-math" ? `\n\n$$${latex}$$\n\n` : `$${latex}$`;
    },
  });

  turndownService.addRule("strikethrough", {
    filter: ["del", "s"],
    replacement: (content) => `~~${content}~~`,
  });

  return turndownService;
}

// -----------------------------
// 📄 Helper: Parse HTML string
// -----------------------------
function parseHtmlContent(html: string): Element {
  const parser = new DOMParser();
  const doc = parser.parseFromString(`<div>${html}</div>`, "text/html");
  const root = doc.body.firstElementChild;
  if (!root) throw new Error("Invalid HTML content");
  return root;
}

// -----------------------------
// 🔁 Helper: Replace LaTeX nodes
// -----------------------------
function replaceLatexNodes(node: Node, doc: Document = document): void {
  if (!(node instanceof Element)) return;

  const tag = node.nodeName.toLowerCase();
  const isLatex = node.hasAttribute("data-latex");

  if ((tag === "span" || tag === "div") && isLatex) {
    const latex = node.getAttribute("data-latex") || "";
    const type = node.getAttribute("data-type");
    const markdown = type === "block-math" ? `\n\n$$${latex}$$\n\n` : `$${latex}$`;

    const textNode = doc.createTextNode(markdown);
    node.parentNode?.replaceChild(textNode, node);
    return;
  }

  Array.from(node.childNodes).forEach((child) => replaceLatexNodes(child, doc));
}

// -----------------------------
// 📝 Helper: Format output
// -----------------------------
function formatFinalMarkdown({
  title,
  author,
  url,
  markdownContent,
}: {
  title: string;
  author: ConvertToMarkdownOptions["author"];
  url?: string;
  markdownContent: string;
}): string {
  return `# ${title}

**Author:** ${author.firstName} ${author.lastName} (@${author.username})
${url ? `**Source:** ${url}` : ""}

---

${markdownContent}

---

*Copied from Infobite*`;
}
