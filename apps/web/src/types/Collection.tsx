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
}