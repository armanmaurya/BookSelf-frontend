"use client"
import React, { useEffect, useState } from "react"
import { ReactEditor, useSlate, useSlateStatic } from "slate-react"
import { ParagraphEditor } from "../paragraph-editor";
import { Editor, Element } from "slate";

export const AdjustFontSize = () => {
    const editor = useSlateStatic();
    const fontSize = ParagraphEditor.getFontSize(editor)
    const [size, setSize] = useState(`${fontSize}`)
    const [disabled, setIsDisabled] = useState(false)
    const increaseFontSize = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();
        ParagraphEditor.increaseFontSize(editor)
        // const fontSize = ParagraphEditor.getFontSize(editor);
        // if (fontSize) {

        //     setSize(fontSize)
        // }
    };
    const decreaseFontSize = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();
        ParagraphEditor.decreaseFontSize(editor);
    }

    const setFontSize = (size: number) => {
        ParagraphEditor.setFontSize(editor, size);
    }

    const nodes = Editor.nodes(
        editor, {
        match: n => Element.isElement(n),
        mode: "lowest"
    }
    )

    useEffect(() => {
        console.log("HIIIIIII");
        for (const [node, path] of nodes) {
            console.log("node", node)
            // if (node.type !== "text") {
            //     if (!disabled) {
            //         setIsDisabled(true);
            //     } 
            // } else {
            //     if (disabled) {
            //         setIsDisabled(false);
            //     }
            // }
    
        }
    }, [nodes])

    console.log("isDisabled", disabled)



    function preventNonNumericalInput(e: React.KeyboardEvent<HTMLInputElement>) {

        if (
            e.key === 'Backspace' ||
            e.key === 'Delete' ||
            e.key === 'Tab' ||
            e.key === 'Escape' ||
            (e.key >= 'ArrowLeft' && e.key <= 'ArrowDown') ||
            e.key === '.' // Optional: allows decimal point
        ) {
            return;
        }

        if (e.key === 'Enter') {
            const size = parseInt(e.currentTarget.value)
            if (size > 0)
                setFontSize(size)
            // setSize(size)
        }

        // Prevent any non-numeric characters (except allowed ones)
        if (e.key < '0' || e.key > '9') {
            e.preventDefault();
        }
    }

    useEffect(() => {
        // console.log("fontSize", fontSize)
        setSize(`${fontSize}`)
    }, [fontSize])



    return (
        <div contentEditable={false} className="flex space-x-1">
            <button className={`${disabled ? "text-gray-600" : ""}`} disabled={disabled} onMouseDown={increaseFontSize}>+</button>
            <div className="flex justify-center items-center">
                <input className={`w-10 rounded-md bg-transparent border h-6 ${disabled ? "border-gray-600" : "border"}`} type="number" inputMode="numeric" value={size} pattern="\d*" onChange={(e) => {
                    setSize(e.currentTarget.value)
                }} onKeyDown={preventNonNumericalInput} onMouseDown={(e) => {
                }} disabled={disabled} />
            </div>

            <button disabled={disabled} className={`${disabled ? "text-gray-600" : ""}`} onMouseDown={decreaseFontSize}>-</button>
        </div>
    )
}