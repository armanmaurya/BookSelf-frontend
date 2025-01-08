import React, { useEffect, useRef } from "react"

export const Modal = ({ children, isOpen, onRequestClose, className }: {
    children: React.ReactNode
    isOpen: boolean
    onRequestClose?: () => void
    className?: string
}) => {
    const ref = useRef<HTMLDivElement>(null);

    const handleOutsideClick = (e: MouseEvent) => {
        if (ref.current && !ref.current.contains(e.target as Node)) {
            onRequestClose && onRequestClose();
        }
    }

    const EscapePressed = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
            onRequestClose && onRequestClose();
        }
    }

    useEffect(() => {
        if (isOpen) {
            document.addEventListener("mousedown", handleOutsideClick);
            document.addEventListener("keydown", EscapePressed);
        } else {
            document.removeEventListener("keydown", EscapePressed);
            document.removeEventListener("mousedown", handleOutsideClick);
        }

        return () => {
            document.removeEventListener("keydown", EscapePressed);
            document.removeEventListener("mousedown", handleOutsideClick);
        }
    })
    return (
        <>
            {
                isOpen && (
                    <div ref={ref} className={`${className}`}>
                        {children}
                    </div>
                )
            }
        </>
    )
}