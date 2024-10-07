import { Article } from "@/app/types";
import { API_ENDPOINT } from "@/app/utils";
import { ArticleCard } from "@/components/blocks";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import React from "react";

const fetchData = async () => {
  const cookieStore = cookies();

  const res = await fetch(`${API_ENDPOINT.article.url}myarticles/`, {
    headers: {
      Cookie: `${cookieStore.get("sessionid")?.name}=${cookieStore.get("sessionid")?.value
        }`,
    },
  });
  if (!res.ok) {
    return null;
  }
  return res.json();


};

const Page = async () => {
  const data: Promise<Article>[] = await fetchData();
  if (!data) {
    redirect("/auth/signin");
  }

  return (
    <div className="w-full h-full space-y-2 overflow-auto flex flex-col p-2">
      {data.map(async (articlePromise) => {
        const article = await articlePromise;
        return <ArticleCard key={article.id} data={article} />;
      })}
    </div>
  );
};

export default Page;
