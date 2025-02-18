export type User = {
    username: string;
    email: string;
    first_name: string;
    last_name: string;
    is_following: boolean | undefined;
    followers: number;
    following: number;
}