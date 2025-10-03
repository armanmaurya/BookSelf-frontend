import { User } from "./user";

export interface Notebook {
    cover: string;
    createdAt: string;
    hasPages: boolean;
    id: string;
    name: string;
    overview: string;
    pagesCount: number;
    slug: string;
    user: User;
    indexPage: {
        slug: string;
    };
}