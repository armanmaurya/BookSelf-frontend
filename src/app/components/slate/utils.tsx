import { NodeType } from "@/app/utils";
import {
  Descendant,
  Editor as SlateEditor,
  Element as SlateElement,
  Transforms,
} from "slate";
import { CustomElement } from "./editor";
// import { CustomEditor } from "./CustomEditor";

export const SlateCustomEditor = {
  isBoldMarkActive(editor: SlateEditor) {
    const marks = SlateEditor.marks(editor);

    if (marks) {
      return marks?.bold === true;
    } else {
      return false;
    }
  },

  isItalicMarkActive(editor: SlateEditor) {
    const marks = SlateEditor.marks(editor);

    if (marks) {
      return marks?.italic === true;
    } else {
      return false;
    }
  },

  isUnderlineMarkActive(editor: SlateEditor) {
    const marks = SlateEditor.marks(editor);

    if (marks) {
      return marks?.underline === true;
    } else {
      return false;
    }
  },

  isCommand(editor: SlateEditor) {
    if (editor.selection) {
      const text = SlateEditor.string(editor, editor.selection.anchor.path);
      return text.startsWith("/");
    }
  },

  isParagraphActive(editor: SlateEditor) {
    const [match] = SlateEditor.nodes(editor, {
      match: (n) => SlateElement.isElement(n) && n.type === "paragraph",
    });
    return !!match;
  },

  isCodeBlockActive(editor: SlateEditor) {
    const [match] = SlateEditor.nodes(editor, {
      match: (n) => SlateElement.isElement(n) && n.type === "code",
    });
    return !!match;
  },

  isH1Active(editor: SlateEditor) {
    const [match] = SlateEditor.nodes(editor, {
      match: (n) => SlateElement.isElement(n) && n.type === "heading-one",
    });
    return !!match;
  },

  isH2Active(editor: SlateEditor) {
    const [match] = SlateEditor.nodes(editor, {
      match: (n) => SlateElement.isElement(n) && n.type === "heading-two",
    });
    return !!match;
  },

  isH3Active(editor: SlateEditor) {
    const [match] = SlateEditor.nodes(editor, {
      match: (n) => SlateElement.isElement(n) && n.type === "heading-three",
    });
    return !!match;
  },

  isH4Active(editor: SlateEditor) {
    const [match] = SlateEditor.nodes(editor, {
      match: (n) => SlateElement.isElement(n) && n.type === "heading-four",
    });
    return !!match;
  },

  isH5Active(editor: SlateEditor) {
    const [match] = SlateEditor.nodes(editor, {
      match: (n) => SlateElement.isElement(n) && n.type === "heading-five",
    });
    return !!match;
  },

  isH6Active(editor: SlateEditor) {
    const [match] = SlateEditor.nodes(editor, {
      match: (n) => SlateElement.isElement(n) && n.type === "heading-six",
    });
    return !!match;
  },


  toggleBoldMark(editor: SlateEditor) {
    const isActive = SlateCustomEditor.isBoldMarkActive(editor);
    const [match] = SlateEditor.nodes(editor, {
      match: (n) => SlateElement.isElement(n) && n.type === "paragraph",
    });

    if (!match) {
      return;
    }

    if (isActive) {
      SlateEditor.removeMark(editor, "bold");
    } else {
      SlateEditor.addMark(editor, "bold", true);
    }
  },

  toggleItalicMark(editor: SlateEditor) {
    const isActive = SlateCustomEditor.isItalicMarkActive(editor);
    const [match] = SlateEditor.nodes(editor, {
      match: (n) => SlateElement.isElement(n) && n.type === "paragraph",
    });

    if (!match) {
      return;
    }

    if (isActive) {
      SlateEditor.removeMark(editor, "italic");
    } else {
      SlateEditor.addMark(editor, "italic", true);
    }
  },

  toggleUnderlineMark(editor: SlateEditor) {
    const isActive = SlateCustomEditor.isUnderlineMarkActive(editor);
    const [match] = SlateEditor.nodes(editor, {
      match: (n) => SlateElement.isElement(n) && n.type === "paragraph",
    });

    if (!match) {
      return;
    }

    if (isActive) {
      SlateEditor.removeMark(editor, "underline");
    } else {
      SlateEditor.addMark(editor, "underline", true);
    }
  },

  setAlignment(editor: SlateEditor, alignment: "left" | "center" | "right" | "justify") {
    const [match] = SlateEditor.nodes(editor, {
      match: (n) => SlateElement.isElement(n) && n.type === "paragraph",
    });

    if (!match) {
      return;
    }

    Transforms.setNodes(
      editor,
      { align: alignment },
      {
        match: (n) =>
          SlateElement.isElement(n) && SlateEditor.isBlock(editor, n),
      }
    );
  },

  runCommand(editor: SlateEditor) {
    const isCommand = SlateCustomEditor.isCommand(editor);

    if (isCommand && editor.selection) {
      const text = SlateEditor.string(editor, editor.selection.anchor.path);
      const command = text.split(" ")[0].substring(1);
      console.log("Command", command);

      const rest = text.substring(command.length + 1);
      switch (command) {
        case "bold":
          SlateCustomEditor.toggleBoldMark(editor);
          break;
        case "italic":
          SlateCustomEditor.toggleItalicMark(editor);
          break;
        case "code":
          SlateCustomEditor.toggleCodeBlock(editor);
          break;
        case "h1":
          SlateCustomEditor.toggleH1Block(editor);
          break;
        case "h2":
          SlateCustomEditor.toggleH2Block(editor);
          break;
        case "h3":
          SlateCustomEditor.toggleH3Block(editor);
          break;
        case "h4":
          SlateCustomEditor.toggleH4Block(editor);
          break;
        case "h5":
          SlateCustomEditor.toggleH5Block(editor);
          break;
        case "h6":
          SlateCustomEditor.toggleH6Block(editor);
          break;
        default:
          console.log("Command not found");
      }
    }
  },

  toggleParagraphBlock(editor: SlateEditor) {
    const isActive = SlateCustomEditor.isParagraphActive(editor);
    Transforms.setNodes(
      editor,
      { type: isActive ? "paragraph" : "paragraph" },
      {
        match: (n) =>
          SlateElement.isElement(n) && SlateEditor.isBlock(editor, n),
      }
    );
  },

  toggleH1Block(editor: SlateEditor) {
    const isActive = SlateCustomEditor.isH1Active(editor);
    Transforms.setNodes(
      editor,
      { type: isActive ? "paragraph" : "heading-one" },
      {
        match: (n) =>
          SlateElement.isElement(n) && SlateEditor.isBlock(editor, n),
      }
    );
  },

  toggleH2Block(editor: SlateEditor) {
    const isActive = SlateCustomEditor.isH2Active(editor);
    Transforms.setNodes(
      editor,
      { type: isActive ? "paragraph" : "heading-two" },
      {
        match: (n) =>
          SlateElement.isElement(n) && SlateEditor.isBlock(editor, n),
      }
    );
  },

  toggleH3Block(editor: SlateEditor) {
    const isActive = SlateCustomEditor.isH3Active(editor);
    Transforms.setNodes(
      editor,
      { type: isActive ? "paragraph" : "heading-three" },
      {
        match: (n) =>
          SlateElement.isElement(n) && SlateEditor.isBlock(editor, n),
      }
    );
  },

  toggleH4Block(editor: SlateEditor) {
    const isActive = SlateCustomEditor.isH4Active(editor);
    Transforms.setNodes(
      editor,
      { type: isActive ? "paragraph" : "heading-four" },
      {
        match: (n) =>
          SlateElement.isElement(n) && SlateEditor.isBlock(editor, n),
      }
    );
  },

  toggleH5Block(editor: SlateEditor) {
    const isActive = SlateCustomEditor.isH5Active(editor);
    Transforms.setNodes(
      editor,
      { type: isActive ? "paragraph" : "heading-five" },
      {
        match: (n) =>
          SlateElement.isElement(n) && SlateEditor.isBlock(editor, n),
      }
    );
  },

  toggleH6Block(editor: SlateEditor) {
    const isActive = SlateCustomEditor.isH6Active(editor);
    Transforms.setNodes(
      editor,
      { type: isActive ? "paragraph" : "heading-six" }, 
      {
        match: (n) =>
          SlateElement.isElement(n) && SlateEditor.isBlock(editor, n),
      }
    );
  },

  toggleCodeBlock(editor: SlateEditor) {
    const isActive = SlateCustomEditor.isCodeBlockActive(editor);
    // if (editor.selection) {
    //   Transforms.mergeNodes(editor, {
    //     at: editor.selection,
    //   });
    // }
    Transforms.setNodes(
      editor,
      { type: isActive ? "paragraph" : "code" },
      {
        match: (n) =>
          SlateElement.isElement(n) && SlateEditor.isBlock(editor, n),
      }
    );
    // Transforms.insertText(editor, "\n```");
    // if (editor.selection) {
    //   Transforms.select(editor, {
    //     path: [...editor.selection.anchor.path],
    //     offset: 3,
    //   });
    // }
  },

  insertLineBreak(editor: SlateEditor) {
    Transforms.insertText(editor, "\n");
  },

  insertParagraph(editor: SlateEditor) {
    // const isActive = CustomEditor.isParagraphActive(editor);
    console.log(editor.selection);
    if (editor.selection) {
      const text = SlateEditor.string(editor, editor.selection.focus.path);
      Transforms.insertNodes(
        editor,
        {
          type: NodeType.PARAGRAPH,
          children: [{ text: "" }],
        },
        {
          match: (n) =>
            SlateElement.isElement(n) && SlateEditor.isBlock(editor, n),
          at: {
            path: editor.selection.anchor.path,
            offset: text.length,
          },
        }
      );

      // console.log(editor.selection.anchor.path[0] + 1, 0);
      const nextNode = SlateEditor.after(editor, editor.selection.anchor.path);
      if (nextNode) {
        Transforms.select(editor, {
          path: nextNode.path,
          offset: nextNode.offset,
        });
      }
    }
  },
};

