import { User } from "./user";
import { CommentType } from "./comment";

export interface Article {
  content: string;
  createdAt: string;
  id: number;
  isLiked: boolean;
  likesCount: number;
  slug: string;
  views: number;
  title: string;
  author: User;
  isSelf: boolean;
  comments: CommentType[];
  commentsCount: number;
  totalCommentsCount: number;
  image_url: string;
  status: string;
  savesCount: number;
  relatedArticles: Article[];
  thumbnail: string;
}


export type DraftArticle = {
  image: string;
  title: string;
  updatedAt: string;
  article: Article;
};

