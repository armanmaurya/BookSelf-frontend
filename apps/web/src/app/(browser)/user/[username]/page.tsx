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
import { UserCollections } from "./userCollections";

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
  ];

  const activeTab = searchParams?.tab || "overview";

  const RenderTab = () => {
    switch (activeTab) {
      case "collections":
        return <UserCollections username={username} />;
      case "articles":
        return <UserArticles isSelf={data.user.isSelf} username={username} />;
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
            {/* About Section (if available) */}
            {data.user.about && data.user.about.trim().length > 0 && (
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4">
                  About {data.user.firstName}
                </h2>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  {data.user.about}
                </p>
              </Card>
            )}
            {/* Featured Content */}
            <div className="gap-4 grid grid-cols-1 md:grid-cols-2">
              {/* Recent Articles Preview - Full Width */}
              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Recent Articles</h3>
                  <Link
                    href={`/user/${username}?tab=articles`}
                    className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                  >
                    View all →
                  </Link>
                </div>
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="flex items-start gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                    >
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex-shrink-0"></div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm line-clamp-1">
                          Sample Article Title {i}
                        </h4>
                        <p className="text-xs text-muted-foreground mt-1">
                          {Math.floor(Math.random() * 30) + 1} days ago •{" "}
                          {Math.floor(Math.random() * 100) + 10} views
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Recent Collections Preview - Full Width */}
              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Recent Collections</h3>
                  <Link
                    href={`/user/${username}?tab=collections`}
                    className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                  >
                    View all →
                  </Link>
                </div>
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="flex items-start gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                    >
                      <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex-shrink-0"></div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm line-clamp-1">
                          Sample Collection Title {i}
                        </h4>
                        <p className="text-xs text-muted-foreground mt-1">
                          {Math.floor(Math.random() * 30) + 1} days ago •{" "}
                          {Math.floor(Math.random() * 20) + 3} items
                        </p>
                      </div>
                    </div>
                  ))}
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
    <div className="mx-auto px-4 sm:px-6 my-8 max-w-[1400px]">
      {/* Profile Header */}
      <Card className="overflow-hidden mb-8">
        {/* Cover/Background Section */}
        <div className="h-32 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 relative">
          <div className="absolute inset-0 bg-black/20"></div>
        </div>

        <div className="relative px-6 pb-6">
          {/* Profile Picture - Overlapping the cover */}
          <div className="flex flex-col sm:flex-row items-start gap-6 -mt-12">
            <div className="flex-shrink-0 relative">
              <Avatar className="h-24 w-24 border-4 border-white shadow-lg">
                <AvatarImage
                  src={data.user.profilePicture}
                  alt={`${data.user.firstName} ${data.user.lastName}`}
                />
                <AvatarFallback className="text-lg font-bold bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                  {data.user.firstName?.charAt(0).toUpperCase()}
                  {data.user.lastName?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>

              {/* Online status indicator */}
              <div className="absolute bottom-1 right-1 h-6 w-6 bg-green-500 border-2 border-white rounded-full"></div>
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
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100">
                        {data.user.isSelf ? "You" : "Member"}
                      </span>
                    </p>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center gap-6 pt-2">
                    <Link
                      href={`/user/${username}/followers`}
                      className="text-sm hover:text-primary transition-colors group"
                    >
                      <span className="font-bold text-lg group-hover:text-primary">
                        {data.user.followersCount}
                      </span>
                      <br />
                      <span className="text-muted-foreground">Followers</span>
                    </Link>
                    <Link
                      href={`/user/${username}/following`}
                      className="text-sm hover:text-primary transition-colors group"
                    >
                      <span className="font-bold text-lg group-hover:text-primary">
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
                  <div className="flex-shrink-0">
                    <Button variant="outline" size="sm" className="gap-2">
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
                    </Button>
                  </div>
                )}
              </div>
            </div>
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
