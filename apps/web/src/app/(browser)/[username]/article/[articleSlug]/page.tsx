import { API_ENDPOINT } from "@/app/utils";
import { Button } from "@/components/element/button";
import { FollowButton } from "@/components/element/button/FollowButton";
// import { EditButton } from "@/components/element/button/EditButton";
import { LikeButton } from "@/components/element/button/LikeButton";
import { User } from "@/types/auth";
import { RenderContent } from "@bookself/slate-editor/renderer";
import { Article } from "@bookself/types";
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

  const res = await fetch(`${API_ENDPOINT.article.url}?slug=${articleSlug}`, {
    cache: "no-store",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Cookie: `${cookieStore.get("sessionid")?.name}=${cookieStore.get("sessionid")?.value
        }`,
    },
  });

  const {
    article,
    author,
  }: {
    article: Article;
    author: User;
  } = await res.json();

  console.log("article", author);
  return (
    <div className="">
      <div className="flex items-center space-x-3">
        <LikeButton
          initialState={article.liked}
          initialLikes={article.likes}
          url={`${API_ENDPOINT.likeArticle.url}?slug=${articleSlug}`}
          method={`${API_ENDPOINT.likeArticle.method}`}
        />
        {author.is_self && (
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
        <Link href={`/${author.username}`}>
          <img
            className="rounded-full h-10"
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQrE8nc9Fu5rmmNIUGCGx6WZWsF_YqHAtFtST8LTKtLZFKXYtw-eR6sJOc&usqp=CAE&s"
            alt=""
          />
        </Link>
        <div className="py-5 flex items-center space-x-4">
          <div>
            <Link href={`/${author.username}`}>
              Written By{" "}
              <span className="text-blue-500">
                {author.first_name} {author.last_name}
              </span>
            </Link>
            <div>
              <Link href={`/${username}/followers`} className="hover:underline">{author.followers_count} Followers</Link> ·{" "}
              <Link href={`/${username}/following`} className="hover:underline">{author.following_count} Following</Link>
            </div>
          </div>
          <div>
            {
              !author.is_self && (
                <FollowButton initialIsFollowing={author.is_following} username={username} />
              )
            }
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
