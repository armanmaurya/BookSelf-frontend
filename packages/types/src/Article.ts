import { User } from "@/types/auth";
import { CommentType } from "@/types/comment";

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
}
