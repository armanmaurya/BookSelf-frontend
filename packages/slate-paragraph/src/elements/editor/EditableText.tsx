import BaseText from "../base/Text";
import { ParagraphElementProps } from "../../types/element";
import { useSelected, useSlateStatic } from "slate-react";
import { useEffect } from "react";
import { TextEditor } from "../../editor/textEditor";

export const EditableText = (props: ParagraphElementProps) => {
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
          TextEditor.insertNewLine(editor);
      }
    }
  };
  // ########################### KEYDOWN EVENT ###########################

  
  return <BaseText {...props} />;
};

