import { Editor as SlateEditor, Element as SlateElement, Transforms } from "slate";

export const CustomEditor = {
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
  
    toggleH1Block(editor: SlateEditor) {
      const isActive = CustomEditor.isH1Active(editor);
      Transforms.setNodes(
        editor,
        { type: isActive ? "paragraph" : "heading-one" },
        { match: (n) => SlateElement.isElement(n) && SlateEditor.isBlock(editor, n) }
      );
    },

    toggleH2Block(editor: SlateEditor) {
      const isActive = CustomEditor.isH2Active(editor);
      Transforms.setNodes(
        editor,
        { type: isActive ? "paragraph" : "heading-two" },
        { match: (n) => SlateElement.isElement(n) && SlateEditor.isBlock(editor, n) }
      );
    },

    toggleH3Block(editor: SlateEditor) {
      const isActive = CustomEditor.isH3Active(editor);
      Transforms.setNodes(
        editor,
        { type: isActive ? "paragraph" : "heading-three" },
        { match: (n) => SlateElement.isElement(n) && SlateEditor.isBlock(editor, n) }
      );
    },

    toggleH4Block(editor: SlateEditor) {
      const isActive = CustomEditor.isH4Active(editor);
      Transforms.setNodes(
        editor,
        { type: isActive ? "paragraph" : "heading-four" },
        { match: (n) => SlateElement.isElement(n) && SlateEditor.isBlock(editor, n) }
      );
    },

    toggleH5Block(editor: SlateEditor) {
      const isActive = CustomEditor.isH5Active(editor);
      Transforms.setNodes(
        editor,
        { type: isActive ? "paragraph" : "heading-five" },
        { match: (n) => SlateElement.isElement(n) && SlateEditor.isBlock(editor, n) }
      );
    },

    toggleH6Block(editor: SlateEditor) {
      const isActive = CustomEditor.isH6Active(editor);
      Transforms.setNodes(
        editor,
        { type: isActive ? "paragraph" : "heading-six" },
        { match: (n) => SlateElement.isElement(n) && SlateEditor.isBlock(editor, n) }
      );
    },
  
    toggleCodeBlock(editor: SlateEditor) {
      const isActive = CustomEditor.isCodeBlockActive(editor);
      Transforms.setNodes(
        editor,
        { type: isActive ? "paragraph" : "code" },
        { match: (n) => SlateElement.isElement(n) && SlateEditor.isBlock(editor, n) }
      );
    },
  };