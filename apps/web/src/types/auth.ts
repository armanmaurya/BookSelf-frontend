export type User = {
    username: string;
    email: string;
    first_name: string;
    last_name: string;
    is_following: boolean;
    followers_count: number;
    following_count: number;
    is_self: boolean;
}