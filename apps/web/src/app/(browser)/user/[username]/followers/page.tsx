import { API_ENDPOINT } from "@/app/utils";
import { Follower } from "@/components/blocks/Follower";
import { User } from "@/types/auth";
import { cookies } from "next/headers";
import React from "react";

const Page = async ({ params }: { params: Promise<{ username: string }> }) => {
  const { username } = await params;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Followers of @{username}
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          People who follow {username}
        </p>
      </div>
      
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden">
        <Follower username={username} />
      </div>
    </div>
  );
};

export default Page;