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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                    <p className="text-sm text-muted-foreground">
                      Collections
                    </p>
                    <p className="text-2xl font-bold">
                      {Math.floor(Math.random() * 20) + 1}
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                    <svg
                      className="h-5 w-5 text-purple-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Profile Views
                    </p>
                    <p className="text-2xl font-bold">
                      {Math.floor(Math.random() * 2000) + 500}
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
            <div className="space-y-6">
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
            </div>
            {/* Comments Section - Full Width Horizontal Scroll */}
            <Card className="p-6 w-full">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Comments</h3>
                <div className="flex gap-2">
                  <button className="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-600 rounded-md font-medium">
                    New
                  </button>
                  <button className="text-xs px-2 py-1 text-muted-foreground hover:text-foreground rounded-md">
                    Top
                  </button>
                </div>
              </div>

              <div
                className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide"
                style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
              >
                {/* New Comment 1 */}
                <div className="flex flex-col p-4 rounded-lg bg-muted/20 hover:bg-muted/30 transition-colors w-[280px] h-[180px] flex-shrink-0">
                  <div className="flex items-center gap-3 mb-3">
                    <Avatar className="h-10 w-10 flex-shrink-0">
                      <AvatarImage
                        src={`https://api.dicebear.com/7.x/avataaars/svg?seed=sarah`}
                      />
                      <AvatarFallback className="text-xs">SA</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-medium truncate">
                          Sarah Chen
                        </span>
                        <span className="text-xs bg-green-100 dark:bg-green-900/20 text-green-600 px-1.5 py-0.5 rounded flex-shrink-0">
                          New
                        </span>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        2 hours ago
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-4 flex-1">
                    &ldquo;Great insights on React performance optimization! The
                    useMemo examples really helped me understand when to use
                    it.&rdquo;
                  </p>
                  <div className="mt-3 pt-3 border-t border-muted/30">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground truncate">
                        On: &ldquo;React Performance Tips&rdquo;
                      </span>
                      <div className="flex items-center gap-1 flex-shrink-0">
                        <svg
                          className="h-3 w-3 text-red-500"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                        </svg>
                        <span className="text-xs text-muted-foreground">
                          12
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* New Comment 2 */}
                <div className="flex flex-col p-4 rounded-lg bg-muted/20 hover:bg-muted/30 transition-colors w-[280px] h-[180px] flex-shrink-0">
                  <div className="flex items-center gap-3 mb-3">
                    <Avatar className="h-10 w-10 flex-shrink-0">
                      <AvatarImage
                        src={`https://api.dicebear.com/7.x/avataaars/svg?seed=mike`}
                      />
                      <AvatarFallback className="text-xs">MJ</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-medium truncate">
                          Mike Johnson
                        </span>
                        <span className="text-xs bg-green-100 dark:bg-green-900/20 text-green-600 px-1.5 py-0.5 rounded flex-shrink-0">
                          New
                        </span>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        5 hours ago
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-4 flex-1">
                    &ldquo;This changed my approach to TypeScript completely. The
                    advanced type patterns section was incredibly detailed.&rdquo;
                  </p>
                  <div className="mt-3 pt-3 border-t border-muted/30">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground truncate">
                        On: &ldquo;Advanced TypeScript&rdquo;
                      </span>
                      <div className="flex items-center gap-1 flex-shrink-0">
                        <svg
                          className="h-3 w-3 text-red-500"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                        </svg>
                        <span className="text-xs text-muted-foreground">8</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Top Comment */}
                <div className="flex flex-col p-4 rounded-lg bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-200 dark:border-yellow-800/30 w-[280px] h-[180px] flex-shrink-0">
                  <div className="flex items-center gap-3 mb-3">
                    <Avatar className="h-10 w-10 flex-shrink-0">
                      <AvatarImage
                        src={`https://api.dicebear.com/7.x/avataaars/svg?seed=alex`}
                      />
                      <AvatarFallback className="text-xs">AL</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-medium truncate">
                          Alex Rivera
                        </span>
                        <span className="text-xs bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400 px-1.5 py-0.5 rounded flex-shrink-0">
                          ⭐ Top
                        </span>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        1 week ago
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-4 flex-1">
                    &ldquo;This is exactly what I needed! Your explanation of state
                    management patterns saved me hours of debugging.&rdquo;
                  </p>
                  <div className="mt-3 pt-3 border-t border-yellow-200/50 dark:border-yellow-800/30">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground truncate">
                        On: &ldquo;State Management Guide&rdquo;
                      </span>
                      <div className="flex items-center gap-1 flex-shrink-0">
                        <svg
                          className="h-3 w-3 text-red-500"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                        </svg>
                        <span className="text-xs text-muted-foreground">
                          24
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>{" "}
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
                  <div className="flex-shrink-0">
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

              {/* Bio/About Section in Header */}
              {data.user.about && data.user.about.trim().length > 0 && (
                <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
                  <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed max-w-2xl">
                    {data.user.about}
                  </p>
                </div>
              )}
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
