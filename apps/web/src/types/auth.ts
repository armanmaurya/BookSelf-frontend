export type User = {
    username: string;
    email: string;
    firstName: string;
    lastName: string;
    isFollowing: boolean;
    followersCount: number;
    followingCount: number;
    isSelf: boolean;
}