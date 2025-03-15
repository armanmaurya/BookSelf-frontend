import { API_ENDPOINT } from "@/app/utils";
import { Comments } from "@/components/blocks/Comments";
import { FollowButton } from "@/components/element/button/FollowButton";
// import { EditButton } from "@/components/element/button/EditButton";
import { LikeButton } from "@/components/element/button/LikeButton";
import { SaveArticleButton } from "@/components/element/button/SaveArticleButton";
import { createServerClient } from "@/lib/ServerClient";
import { User } from "@/types/auth";
import { GraphQLData } from "@/types/graphql";
import { gql } from "@apollo/client";
import { RenderContent } from "@bookself/slate-editor";
// import { Article } from "@bookself/types";
import { cookies } from "next/headers";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

// -----------------Icons----------------------------
import { IoMdEye } from "react-icons/io";


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
  const { data }: {
    data: GraphQLData;
  } = await createServerClient().query({ query: QUERY, variables: { slug: articleSlug } });

  const article = data.article;
  if (article.slug != articleSlug) {
    redirect(`${article.slug}`)
  }

  return (
    <div className="">

      <div className="flex items-center space-x-3">
        <LikeButton
          initialState={article.isLiked}
          initialLikes={article.likesCount}
          url={`${API_ENDPOINT.likeArticle.url}?slug=${articleSlug}`}
          method={`${API_ENDPOINT.likeArticle.method}`}
        />
        <div className="flex items-center space-x-1">
          <IoMdEye />
          <span>{article.views}</span>
        </div>
        {article.author.isSelf && (
          <Link href={`${articleSlug}/edit`} className="text-gray-400">
            Edit
          </Link>
        )}
        <SaveArticleButton articleSlug={articleSlug} isSaved={false}/>
      </div>
      {/* Main Article Content */}
      <main>
        <div>
          <RenderContent
            title={article.title}
            value={JSON.parse(article.content)}
          />

        </div>
      </main>
      <div style={{ height: 1 }} className="w-full bg-gray-200" />

      {/* User Information */}
      <div className="flex items-center space-x-3">
        <Link href={`/user/${article.author.username}`}>
          <Image
            width={40}
            height={40}
            className="rounded-full h-10"
            src={article.author.profilePicture}
            alt=""
          />
        </Link>
        <div className="py-5 flex items-center space-x-4">
          <div>
            <div>
              Written By{" "}
              <Link className="text-blue-500 hover:underline" href={`/user/${article.author.username}`}>
                {article.author.firstName} {article.author.lastName}
              </Link>
            </div>
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
      <div className="">
        <Comments totalCommentsCount={data.article.totalCommentsCount} commentsCount={data.article.commentsCount} initialComments={data.article.comments} articleSlug={articleSlug} />
      </div>
    </div>
  );
};

export default Page;
