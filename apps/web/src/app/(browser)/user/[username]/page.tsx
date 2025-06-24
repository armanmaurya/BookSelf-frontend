import React from "react";
import { API_ENDPOINT } from "@/app/utils";
import { cookies } from "next/headers";
import { User } from "@/types/auth";
import { FollowButton } from "@/components/element/button/FollowButton";
import { gql } from "@apollo/client";
import { GraphQLData } from "@/types/graphql";
import { createServerClient } from "@/lib/ServerClient";
import Link from "next/link";
import { redirect } from "next/navigation";
import Image from "next/image";
import { CgProfile } from "react-icons/cg";
import { LinkTabs } from "@/components/element/LinkTabs";
import { Article } from "@bookself/types";
import { ArticleCard } from "@/components/element/cards/ArticleCard";
import { UserArticles } from "./userArticles";
import { EditableProfilePicture } from "@/components/blocks/EditProfilePicture";

const ProfilePage = async ({
  params,
  searchParams,
}: {
  params: Promise<{ username: string }>;
  searchParams: { tab?: string };
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
        profilePicture
      }
    }
  `;

  const { data }: { data: GraphQLData } = await createServerClient().query({
    query: QUERY,
    variables: { username: username },
  });

  const tabs = [
    {
      name: "Overview",
      href: `/user/${username}?tab=overview`,
    },
    {
      name: "Articles",
      href: `/user/${username}?tab=articles`,
    },
    // {
    //   name: "Collections",
    //   href: `/user/${username}?tab=collections`,
    // },
  ];

  // RenderTab rewritten using switch-case
  const RenderTab = () => {
    switch (searchParams?.tab) {
      case "collections":
        return (
          <div className="text-center py-12 text-gray-500 dark:text-gray-400">
            Collections coming soon
          </div>
        );
      case "articles":
        return <UserArticles isSelf={data.user.isSelf} username={username} />;
      default:
        return (
          <div className="bg-neutral-50 dark:bg-neutral-900 rounded-lg p-6 shadow-sm border border-neutral-200 dark:border-neutral-700">
            <h2 className="text-xl font-semibold mb-4 text-neutral-900 dark:text-white">
              About
            </h2>
          </div>
        );
    }
  };

  return (
    <div className="mx-auto px-4 sm:px-6 my-8">
      {/* Profile Header - Clean version without banner */}
      <div className="rounded-xl p-6 shadow-sm border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 mb-8">
        <div className="flex flex-col sm:flex-row items-start gap-6">
          {/* Profile Picture */}
          <EditableProfilePicture src={data.user.profilePicture} />

          {/* Profile Info */}
          <div className="flex-1 space-y-3">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                {data.user.firstName} {data.user.lastName}
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                @{data.user.username}
              </p>
            </div>

            <div className="flex items-center gap-4">
              <Link
                href={`/user/${username}/followers`}
                className="text-neutral-700 dark:text-neutral-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-sm"
              >
                <span className="font-semibold">
                  {data.user.followersCount}
                </span>{" "}
                Followers
              </Link>
              <Link
                href={`/user/${username}/following`}
                className="text-neutral-700 dark:text-neutral-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-sm"
              >
                <span className="font-semibold">
                  {data.user.followingCount}
                </span>{" "}
                Following
              </Link>
            </div>

            {!data.user.isSelf && (
              <div className="pt-1">
                <FollowButton
                  initialIsFollowing={data.user.isFollowing}
                  username={data.user.username}
                  // className="text-sm px-4 py-1.5"
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-6">
        <LinkTabs tabs={tabs} />
      </div>

      {/* Tab Content */}
      <div className="mb-8">{RenderTab()}</div>
    </div>
  );
};

export default ProfilePage;
