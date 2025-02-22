import { Article } from "@bookself/types";
import { User } from "./auth";

export type GraphQLData = {
    article: Article;
    me: User;
    articles: Article[];
    user: User;
    users: User[];
}