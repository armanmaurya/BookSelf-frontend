"use client"
import { ReactEditor, useFocused, useSlateStatic } from "slate-react";
import { ParagraphLeafProps } from "../../types/leaf";
import { ParagraphLeaf } from "../base/ParagraphLeaf";
import { useEffect } from "react";
import { Editor, Range } from "slate";
import { ParagraphEditor } from "../../editor/paragraphEditor";

export const EditableParagraphLeaf = (props: ParagraphLeafProps) => {
    const editor = useSlateStatic();
    const focused = useFocused();

    useEffect(() => {

        // console.log("Focused", focused)
        if (editor.selection) {
            if (!focused && !Range.isCollapsed(editor.selection)) {
                // console.log("runned")
                const isActive = ParagraphEditor.isMarkActive(editor, "blueSelect")
                if (!isActive) {

                    Editor.addMark(editor, "blueSelect", true)
                }
            } else if (focused) {
                Editor.removeMark(editor, "blueSelect")
            }
        }
    }, [focused])
    return (
        <ParagraphLeaf {...props}/>
    )
}