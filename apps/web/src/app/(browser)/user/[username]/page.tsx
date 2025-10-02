import { API_ENDPOINT } from "@/app/utils";
import { cookies } from "next/headers";
import { gql } from "@apollo/client";
import { createServerClient } from "@/lib/ServerClient";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { FollowButton } from "@/components/element/button/FollowButton";
import { UserArticles } from "./userArticles";
import { GraphQLData } from "@/types/graphql";
import { UserCollections } from "./userCollections";
import { UserBooks } from "./userBooks";
import { AnimatedTabs } from "./AnimatedTabs";

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
        about
        articlesCount
        collectionsCount
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
    { value: "books", label: "Books" },
  ];

  const activeTab = searchParams?.tab || "overview";

  const RenderTab = () => {
    switch (activeTab) {
      case "collections":
        return (
          <UserCollections username={username} isSelf={data.user.isSelf} />
        );
      case "articles":
        return <UserArticles isSelf={data.user.isSelf} username={username} />;
      case "books":
        return <UserBooks username={username} isSelf={data.user.isSelf} />;
      default:
        return (
          <div className="space-y-6">
            {/* Quick Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                    <svg
                      className="h-5 w-5 text-blue-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Articles</p>
                    <p className="text-2xl font-bold">
                      {data.user.articlesCount}
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                    <svg
                      className="h-5 w-5 text-green-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 7h10M7 11h10M7 15h6M5 5v14a2 2 0 002 2h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2z"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Collections</p>
                    <p className="text-2xl font-bold">
                      {data.user.collectionsCount}
                    </p>
                  </div>
                </div>
              </Card>
            </div>

            {/* Empty State for new users */}
            {(!data.user.about || data.user.about.trim().length === 0) && (
              <Card className="p-8 text-center">
                <div className="max-w-md mx-auto">
                  <div className="p-3 bg-muted/50 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <svg
                      className="h-8 w-8 text-muted-foreground"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold mb-2">
                    {data.user.isSelf
                      ? "Complete Your Profile"
                      : `Get to know ${data.user.firstName}`}
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    {data.user.isSelf
                      ? "Add a bio to tell others about yourself and your interests."
                      : "This user hasn't added a bio yet, but check out their articles and activity."}
                  </p>
                  {data.user.isSelf && (
                    <Button variant="outline" size="sm" className="mt-4">
                      Add Bio
                    </Button>
                  )}
                </div>
              </Card>
            )}
          </div>
        );
    }
  };

  return (
    <div className="mx-auto px-4 sm:px-6 py-8 inset-0 -z-10 bg-gradient-to-b from-primary/5 via-background to-background">
      <div className="max-w-7xl mx-auto">
        {/* Profile Header */}
        <Card className="overflow-hidden mb-8">
          {/* Cover/Background Section */}
          <div className="h-32 bg-gradient-to-r from-neutral-700 to-neutral-900 relative">
            <div className="absolute inset-0 bg-black/30"></div>
          </div>

          <div className="relative px-6 pb-6">
            {/* Profile Picture - Overlapping the cover */}
            <div className="flex flex-col sm:flex-row items-start gap-6 -mt-12">
              <div className="flex-shrink-0 relative">
                <Avatar className="h-24 w-24 border-4 border-white dark:border-neutral-800 shadow-lg">
                  <AvatarImage
                    src={data.user.profilePicture}
                    alt={`${data.user.firstName} ${data.user.lastName}`}
                  />
                  <AvatarFallback className="text-lg font-bold bg-gradient-to-br from-neutral-700 to-neutral-900 text-white">
                    {data.user.firstName?.charAt(0).toUpperCase()}
                    {data.user.lastName?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>

                {/* Online status indicator */}
                <div className="absolute bottom-1 right-1 h-6 w-6 bg-green-500 border-2 border-white dark:border-gray-800 rounded-full"></div>
              </div>

              {/* Profile Info */}
              <div className="flex-1 space-y-4 mt-4 sm:mt-12">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                  <div className="space-y-2">
                    <div>
                      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                        {data.user.firstName} {data.user.lastName}
                      </h1>
                      <p className="text-lg text-muted-foreground flex items-center gap-2">
                        @{data.user.username}
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200">
                          {data.user.isSelf ? "You" : "Member"}
                        </span>
                      </p>
                    </div>

                    {/* Stats */}
                    <div className="flex items-center gap-6 pt-2">
                      <Link
                        href={`/user/${username}/followers`}
                        className="text-sm hover:text-gray-700 dark:hover:text-gray-300 transition-colors group"
                      >
                        <span className="font-bold text-lg group-hover:text-gray-700 dark:group-hover:text-gray-300">
                          {data.user.followersCount}
                        </span>
                        <br />
                        <span className="text-muted-foreground">Followers</span>
                      </Link>
                      <Link
                        href={`/user/${username}/following`}
                        className="text-sm hover:text-gray-700 dark:hover:text-gray-300 transition-colors group"
                      >
                        <span className="font-bold text-lg group-hover:text-gray-700 dark:group-hover:text-gray-300">
                          {data.user.followingCount}
                        </span>
                        <br />
                        <span className="text-muted-foreground">Following</span>
                      </Link>
                    </div>
                  </div>

                  {/* Action Button */}
                  {!data.user.isSelf ? (
                    <div className="flex-shrink-0 mt-4">
                      <FollowButton
                        initialIsFollowing={data.user.isFollowing}
                        username={data.user.username}
                      />
                    </div>
                  ) : (
                    <div className="flex-shrink-0 mt-4">
                      <Link
                        href={`/settings/profile`}
                        className="gap-2 flex outline p-2 outline-1 outline-gray-300 dark:outline-gray-600 rounded-lg items-center hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                      >
                        <svg
                          className="h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                          />
                        </svg>
                        Edit Profile
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Tabs */}
        <AnimatedTabs tabs={tabs} activeTab={activeTab} username={username} />

        {/* Tab Content */}
        <div className="mb-8">
          <RenderTab />
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
