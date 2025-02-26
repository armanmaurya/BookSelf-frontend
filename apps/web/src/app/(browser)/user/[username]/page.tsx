import React from "react";
import { API_ENDPOINT } from "@/app/utils";
import { cookies } from "next/headers";
import { User } from "@/types/auth";
import { FollowButton } from "@/components/element/button/FollowButton";
import { gql } from "@apollo/client";
// import client from "@/lib/apolloClient";
import { GraphQLData } from "@/types/graphql";
import { createServerClient } from "@/lib/ServerClient";
import Link from "next/link";

const ProfilePage = async ({
  params,
}: {
  params: Promise<{ username: string }>;
}) => {
  const cookieStore = cookies();
  const { username } = await params;

  const QUERY = gql`
    query MyQuery($username: String!) {
      user(username: $username) {
        email
        followersCount
        followingCount
        firstName
        lastName
        isSelf
        isFollowing
        username
        registrationMethod
      }
    }
  `;

  const { data }: {
    data: GraphQLData;
  } = await createServerClient().query({
    query: QUERY,
    variables: {
      username: username
    }
  })

  return (
    <div>
      <div>{data.user.username}</div>
      <div className="flex space-x-2">
        <Link href={`${data.user.username}/followers`} className=" flex hover:underline">
          {data.user.followersCount} Followers
        </Link>
        <Link href={`${data.user.username}/following`} className=" flex hover:underline">
          {data.user.followingCount} Following
        </Link>
      </div>
      {!data.user.isSelf && (
        <FollowButton
          username={username}
          initialIsFollowing={data.user.isFollowing}
        />
      )}
    </div>
  );
};

export default ProfilePage;
