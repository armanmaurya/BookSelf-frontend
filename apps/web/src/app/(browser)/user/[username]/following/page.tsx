import { API_ENDPOINT } from "@/app/utils";
import { FollowingBlock } from "@/components/blocks/Following";
import { FollowButton } from "@/components/element/button/FollowButton";
import { User } from "@/types/auth";
import { cookies } from "next/headers";

const Page = async ({ params }: { params: Promise<{ username: string }> }) => {
    const { username } = await params;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                    Following by @{username}
                </h1>
                <p className="mt-2 text-gray-600 dark:text-gray-400">
                    People {username} is following
                </p>
            </div>
            
            <div className="">
                <FollowingBlock username={username} />
            </div>
        </div>
    );
};

export default Page;