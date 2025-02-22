import { User } from "./auth";

export interface CommentType {
    id: number;
    content: string;
    createdAt: string;
    isLiked: boolean;
    likesCount: number;
    repliesCount: number;
    user: User;
}