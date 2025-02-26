import { API_ENDPOINT } from "@/app/utils";
import { Following } from "@/components/blocks/Following";
import { FollowButton } from "@/components/element/button/FollowButton";
import { User } from "@/types/auth";
import { cookies } from "next/headers";
// import React from "react";

const Page = async ({ params }: { params: Promise<{ username: string }> }) => {
    const { username } = await params;

    return (
        <div>
            <span className="text-4xl p-2">Following</span>
            <Following username={username} />
        </div>
    );
};

export default Page;
