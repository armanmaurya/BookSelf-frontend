import { API_ENDPOINT } from "@/app/utils";
import { AddComment } from "@/components/blocks/AddComment";
import { Comments } from "@/components/blocks/Comments";
import { Button } from "@/components/element/button";
import { FollowButton } from "@/components/element/button/FollowButton";
// import { EditButton } from "@/components/element/button/EditButton";
import { LikeButton } from "@/components/element/button/LikeButton";
import { createServerClient } from "@/lib/ServerClient";
import { User } from "@/types/auth";
import { GraphQLData } from "@/types/graphql";
import { gql } from "@apollo/client";
import { RenderContent } from "@bookself/slate-editor";
// import { Article } from "@bookself/types";
import { cookies } from "next/headers";
import Link from "next/link";

const Page = async ({
  params,
}: {
  params: Promise<{ username: string; articleSlug: string }>;
}) => {
  const { username, articleSlug } = await params;

  const cookieStore = cookies();

  console.log("username", username);
  console.log("article", articleSlug);

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
      }
    }
  `;
  // const
  // const { data } = await ServerClient.query({ query: QUERY });
  const { data }: {
    data: GraphQLData;
  } = await createServerClient().query({ query: QUERY, variables: { slug: articleSlug } });

  const article = data.article;

  // console.log("article", article.author.);
  return (
    <div className="">
      <div className="flex items-center space-x-3">
        <LikeButton
          initialState={article.isLiked}
          initialLikes={article.likesCount}
          url={`${API_ENDPOINT.likeArticle.url}?slug=${articleSlug}`}
          method={`${API_ENDPOINT.likeArticle.method}`}
        />
        {article.author.isSelf && (
          <Link href={`${articleSlug}/edit`} className="text-gray-400">
            Edit
          </Link>
        )}
      </div>
      <main>
        <RenderContent
          title={article.title}
          value={JSON.parse(article.content)}
        />
      </main>
      <div style={{ height: 1 }} className="w-full bg-gray-200" />

      <div className="flex items-center space-x-3">
        <Link href={`/user/${article.author.username}`}>
          <img
            className="rounded-full h-10"
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQrE8nc9Fu5rmmNIUGCGx6WZWsF_YqHAtFtST8LTKtLZFKXYtw-eR6sJOc&usqp=CAE&s"
            alt=""
          />
        </Link>
        <div className="py-5 flex items-center space-x-4">
          <div>
            <Link href={`/user/${article.author.username}`}>
              Written By{" "}
              <span className="text-blue-500">
                {article.author.firstName} {article.author.lastName}
              </span>
            </Link>
            <div>
              <Link href={`/user/${username}/followers`} className="hover:underline">
                {article.author.followersCount} Followers
              </Link>{" "}
              ·{" "}
              <Link href={`/user/${username}/following`} className="hover:underline">
                {article.author.followingCount} Following
              </Link>
            </div>
          </div>
          <div>
            {!article.author.isSelf && (
              <FollowButton
                initialIsFollowing={article.author.isFollowing}
                username={username}
              />
            )}
          </div>
        </div>
      </div>

      {/* Comments */}
      <div>
        <Comments commentsCount={data.article.commentsCount} initialComments={data.article.comments} articleSlug={articleSlug} />
      </div>
    </div>
  );
};

export default Page;
