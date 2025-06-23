import { Article } from "./Article";

export type DraftArticle = {
  title: string;
  updatedAt: string;
  article: Article;
};
