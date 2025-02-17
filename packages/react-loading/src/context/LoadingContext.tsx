"use client";
import { createContext, useContext, useState } from "react";

type LoadingContextType = {
    isLoading: boolean;
    show: () => void;
    hide: () => void;
};

const LoadingContext = createContext<LoadingContextType>({
    isLoading: false,
    show: () => {},
    hide: () => {},
});

export const LoadingProvider = ({ children }: { children: React.ReactNode }) => {
    const [isLoading, setIsLoading] = useState(false);

    const show = () => setIsLoading(true);
    const hide = () => setIsLoading(false);

    return (
        <LoadingContext.Provider value={{ isLoading, show, hide }}>
            {children}
        </LoadingContext.Provider>
    );
};

export function useLoading() {
    const context = useContext(LoadingContext);

    if (!context) {
        throw new Error("useLoading must be used within a LoadingProvider");
    }

    return context;
}