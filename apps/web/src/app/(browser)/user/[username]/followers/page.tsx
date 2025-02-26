import { API_ENDPOINT } from "@/app/utils";
import { Follower } from "@/components/blocks/Follower";
import { User } from "@/types/auth";
import { cookies } from "next/headers";
import React from "react";

const Page = async ({ params }: { params: Promise<{ username: string }> }) => {
  const { username } = await params;
  

  return (
    <div>
      <h1 className="text-2xl">Followers</h1>
      <div>
        <Follower username={username} />
      </div>
    </div>
  );
};

export default Page;
