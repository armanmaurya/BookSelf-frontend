import { API_ENDPOINT } from "@/app/utils";
import { FollowingBlock } from "@/components/blocks/Following";
import { FollowButton } from "@/components/element/button/FollowButton";
import { User } from "@/types/auth";
import { cookies } from "next/headers";
// import React from "react";

const Page = async ({ params }: { params: Promise<{ username: string }> }) => {
    const { username } = await params;

    return (
        <div className="px-4">
            <div className="text-4xl pb-4">Following</div>
            <FollowingBlock username={username} />
        </div>
    );
};

export default Page;
