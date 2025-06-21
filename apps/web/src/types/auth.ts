import { Article } from "@bookself/types";

export type User = {
    id: number
    username: string;
    email: string;
    firstName: string;
    lastName: string;
    isFollowing: boolean;
    followersCount: number;
    followers: User[];
    following: User[];
    followingCount: number;
    isSelf: boolean;
    profilePicture: string;
    articles: Article[];
}