import { Article } from "@/types/article";
import { User } from "./user";
import { Notebook } from "./notebook";
import { Page } from "./page";

export type GraphQLData = {
    article: Article;
    me: User;
    articles: Article[];
    user: User;
    users: User[];
    notebooks: Notebook[];
    notebook: Notebook;
    page: Page;
    pages: Page[];
}