export const handleKeyBoardFormating = (
  event: React.KeyboardEvent<HTMLDivElement>,
  editor: SlateEditor
) => {
  if (event.ctrlKey) {
    switch (event.key) {
      case "1":
        event.preventDefault();
        SlateCustomEditor.toggleH1Block(editor);
        break;
      case "2":
        event.preventDefault();
        SlateCustomEditor.toggleH2Block(editor);
        break;
      case "3":
        event.preventDefault();
        SlateCustomEditor.toggleH3Block(editor);
        break;
      case "4":
        event.preventDefault();
        SlateCustomEditor.toggleH4Block(editor);
        break;
      case "5":
        event.preventDefault();
        SlateCustomEditor.toggleH5Block(editor);
        break;
      case "6":
        event.preventDefault();
        SlateCustomEditor.toggleH6Block(editor);
        break;
      case "`":
        event.preventDefault();
        SlateCustomEditor.toggleCodeBlock(editor);
        break;
      case "b":
        event.preventDefault();
        SlateCustomEditor.toggleBoldMark(editor);
        break;
      case "i":
        event.preventDefault();
        SlateCustomEditor.toggleItalicMark(editor);
        break;
      case "u":
        event.preventDefault();
        SlateCustomEditor.toggleUnderlineMark(editor);
        break;
      case "Enter":
        if (SlateCustomEditor.isCodeBlockActive(editor)) {
          event.preventDefault();
          SlateCustomEditor.insertParagraph(editor);
        }
    }
  }
  if (event.shiftKey) {
    switch (event.key) {
      case "Enter":
        event.preventDefault();
        if (SlateCustomEditor.isParagraphActive(editor)) {
          SlateCustomEditor.insertLineBreak(editor);
        }
    }
  }
  if (event.key === "Enter" && !event.shiftKey && !event.ctrlKey) {
    const isCodeBlockActive = SlateCustomEditor.isCodeBlockActive(editor);
    if (isCodeBlockActive) {
      event.preventDefault();
      SlateCustomEditor.insertLineBreak(editor);
      return;
    }

    const isParagraphActive = SlateCustomEditor.isParagraphActive(editor);
    // if (isParagraphActive) {
    //   event.preventDefault();
    //   CustomEditor.runCommand(editor);
    // }
    if (!isParagraphActive) {
      event.preventDefault();
      SlateCustomEditor.insertParagraph(editor);
      return;
    }
  }
};

