"use client"
import React, { useEffect, useState } from "react"
import { ReactEditor, useSlate, useSlateStatic } from "slate-react"
import { ParagraphEditor } from "../editor/paragraphEditor";

export const AdjustFontSize = () => {
    const editor = useSlateStatic();
    const fontSize = ParagraphEditor.getFontSize(editor) 
    const [size, setSize] = useState(`${fontSize}`)
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
        // const fontSize = ParagraphEditor.getFontSize(editor);
        // if (fontSize) {

        //     setSize(fontSize)
        // }
    }

    const setFontSize = (size: number) => {
        ParagraphEditor.setFontSize(editor, size);
    }



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
        console.log("fontSize", fontSize)
        setSize(`${fontSize}`)
    }, [fontSize])



    return (
        <div contentEditable={false} className="flex space-x-1">
            <button className={`${!fontSize ? "text-gray-600": ""}`} disabled={!fontSize ? true : false} onMouseDown={increaseFontSize}>+</button>
            <div className="flex justify-center items-center">
                <input className={`w-10 rounded-md bg-transparent border h-6 ${!fontSize ? "border-gray-600": "border" }`}  type="number" inputMode="numeric" value={size} pattern="\d*" onChange={(e) => {
                    setSize(e.currentTarget.value)
                }} onKeyDown={preventNonNumericalInput} onMouseDown={(e) => {
                }} disabled={!fontSize ? true : false}/>
            </div>

            <button disabled={!fontSize ? true : false} className={`${!fontSize ? "text-gray-600": ""}`} onMouseDown={decreaseFontSize}>-</button>
        </div>
    )
}