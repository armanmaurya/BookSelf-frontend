import { createServerClient } from "@/lib/ServerClient";
import { gql } from "@apollo/client";
import Image from "next/image";
import React from "react";

const Page = async () => {
  const QUERY = gql`
    query MyQuery {
      me {
        email
        followingCount
        lastName
        username
        firstName
        isFollowing
        profilePicture
        followersCount
        id
      }
    }
  `;

  const { data } = await createServerClient().query({
    query: QUERY,
  });

  return (
    <div className="mx-32 mt-8 ">
      <div className="h-72 dark:bg-neutral-900 bg-gray-200 rounded-md flex items-center px-24 space-x-6">
        <div className="h-40 w-40 rounded-full bg-white overflow-hidden">
          <Image src={`${data.me.profilePicture}`} alt="" width={160} height={160}/>
        </div>
        <div>
          <div className="text-xl font-semibold">{data.me.firstName}{" "}{data.me.lastName}</div>
          <div className="text-sm">@{data.me.username}</div>
          
        </div>
      </div>
    </div>
  );
};

export default Page;
