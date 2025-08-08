import { Article } from "@/types/article";
import { User } from "./user";

export type GraphQLData = {
    article: Article;
    me: User;
    articles: Article[];
    user: User;
    users: User[];
}