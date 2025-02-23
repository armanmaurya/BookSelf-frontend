import { API_ENDPOINT } from "@/app/utils";
import { FollowButton } from "@/components/element/button/FollowButton";
import { User } from "@/types/auth";
import { cookies } from "next/headers";
import React from "react";

const Page = async ({ params }: { params: Promise<{ username: string }> }) => {
    const { username } = await params;
    const cookieStore = cookies();
    const res = await fetch(
        `${API_ENDPOINT.toggleFollow.url}/${username}?type=following`,
        {
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                Cookie: `${cookieStore.get("sessionid")?.name}=${cookieStore.get("sessionid")?.value
                    }`,
            },
        }
    );
    const data: User[] = await res.json();


    return (
        <div>
            <span className="text-4xl">Following</span>
            {data.map((user) => (
                <div className="flex space-x-2 items-center py-2">
                    <div className="w-28">{user.username}</div>
                    <FollowButton username={user.username} initialIsFollowing={user.is_following} />
                </div>
            ))}
        </div>
    );
};

export default Page;
