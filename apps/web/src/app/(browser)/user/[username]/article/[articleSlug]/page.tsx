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
      relatedArticles {
        id
        slug
        title
        author {
          username
          firstName
          lastName
          profilePicture
        }
      }
    }
  }
`;

// Remove the commented out MORE_ARTICLES_QUERY since we're using relatedArticles now

const Page = async ({
  params,
}: {
  params: Promise<{ username: string; articleSlug: string }>;
}) => {
  const { username, articleSlug } = await params;

  let data: GraphQLData | null = null;
  try {
    const result = await createServerClient().query({
      query: QUERY,
      variables: { slug: articleSlug },
    });
    data = result.data;
  } catch (error) {
    return redirect("/not-found");
  }

  const article = data?.article;
  if (!article) {
    return redirect("/not-found");
  }
  if (article.slug != articleSlug) {
    redirect(`${article.slug}`);
  }

  return (
    <div className="flex flex-col lg:flex-row max-w-[1500px] mx-auto px-6 gap-8">
      {/* Main Content */}
      <div className="flex-1 min-w-0">
        {/* Article Header */}
        <Card className="border-none p-6">
          <div className="">
            <h1 className="text-3xl font-bold mb-2">{article.title}</h1>

            {/* Article Stats */}
            <div className="flex items-center gap-4 text-muted-foreground mb-6">
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
                <Link href={`${articleSlug}/edit`} className="flex items-center justify-center gap-1 hover:text-primary transition-colors mx-1">
                  <FiEdit2 className="text-lg" size={16}/>
                  <span>Edit</span>
                </Link>
              )}

              <SaveArticleButton articleSlug={articleSlug} isSaved={false} />
            </div>
          </div>

          {/* Main Article Content */}
          <main className="prose dark:prose-invert max-w-none">
            <div className=""
              dangerouslySetInnerHTML={{ __html: article.content }}
            />
          </main>
        </Card>
        <Separator className="my-8" />
        {/* Author Information */}
        <Card className="p-4 mb-8">
          <div className="flex items-start gap-4">
            <Link href={`/user/${article.author.username}`} className="flex-shrink-0">
              <Avatar className="h-16 w-16">
                <AvatarImage src={article.author.profilePicture} />
                <AvatarFallback>
                  {article.author.username.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </Link>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2 mb-1">
                    <h3 className="text-lg font-semibold">
                      <Link
                        href={`/user/${article.author.username}`}
                        className="hover:underline"
                      >
                        {article.author.firstName} {article.author.lastName}
                      </Link>
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      @{article.author.username}
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
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
                  <div className="flex-shrink-0">
                    <FollowButton
                      initialIsFollowing={article.author.isFollowing}
                      username={username}
                    />
                  </div>
                )}
              </div>
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
      {/* Related Articles Sidebar */}
      <aside className="hidden lg:block w-80 flex-shrink-0">
        <div className="sticky top-8">
          <h2 className="text-xl font-semibold mb-4">Related Articles</h2>
          <div className="flex flex-col gap-3 max-h-[80vh] overflow-y-auto pr-2">
            {(!(article as any).relatedArticles || (article as any).relatedArticles.length === 0) && (
              <div className="text-muted-foreground text-sm">
                No related articles found.
              </div>
            )}
            {(article as any).relatedArticles?.map((a: any) => (
              <Card key={a.id} className="p-4 hover:shadow-md transition-shadow">
                <Link
                  href={`/user/${a.author.username}/article/${a.slug}`}
                  className="block group"
                >
                  <div className="space-y-3">
                    <h3 className="font-medium text-sm leading-tight line-clamp-2 group-hover:text-primary transition-colors">
                      {a.title}
                    </h3>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-5 w-5">
                        <AvatarImage src={a.author.profilePicture} />
                        <AvatarFallback className="text-xs">
                          {a.author.username.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-xs text-muted-foreground">
                        {a.author.firstName} {a.author.lastName}
                      </span>
                    </div>
                  </div>
                </Link>
              </Card>
            ))}
          </div>
        </div>
      </aside>
    </div>
  );
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ username: string; articleSlug: string }>;
}): Promise<Metadata> {
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
    title: `${data.article.title}` || "Article",
  };
}

export default Page;
