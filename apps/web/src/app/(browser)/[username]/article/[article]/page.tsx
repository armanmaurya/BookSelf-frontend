import { API_ENDPOINT } from "@/app/utils";
import { Button } from "@/components/element/button";
import { LikeButton } from "@/components/element/button/LikeButton";
import { RenderContent } from "@bookself/slate-editor/renderer";
import { Article } from "@bookself/types";
import { cookies } from "next/headers";

const Page = async ({
  params,
}: {
  params: Promise<{ username: string; article: string }>;
}) => {
  const { username, article } = await params;

  const cookieStore = cookies();

  console.log("username", username);
  console.log("article", article);

  const res = await fetch(`${API_ENDPOINT.article.url}?slug=${article}`, {
    cache: "no-store",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Cookie: `${cookieStore.get("sessionid")?.name}=${
        cookieStore.get("sessionid")?.value
      }`,
    },
  });

  const data: Article = await res.json();
  return (
    <div className="">
      <LikeButton
        initialState={data.liked}
        initialLikes={data.likes}
        url={`${API_ENDPOINT.likeArticle.url}?slug=${article}`}
        method={`${API_ENDPOINT.likeArticle.method}`}
      />
      <RenderContent title={data.title} value={JSON.parse(data.content)} />
    </div>
  );
};

export default Page;