export const markdownTokenizer = (textin: string) => {
  let text = textin;
  const tokens: any[] = [];

  // bold and italic (?<!\*)\*\*\* ?(?!\*\*\*)[^*]+ ?\*\*\*(?!\*)
  const patterns = [
    {
      regex: /(?<!\*)\* ?(?!\*)[^*]+ ?\*(?!\*)/g,
      type: "italic",
    },
    {
      regex: /(?<!\*)\*\* ?(?!\*\*)[^*]+ ?\*\*(?!\*)/g,
      type: "bold",
    },
    {
      regex: /(?<!\*)\*\*\* ?(?!\*\*\*)[^*]+ ?\*\*\*(?!\*)/g,
      type: "bold_italic",
    },
    {
      regex: /(?<!~)~ ?[^~]+ ?~(?!~)/g,
      type: "strike",
    },
  ];
  // boldItalicMatchedIndex = {

  // }
  if (text.startsWith("#")) {
    if (text.startsWith("# ")) {
      tokens.push({
        type: "h1",
        content: text,
      });
      return tokens;
    }
    if (text.startsWith("## ")) {
      tokens.push({
        type: "h2",
        content: text,
      });
      return tokens;
    }
    if (text.startsWith("### ")) {
      tokens.push({
        type: "h3",
        content: text,
      });
      return tokens;
    }

    if (text.startsWith("#### ")) {
      tokens.push({
        type: "h4",
        content: text,
      });
      return tokens;
    }
    if (text.startsWith("##### ")) {
      tokens.push({
        type: "h5",
        content: text,
      });
      return tokens;
    }
    if (text.startsWith("###### ")) {
      tokens.push({
        type: "h6",
        content: text,
      });
      return tokens;
    }
  }

  let decorationList: any[] = [];
  patterns.forEach((pattern) => {
    let match;
    while ((match = pattern.regex.exec(text)) !== null) {
      // console.log(match);

      decorationList.push({
        index: match.index,
        type: pattern.type,
        content: match[0],
      });
    }
  });

  decorationList = decorationList.sort((a, b) => a.index - b.index);
  console.log(decorationList);

  for (let i = 0; i < decorationList.length; i++) {
    if (i === 0) {
      tokens.push(text.slice(0, decorationList[i].index));
    } else {
      tokens.push(
        text.slice(
          decorationList[i - 1].index + decorationList[i - 1].content.length,
          decorationList[i].index
        )
      );
    }
    tokens.push({
      type: decorationList[i].type,
      content: decorationList[i].content,
    });
    // text = text.slice(decorationList[i].index + decorationList[i].content.length);
  }

  return tokens;
};

