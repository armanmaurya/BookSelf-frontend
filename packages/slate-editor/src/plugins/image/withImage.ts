import { Editor as SlateEditor } from "slate";
import { NodeType } from "../../types";

export const withImage = (editor: SlateEditor) => {
    const { isVoid } = editor;
    
    editor.isVoid = (element) =>
        element.type === NodeType.IMAGE ? true : isVoid(element);
    
    return editor;
}