import { API_ENDPOINT } from "@/app/utils";
import { Comments } from "@/components/blocks/Comments";
import { FollowButton } from "@/components/element/button/FollowButton";
import { LikeButton } from "@/components/element/button/LikeButton";
import { SaveArticleButton } from "@/components/element/button/SaveArticleButton";
import { createServerClient } from "@/lib/ServerClient";
import { GraphQLData } from "@/types/graphql";
import { gql } from "@apollo/client";
import { RenderContent } from "@bookself/slate-editor";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Metadata } from "next";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { IoMdEye } from "react-icons/io";
import { FiEdit2 } from "react-icons/fi";
import Link from "next/link";

const Page = async ({
  params,
}: {
  params: Promise<{ username: string; articleSlug: string }>;
}) => {
  const { username, articleSlug } = await params;

  const QUERY = gql`
    query MyQuery($slug: String!) {
      article(slug: $slug) {
        content
        createdAt
        id
        isLiked
        likesCount
        slug
        title
        views
        author {
          firstName
          lastName
          isFollowing
          isSelf
          followingCount
          followersCount
          username
          profilePicture
        }
        comments(number: 10) {
          content
          id
          createdAt
          isLiked
          likesCount
          repliesCount
          user {
            firstName
            lastName
            username
          }
        }
        commentsCount
        totalCommentsCount
      }
    }
  `;

  let data: GraphQLData | null = null;
  try {
    const result = await createServerClient().query({
      query: QUERY,
      variables: { slug: articleSlug },
    });
    data = result.data;
  } catch (error) {
    return redirect('/not-found');
  }

  const article = data?.article;
  if (!article) {
    return redirect('/not-found');
  }
  if (article.slug != articleSlug) {
    redirect(`${article.slug}`);
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      {/* Article Header */}
      <Card className="p-6 mb-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">
            {article.title}
          </h1>

          {/* Article Stats */}
          <div className="flex items-center gap-6 text-muted-foreground mb-6">
            <div className="flex items-center gap-2">
              <LikeButton
                initialState={article.isLiked}
                initialLikes={article.likesCount}
                url={`${API_ENDPOINT.likeArticle.url}?slug=${articleSlug}`}
                method={`${API_ENDPOINT.likeArticle.method}`}
              />
            </div>

            <div className="flex items-center gap-2">
              <IoMdEye className="text-lg" />
              <span>{article.views} views</span>
            </div>

            {article.author.isSelf && (
              <Link href={`${articleSlug}/edit`}>
                <Button variant="ghost" className="gap-2">
                  <FiEdit2 className="text-lg" />
                  <span>Edit</span>
                </Button>
              </Link>
            )}

            <SaveArticleButton
              articleSlug={articleSlug}
              isSaved={false}
            />
          </div>
        </div>

        {/* Main Article Content */}
        <main className="prose dark:prose-invert max-w-none mb-12">
          <RenderContent
            title={article.title}
            value={JSON.parse(article.content)}
          />
        </main>
      </Card>

      <Separator className="my-8" />

      {/* Author Information */}
      <Card className="p-4 mb-8">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
          <Link href={`/user/${article.author.username}`}>
            <Avatar className="h-16 w-16">
              <AvatarImage src={article.author.profilePicture} />
              <AvatarFallback>
                {article.author.username.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </Link>
          <div className="flex-1 flex flex-col sm:flex-row w-full gap-4">
            <div className="flex-1 w-full flex flex-col justify-center">
              <div className="mb-1 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                <h3 className="text-lg font-semibold">
                  <Link href={`/user/${article.author.username}`} className="hover:underline">
                    {article.author.firstName} {article.author.lastName}
                  </Link>
                </h3>
                <p className="text-muted-foreground text-sm sm:ml-2">
                  @{article.author.username}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm mb-3">
                <Link
                  href={`/user/${username}/followers`}
                  className="hover:text-primary transition-colors"
                >
                  <span className="font-semibold">
                    {article.author.followersCount}
                  </span>{" "}
                  Followers
                </Link>
                <Link
                  href={`/user/${username}/following`}
                  className="hover:text-primary transition-colors"
                >
                  <span className="font-semibold">
                    {article.author.followingCount}
                  </span>{" "}
                  Following
                </Link>
              </div>
            </div>
            {!article.author.isSelf && (
              <div className="flex items-end sm:items-start justify-end sm:justify-center pt-1">
                <FollowButton
                  initialIsFollowing={article.author.isFollowing}
                  username={username}
                />
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* Comments Section */}
      <div className="">
        <Separator className="mb-4" />
        <Comments
          totalCommentsCount={article.totalCommentsCount}
          commentsCount={article.commentsCount}
          initialComments={article.comments}
          articleSlug={articleSlug}
        />
      </div>
    </div>
  );
};

export async function generateMetadata({ params }: { params: Promise<{ username: string; articleSlug: string }> }): Promise<Metadata> {
  const { articleSlug } = await params;
  const QUERY = gql`
    query MyQuery($slug: String!) {
      article(slug: $slug) {
        title
      }
    }
  `;
  const { data }: { data: GraphQLData } = await createServerClient().query({
    query: QUERY,
    variables: { slug: articleSlug },
  });
  return {
    title: `${data.article.title}` || "Article"
  };
}

export default Page;