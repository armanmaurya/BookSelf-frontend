import Image from "next/image";
import React from "react";
import { FollowButton } from "../button/FollowButton";

export const FollowCard = ({
    username,
    isFollowing,
    profilePicture,
}: {
    username: string;
    isFollowing: boolean;
    profilePicture: string;
}) => {
    return (
        <div className="dark:bg-neutral-900 bg-gray-200 rounded-md flex justify-between p-3 items-center">
            <div className="flex items-center space-x-3">
                <Image className="rounded-full" height={46} width={46} src={profilePicture ? profilePicture : "https://cdn-icons-png.flaticon.com/128/64/64572.png"} alt="Photot" />
                <div>{username}</div>
            </div>
            <FollowButton initialIsFollowing={isFollowing} username={username} />
        </div>
    );
};
