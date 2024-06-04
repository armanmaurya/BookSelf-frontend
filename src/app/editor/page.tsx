"use client";
// Import React dependencies.
import React, { useCallback, useEffect, useState } from "react";
// import Prism from "prismjs";
// import "prismjs/themes/prism-tomorrow.css";
// // Import the languages you need
// import "prismjs/components/prism-javascript";
// import "prismjs/components/prism-css";
// import "prismjs/components/prism-jsx";

// Import the Slate editor factory.
import {
  createEditor,
  BaseEditor,
  Descendant,
  Editor as SlateEditor,
  Transforms,
  Element,
  Path,
} from "slate";
// Import the Slate components and React plugin.
import {
  Slate,
  Editable,
  withReact,
  ReactEditor,
  RenderElementProps,
  RenderLeafProps,
} from "slate-react";

// --------------------------------- Types --------------------------------- //

type CustomEditor = BaseEditor & ReactEditor & CustomEditorType;
type CustomEditorType = { type?: string };

type HeadingElement = {
  type: "heading" | null;
  level: number;
  children: CustomText[];
};
type ParagraphElement = { type: "paragraph" | null; children: CustomText[] };

type CodeElement = {
  type: "code" | null;
  language: string | null;
  children: CustomText[];
};

type CustomElement = CodeElement | ParagraphElement | HeadingElement;
type FormattedText = {
  text: string;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  type?: string;
};

type CustomText = FormattedText;

declare module "slate" {
  interface CustomTypes {
    Editor: CustomEditor;
    Element: CustomElement;
    Text: CustomText;
  }
}

const CustomEditor = {
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

  
  toggleBoldMark(editor: SlateEditor) {
    const isActive = CustomEditor.isBoldMarkActive(editor);

    if (isActive) {
      SlateEditor.removeMark(editor, "bold");
    } else {
      SlateEditor.addMark(editor, "bold", true);
    }
  },

  toggleItalicMark(editor: SlateEditor) {
    const isActive = CustomEditor.isItalicMarkActive(editor);

    if (isActive) {
      SlateEditor.removeMark(editor, "italic");
    } else {
      SlateEditor.addMark(editor, "italic", true);
    }
  },

  isCodeBlockActive(editor: SlateEditor) {
    const [match] = SlateEditor.nodes(editor, {
      match: (n) => Element.isElement(n) && n.type === 'code',
    });
    return !!match;
  },

  toggleCodeBlock(editor: SlateEditor) {
    const isActive = CustomEditor.isCodeBlockActive(editor);
    Transforms.setNodes(
      editor,
      { type: isActive ? "paragraph" : "code" },
      { match: (n) => Element.isElement(n) && SlateEditor.isBlock(editor, n) }
    );
  },
};

// Initial value of the editor.
const initialValue: Descendant[] = [
  {
    type: "paragraph",
    children: [
      {
        text: "A line of text in a paragraph.",
      },
    ],
  },
  {
    type: "code",
    language: "javascript",
    children: [
      {
        text: "const a = 5;",
      },
      {
        text: "const b = 10;",
      }
    ],
  },
];

// --------------------------------- Editor --------------------------------- //

export default function Editor() {
  const [editor] = useState(() => withReact(createEditor()));

  // Define a rendering function based on the element passed to `props`. We use
  // `useCallback` here to memoize the function for subsequent renders.
  const renderElement = useCallback((props: RenderElementProps) => {
    switch (props.element.type) {
      case "code":
        return <CodeElement {...props} />;
      case "paragraph":
        return <DefaultElement {...props} />;
      default:
        return <DefaultElement {...props} />;
    }
  }, []);

  // Define a leaf rendering function that is memoized with `useCallback`.
  const renderLeaf = useCallback((props: RenderLeafProps) => {
    return <Leaf {...props} />;
  }, []);

  const onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter") {
      const [match] = SlateEditor.nodes(editor, {
        match: (n) => n.type === "code",
      });
      if (match) {
        event.preventDefault();
        Transforms.insertText(editor, "\n");
        return;
      }
    }
    if (event.ctrlKey) {
      switch (event.key) {
        // When "`" is pressed, keep our existing code block logic.
        case "`": {
          event.preventDefault();
          console.log("Code");
          CustomEditor.toggleCodeBlock(editor);
          break;
        }

        // When "B" is pressed, bold the text in the selection.
        case "b": {
          event.preventDefault();
          CustomEditor.toggleBoldMark(editor);
          break;
        }
        // When "I" is pressed, italicize the text in the selection.
        case "i": {
          event.preventDefault();
          CustomEditor.toggleItalicMark(editor);
          break;
        }
        // case "g": {
        //   event.preventDefault();
        //   Transforms.insertNodes(
        //     editor,
        //     {
        //       type: "paragraph",
        //       children: [{ text: "Some text" }],
        //     },
        //     { at: [editor.children.length] }
        //   );
        // }
      }
    }
    if (event.shiftKey) {
      switch (event.key) {
        case "Enter": {
          const [match] = SlateEditor.nodes(editor, {
            match: (n) => n.type === "paragraph",
          });
          if (match) {
            event.preventDefault();
            Transforms.insertText(editor, "\n");
            return;
          }
        }
      }
    }
  };

  return (
    <Slate
      editor={editor}
      initialValue={initialValue}
      onChange={(value) => {
        const isAstChange = editor.operations.some(
          (op) => "set_selection" !== op.type
        );
        if (isAstChange) {
          // Save the value to Local Storage.
          const content = JSON.stringify(value);
          console.log(content);
          // localStorage.setItem("content", content);
        }
      }}
    >
      <Editable
        className="p-4"
        renderElement={renderElement}
        renderLeaf={renderLeaf}
        onKeyDown={onKeyDown}
      />
    </Slate>
  );
}

// Define a React component to render leaves with bold text.
const Leaf = (props: RenderLeafProps) => {
  return (
    <span
      {...props.attributes}
      style={{
        fontWeight: props.leaf.bold ? "bold" : "normal",
        fontStyle: props.leaf.italic ? "italic" : "normal",
      }}
    >
      {props.children}
    </span>
  );
};

// --------------------------------- Elements --------------------------------- //
const CodeElement = (props: RenderElementProps) => {
  const { attributes, children, element } = props;
  // const codeText = element.children.map((child: any) => child.text).join("\n");
  // const tokens = Prism.tokenize(codeText, Prism.languages.javascript);

  // const highlightedCode = tokens.map((token, i) => {
  //   if (typeof token === "string") {
  //     return <span key={i}>{token}</span>;
  //   } else {
  //     return (
  //       <span key={i} className={`token ${token.type}`}>
  //         {token.content}
  //       </span>
  //     );
  //   }
  // });

  return (
    <pre className="bg-zinc-900 text-white p-4 rounded" {...attributes}>
      <code>{children}</code>
    </pre>
  );
};

const DefaultElement = (props: RenderElementProps) => {
  return (
    <p className="my-2" {...props.attributes}>
      {props.children}
    </p>
  );
};
