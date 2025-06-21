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
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { IoMdEye } from "react-icons/io";
import { FiEdit2 } from "react-icons/fi";

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

  const { data }: { data: GraphQLData } = await createServerClient().query({
    query: QUERY,
    variables: { slug: articleSlug },
  });

  const article = data.article;
  if (article.slug != articleSlug) {
    redirect(`${article.slug}`);
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      {/* Article Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          {article.title}
        </h1>

        {/* Article Stats */}
        <div className="flex items-center space-x-6 text-gray-600 dark:text-gray-400 mb-6">
          <div className="flex items-center space-x-2">
            <LikeButton
              initialState={article.isLiked}
              initialLikes={article.likesCount}
              url={`${API_ENDPOINT.likeArticle.url}?slug=${articleSlug}`}
              method={`${API_ENDPOINT.likeArticle.method}`}
              // className="text-lg"
            />
          </div>

          <div className="flex items-center space-x-2">
            <IoMdEye className="text-lg" />
            <span>{article.views} views</span>
          </div>

          {article.author.isSelf && (
            <Link
              href={`${articleSlug}/edit`}
              className="flex items-center space-x-1 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              <FiEdit2 className="text-lg" />
              <span>Edit</span>
            </Link>
          )}

          <SaveArticleButton
            articleSlug={articleSlug}
            isSaved={false}
            // className="text-lg"
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

      {/* Divider */}
      <div className="border-t border-gray-200 dark:border-gray-700 my-8" />

      {/* Author Information */}
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 mb-12 bg-neutral-50 dark:bg-neutral-900 rounded-lg p-4 border border-neutral-200 dark:border-neutral-700 shadow-sm">
        <Link
          href={`/user/${article.author.username}`}
          className="flex-shrink-0 self-center sm:self-start"
        >
          <Image
            width={64}
            height={64}
            className="rounded-full h-16 w-16 object-cover border-2 border-white dark:border-neutral-800 shadow"
            src={article.author.profilePicture || "/default-avatar.png"}
            alt={`${article.author.username}'s profile`}
          />
        </Link>
        <div className="flex-1 flex flex-col sm:flex-row w-full gap-4">
          <div className="flex-1 w-full flex flex-col justify-center">
            <div className="mb-1 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                <Link
                  href={`/user/${article.author.username}`}
                  className="hover:underline"
                >
                  {article.author.firstName} {article.author.lastName}
                </Link>
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm sm:ml-2">
                @{article.author.username}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm mb-3">
              <Link
                href={`/user/${username}/followers`}
                className="text-neutral-700 dark:text-neutral-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                <span className="font-semibold">
                  {article.author.followersCount}
                </span>{" "}
                Followers
              </Link>
              <Link
                href={`/user/${username}/following`}
                className="text-neutral-700 dark:text-neutral-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
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
                // className="text-sm px-3 py-1"
              />
            </div>
          )}
        </div>
      </div>

      {/* Comments Section */}
      <div className="border-t border-gray-200 dark:border-gray-700 pt-8">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
          Comments ({article.totalCommentsCount})
        </h2>
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

export default Page;
