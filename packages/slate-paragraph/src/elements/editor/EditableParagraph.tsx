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
    if (e.shiftKey) {
      switch (e.key) {
        case "Enter":
          ParagraphEditor.insertNewLine(editor);
      }
    } 
    if (e.ctrlKey) {
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
    if (e.key === "Enter" && !e.shiftKey && !e.ctrlKey) {
      e.preventDefault();
      
    }
  };
  // ########################### KEYDOWN EVENT ###########################

  
  return <BaseParagraph {...props} />;
};

