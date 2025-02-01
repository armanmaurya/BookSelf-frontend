"use client";
import { useState } from "react";
import { createContext } from "react";

interface SideBarContext {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    toggle: () => void;
    close: () => void;
    open: () => void;
}

export const SideBarContext = createContext<SideBarContext>({
    isOpen: false,
    setIsOpen: () => { },
    toggle: () => { },
    close: () => { },
    open: () => { },
});

export const SideBarProvider = ({ children }: { children: React.ReactNode }) => {
    const [isOpen, setIsOpen] = useState(false);

    const toggle = () => {
        setIsOpen(!isOpen);
    }

    const close = () => {
        setIsOpen(false);
    }

    const open = () => {
        setIsOpen(true);
    }

    return (
        <SideBarContext.Provider value={{ isOpen, setIsOpen, toggle, close, open }}>
            {children}
        </SideBarContext.Provider>
    );
}