import BaseParagraph from "../base/BaseParagraph";
import { ParagraphElementProps } from "../../types/element";
import { useSelected, useSlateStatic } from "slate-react";
import { useEffect } from "react";
import { ParagraphEditor } from "../../editor/paragraphEditor";

export const EditableParagraph = (props: ParagraphElementProps) => {
  const selected = useSelected();
  const editor = useSlateStatic();

  // ########################### KEYDOWN EVENT ###########################
  useEffect(() => {
    if (selected) {
      window.addEventListener("keydown", keyDownEvent);
    } else {
      window.removeEventListener("keydown", keyDownEvent);
    }
    return () => {
      window.removeEventListener("keydown", keyDownEvent);
    };
  }, [selected]);
  const keyDownEvent = (e: KeyboardEvent) => {
    if (e.shiftKey && !e.ctrlKey) {
      // switch (e.key) {
      //   case "Enter":
      //     ParagraphEditor.insertNewLine(editor);
      // }
    } 
    if (e.ctrlKey && !e.shiftKey) {
      switch(e.key) {
        case "b" :
          e.preventDefault();
          ParagraphEditor.toggleMark(editor, "bold");
          break;
        case "u":
          e.preventDefault();
          ParagraphEditor.toggleMark(editor, "underline");
          break;
        case "i":
          e.preventDefault();
          ParagraphEditor.toggleMark(editor, "italic")
      }
    }
    if (e.ctrlKey && e.shiftKey) {
      const key = e.key.toLowerCase(); // Normalize the key to lowercase
      switch (key) {
        case "l":
          e.preventDefault();
          ParagraphEditor.alignNode(editor, "left")
          break;
        case "e":
          e.preventDefault();
          ParagraphEditor.alignNode(editor, "center")
          break;
        case "r":
          e.preventDefault();
          ParagraphEditor.alignNode(editor, "right")
          break;
        case "j": 
          e.preventDefault();
          ParagraphEditor.alignNode(editor, "justify")
          break;
        case ">":
          e.preventDefault();
          ParagraphEditor.increaseFontSize(editor);
          break;
        case "<":
          e.preventDefault();
          ParagraphEditor.decreaseFontSize(editor);
          break;
      }
    }
    // if (e.key === "Enter" && !e.shiftKey && !e.ctrlKey) {
    //   e.preventDefault();
    //   ParagraphEditor.insertParagraph(editor);
    // }
  };
  // ########################### KEYDOWN EVENT ###########################

  
  return <BaseParagraph {...props} />;
};