export interface CustomNodeTypes {
  PARAGRAPH: string;
  H1: string;
  H2: string;
  H3: string;
  H4: string;
  H5: string;
  H6: string;
  CODE: string;
}

export class SlateToMarkdown {
  nodeTypes: CustomNodeTypes;

  constructor(nodeTypes: CustomNodeTypes) {
    this.nodeTypes = nodeTypes;
  }

  convert = (nodes: any) => {
    const startTime = performance.now();
    let markdown = "";
    nodes.forEach((node:any) => {
      switch (node.type) {
        case this.nodeTypes.PARAGRAPH:
          for (const child of node.children) {
            if (child.bold && child.italic) {
              markdown += "***" + child.text + "***";
            }
            else if (child.bold) {
              markdown += "**" + child.text + "**";
            } else if (child.italic) {
              markdown += "*" + child.text + "*";
            } else {
              markdown += child.text;
            }
          }
          markdown += "\n";
          break;
        case this.nodeTypes.H1:
          markdown += "# " + node.children[0].text + "\n";
          break;
        case this.nodeTypes.H2:
          markdown += "## " + node.children[0].text + "\n";
          break;
        case this.nodeTypes.H3:
          markdown += "### " + node.children[0].text + "\n";
          break;
        case this.nodeTypes.H4:
          markdown += "#### " + node.children[0].text + "\n";
          break;
        case this.nodeTypes.H5:
          markdown += "##### " + node.children[0].text + "\n";
          break;
        case this.nodeTypes.H6:
          markdown += "###### " + node.children[0].text + "\n";
          break;
        case this.nodeTypes.CODE:
          markdown += "```\n";
          for (const child of node.children) {
            markdown += child.text;
          }
          markdown += "\n```\n";
          break;
      }
    });
    const endTime = performance.now();
    const timeTaken = endTime - startTime;
    console.log("Time taken:", timeTaken, "ms")
    return markdown;
  };
}
