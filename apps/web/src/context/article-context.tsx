"use client";
import { Article } from "@/types/article";
import { createContext, useState, ReactNode } from "react";

interface ArticleContextType {
    article: Article;
    setArticle: (article: Article) => void;
}

export const ArticleContext = createContext<ArticleContextType | undefined>(undefined);

export const ArticleProvider = ({ children, initialArticle }: { children: ReactNode; initialArticle: Article }) => {
    const [article, setArticle] = useState<Article>(initialArticle);

    return (
        <ArticleContext.Provider value={{ article, setArticle }}>
            {children}
        </ArticleContext.Provider>
    );
};
