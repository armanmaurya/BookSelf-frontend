"use client";
// Import React dependencies.
import React, { useCallback, useMemo } from "react";
import { CustomEditor } from "../components/slate/CustomEditor";
import {
  H1Element,
  H2Element,
  H3Element,
  H4Element,
  H5Element,
  H6Element,
  DefaultElement,
  CodeElement,
} from "../components/slate/CustomElements";

import {
  createEditor,
  BaseEditor,
  Descendant,
  Editor as SlateEditor,
  Transforms,
  Element as SlateElement,
  Node as SlateNode,
  Text,
  Point,
  Range,
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

import { withHistory } from "slate-history";

// --------------------------------- Types --------------------------------- //

type CustomEditor = BaseEditor & ReactEditor & CustomEditorType;
type CustomEditorType = { type?: string };

type HeadingElement = {
  type:
    | "heading-one"
    | "heading-two"
    | "heading-three"
    | "heading-four"
    | "heading-five"
    | "heading-six"
    | null;
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
// --------------------------------- End Types --------------------------------- //

const SHORTCUTS = {
  "#": "heading-one",
  "##": "heading-two",
  "###": "heading-three",
  "####": "heading-four",
  "#####": "heading-five",
  "######": "heading-six",
};

// const withShortcuts = (editor) => {
//   const { deleteBackward, insertText } = editor;

//   editor.insertText = (text) => {
//     const { selection } = editor;

//     if (text.endsWith(" ") && selection && Range.isCollapsed(selection)) {
//       const { anchor } = selection;
//       const block = SlateEditor.above(editor, {
//         match: (n) =>
//           SlateElement.isElement(n) && SlateEditor.isBlock(editor, n),
//       });
//       const path = block ? block[1] : [];
//       const start = SlateEditor.start(editor, path);
//       const range = { anchor, focus: start };
//       const beforeText = SlateEditor.string(editor, range) + text.slice(0, -1);
//       const element = SHORTCUTS[beforeText];
//       if (element.type === "heading-one") {
//         console.log("Heading 1");
//       }
//       if (type) {
//         Transforms.select(editor, range);

//         if (!Range.isCollapsed(range)) {
//           Transforms.delete(editor);
//         }

//         const newProperties: Partial<SlateElement> = {
//           type,
//         };
//         Transforms.setNodes<SlateElement>(editor, newProperties, {
//           match: (n) =>
//             SlateElement.isElement(n) && SlateEditor.isBlock(editor, n),
//         });

//         // if (type === 'list-item') {
//         //   const list: BulletedListElement = {
//         //     type: 'bulleted-list',
//         //     children: [],
//         //   }
//         //   Transforms.wrapNodes(editor, list, {
//         //     match: n =>
//         //       !Editor.isEditor(n) &&
//         //       SlateElement.isElement(n) &&
//         //       n.type === 'list-item',
//         //   })
//         // }

//         return;
//       }
//     }

//     insertText(text);
//   };

//   editor.deleteBackward = (...args) => {
//     const { selection } = editor;

//     if (selection && Range.isCollapsed(selection)) {
//       const match = SlateEditor.above(editor, {
//         match: (n) =>
//           SlateElement.isElement(n) && SlateEditor.isBlock(editor, n),
//       });

//       if (match) {
//         const [block, path] = match;
//         const start = SlateEditor.start(editor, path);

//         if (
//           !SlateEditor.isEditor(block) &&
//           SlateElement.isElement(block) &&
//           block.type !== "paragraph" &&
//           Point.equals(selection.anchor, start)
//         ) {
//           const newProperties: Partial<SlateElement> = {
//             type: "paragraph",
//           };
//           Transforms.setNodes(editor, newProperties);

//           // if (block.type === 'list-item') {
//           //   Transforms.unwrapNodes(editor, {
//           //     match: n =>
//           //       !Editor.isEditor(n) &&
//           //       SlateElement.isElement(n) &&
//           //       n.type === 'bulleted-list',
//           //     split: true,
//           //   })
//           // }

//           return;
//         }
//       }

//       deleteBackward(...args);
//     }
//   };

//   return editor;
// };

// Initial value of the editor.
const initialValue: Descendant[] = [
  {
    type: "heading-one",
    children: [
      {
        text: "A line of text in a paragraph.",
      },
    ],
  },
  // {
  //   type: "code",
  //   language: "javascript",
  //   children: [
  //     {
  //       text: "const a = 5;",
  //     },
  //     {
  //       text: "const b = 10;",
  //     },
  //   ],
  // },
];

// --------------------------------- Editor --------------------------------- //

export default function Editor() {
  const editor = useMemo(() => withReact(withHistory(createEditor())), []);
  let numkey = 0;

  // Define a rendering function based on the element passed to `props`. We use
  // `useCallback` here to memoize the function for subsequent renders.
  const renderElement = useCallback((props: RenderElementProps) => {
    switch (props.element.type) {
      case "code":
        return <CodeElement {...props} />;
      case "paragraph":
        return <DefaultElement {...props} />;
      case "heading-one":
        return <H1Element {...props} />;
      case "heading-two":
        return <H2Element {...props} />;
      case "heading-three":
        return <H3Element {...props} />;
      case "heading-four":
        return <H4Element {...props} />;
      case "heading-five":
        return <H5Element {...props} />;
      case "heading-six":
        return <H6Element {...props} />;
      default:
        return <DefaultElement {...props} />;
    }
  }, []);


  // Define a leaf rendering function that is memoized with `useCallback`.
  const renderLeaf = useCallback((props: RenderLeafProps) => {
    return <Leaf {...props} />;
  }, []);

  const getNodeText = () => {
    const { selection } = editor;
    if (selection) {
      const [currentNode] = SlateEditor.node(editor, selection.focus.path);
      if (Text.isText(currentNode)) {
        return currentNode.text;
      }
    }
    return "";
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "`") {
      console.log("Clicked");
      console.log(numkey);

      const [match] = SlateEditor.nodes(editor, {
        match: (n) => n.type === "code",
      });
      if (!match) {
        numkey++;
        if (numkey === 3) {
          CustomEditor.toggleCodeBlock(editor);
          Transforms.insertText(editor, "`\n\n``");
          numkey = 0;
        }
      }
    }

    if (event.ctrlKey) {
      switch (event.key) {
        // When "`" is pressed, keep our existing code block logic.
        case "`": {
          event.preventDefault();
          console.log("Code");
          CustomEditor.toggleCodeBlock(editor);
          const [match] = SlateEditor.nodes(editor, {
            match: (n) => n.type === "code",
          });
          if (match) {
            event.preventDefault();
            Transforms.insertText(editor, "```\n\n```");
          }

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
        case "1": {
          event.preventDefault();
          CustomEditor.toggleH1Block(editor);
          break;
        }
        case "2": {
          event.preventDefault();
          CustomEditor.toggleH2Block(editor);
          break;
        }
        case "3": {
          event.preventDefault();
          CustomEditor.toggleH3Block(editor);
          break;
        }
        case "4": {
          event.preventDefault();
          CustomEditor.toggleH4Block(editor);
          break;
        }
        case "5": {
          event.preventDefault();
          CustomEditor.toggleH5Block(editor);
          break;
        }
        case "6": {
          event.preventDefault();
          CustomEditor.toggleH6Block(editor);
          break;
        }
      }
    }
    if (event.shiftKey) {
      switch (event.key) {
        case "Enter": {
          event.preventDefault();
          const [match] = SlateEditor.nodes(editor, {
            match: (n) => n.type === "paragraph",
          });
          if (match) {
            Transforms.insertText(editor, "\n");
          }
          return;
        }
      }
    }

    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      Transforms.insertNodes(editor, {
        type: "paragraph",
        children: [{ text: "" }],
      });
      return;
    }
  };

  return (
    <div>
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

          // // Testing some features
          // const notetext = getNodeText();

          // const markdownshortcut = notetext.split(" ");
          // console.log(markdownshortcut);
          // if (markdownshortcut.length > 1){

          //   if (markdownshortcut[0] === "#") {
          //     console.log("Heading 2");
          //     CustomEditor.toggleHeading(editor, 2);
          //   }
          // }
        }}
      >
        <Editable
          spellCheck
          autoFocus
          className="p-4"
          renderElement={renderElement}
          renderLeaf={renderLeaf}
          onKeyDown={onKeyDown}
          placeholder="Start typing..."
        />
      </Slate>
    </div>
  );
}

// Define a React component to render leaves with bold text.
const Leaf = (props: RenderLeafProps) => {
  return (
    <span
      {...props.attributes}
      className={`${props.leaf.bold ? "font-bold" : ""} ${props.leaf.italic ? "italic" : ""}`}
    >
      {props.children}
    </span>
  );
};
// props.leaf.bold ? "font-bold" : ""  props.leaf.italic ? "italic" : ""