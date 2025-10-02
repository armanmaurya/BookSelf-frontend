import { Article } from "@bookself/types";

export type CollectionType = {
    id: string;
    name: string;
    description: string;
    createdAt: string;
    updatedAt: string;
    items: Article[];
    isAdded: boolean;
    isPublic: boolean;
    isSelf: boolean;
    itemsCount: number;
    indexArticle?: {
        createdAt: string;
        id: string;
        isLiked: boolean;
        isSelf: boolean;
        likesCount: number;
        slug: string;
        status: string;
        thumbnail: string;
        title: string;
        totalCommentsCount: number;
        updatedAt: string;
        views: number;
        savesCount: number;
        commentsCount: number;
    };
}