import { API_ENDPOINT } from "@/app/utils";
import { cookies } from "next/headers";
import { gql } from "@apollo/client";
import { createServerClient } from "@/lib/ServerClient";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { FollowButton } from "@/components/element/button/FollowButton";
import { UserArticles } from "./userArticles";
import { GraphQLData } from "@/types/graphql";

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
        profilePicture
      }
    }
  `;

  const { data }: { data: GraphQLData } = await createServerClient().query({
    query: QUERY,
    variables: { username: username },
  });

  const tabs = [
    { value: "overview", label: "Overview" },
    { value: "articles", label: "Articles" },
    { value: "collections", label: "Collections" },
  ];

  const activeTab = searchParams?.tab || "overview";

  const RenderTab = () => {
    switch (activeTab) {
      case "collections":
        return (
          <Card className="text-center py-12">
            Collections coming soon
          </Card>
        );
      case "articles":
        return <UserArticles isSelf={data.user.isSelf} username={username} />;
      default:
        return (
          <Card>
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4">About</h2>
            </div>
          </Card>
        );
    }
  };

  return (
    <div className="mx-auto px-4 sm:px-6 my-8">
      {/* Profile Header */}
      <Card className="p-6 mb-8">
        <div className="flex flex-col sm:flex-row items-start gap-6">
          {/* Profile Picture */}
          <div className="flex-shrink-0">
            <Avatar className="h-24 w-24">
              <AvatarImage src={data.user.profilePicture} />
              <AvatarFallback>
                {data.user.username?.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </div>

          {/* Profile Info */}
          <div className="flex-1 space-y-3">
            <div>
              <h1 className="text-2xl font-bold">
                {data.user.firstName} {data.user.lastName}
              </h1>
              <p className="text-muted-foreground">@{data.user.username}</p>
            </div>

            <div className="flex items-center gap-4">
              <Link
                href={`/user/${username}/followers`}
                className="text-sm hover:text-primary transition-colors"
              >
                <span className="font-semibold">{data.user.followersCount}</span>{" "}
                Followers
              </Link>
              <Link
                href={`/user/${username}/following`}
                className="text-sm hover:text-primary transition-colors"
              >
                <span className="font-semibold">{data.user.followingCount}</span>{" "}
                Following
              </Link>
            </div>

            {!data.user.isSelf && (
              <div className="pt-1">
                <FollowButton
                  initialIsFollowing={data.user.isFollowing}
                  username={data.user.username}
                />
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* Tabs */}
      <Tabs value={activeTab} className="mb-6">
        <TabsList>
          {tabs.map((tab) => (
            <Link href={`/user/${username}?tab=${tab.value}`} key={tab.value}>
              <TabsTrigger value={tab.value}>{tab.label}</TabsTrigger>
            </Link>
          ))}
        </TabsList>
      </Tabs>

      {/* Tab Content */}
      <div className="mb-8">
        <RenderTab />
      </div>
    </div>
  );
};

export default ProfilePage;