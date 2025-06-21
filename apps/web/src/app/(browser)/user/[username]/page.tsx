import React, { useCallback } from "react";
import { API_ENDPOINT } from "@/app/utils";
import { cookies } from "next/headers";
import { User } from "@/types/auth";
import { FollowButton } from "@/components/element/button/FollowButton";
import { gql } from "@apollo/client";
// import client from "@/lib/apolloClient";
import { GraphQLData } from "@/types/graphql";
import { createServerClient } from "@/lib/ServerClient";
import Link from "next/link";
import { redirect } from "next/navigation";
import Image from "next/image";
import { CgProfile } from "react-icons/cg";
import { LinkTabs } from "@/components/element/LinkTabs";

const ProfilePage = async ({
  params,
  searchParams,
}: {
  params: Promise<{ username: string }>;
  searchParams: { tab?: string };
}) => {
  const cookieStore = cookies();
  const { username } = await params;

  // console.log("searchParams", searchParams);

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

  const {
    data,
  }: {
    data: GraphQLData;
  } = await createServerClient().query({
    query: QUERY,
    variables: {
      username: username,
    },
  });

  if (data.user.isSelf) {
    redirect("/me");
  }

  const tabs = [
    {
      name: "Overview",
      href: `/user/${username}`,
    },
    {
      name: "Articles",
      href: `/user/${username}?tab=articles`,
    },
    {
      name: "Collections",
      href: `/user/${username}?tab=collections`,
    },
  ];

  const RenderTab = () => {
    switch (searchParams.tab) {
      case "collections":
        return <div>Collections</div>;
      case "articles":
        return <div>Articles</div>;
      default:
        return <div>Overview</div>;
    }
  };

  return (
    <div className="mx-32 mt-8 flex flex-col space-y-6">
      <div className="h-72 dark:bg-neutral-900 bg-gray-200 rounded-md flex items-center px-24 space-x-6">
        <div className="h-40 w-40 rounded-full bg-white overflow-hidden flex items-center justify-center">
          {data.user.profilePicture ? (
            <Image
              src={`${data.user.profilePicture || ""}`}
              alt=""
              width={160}
              height={160}
            />
          ) : (
            <CgProfile className="h-full w-full text-gray-900" />
          )}
        </div>
        <div className="flex flex-col space-y-1.5">
          <div className="">
            <div className="font-semibold text-xl">
              {data.user.firstName} {data.user.lastName}
            </div>
            <div className="text-sm">@{data.user.username}</div>
          </div>
          <div className="">
            <Link
              href={`/user/${username}/followers`}
              className="hover:underline"
            >
              {data.user.followersCount} Followers
            </Link>
            <span> · </span>
            <Link
              href={`/user/${username}/following`}
              className="hover:underline"
            >
              {data.user.followingCount} Following
            </Link>
          </div>
          <div className="flex space-x-2">
            <FollowButton
              initialIsFollowing={data.user.isFollowing}
              username={data.user.username}
            />
            <Link href={`/chat/`} className="bg-gray-600 text-white rounded-md p-1 hover:cursor-pointer hover:bg-gray-500">Messege</Link>
          </div>
        </div>
      </div>

      <div className="dark:bg-neutral-900 bg-gray-200 p-4 rounded-md">
        <h1 className="text-4xl font-bold">About</h1>
        <p>There is Nothing to Show</p>
      </div>
      <div className="">
        <LinkTabs tabs={tabs} />
      </div>

      <RenderTab />
    </div>
  );
};

export default ProfilePage;
