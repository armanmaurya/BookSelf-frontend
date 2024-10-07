import { Article } from "@/app/types";
import { API_ENDPOINT } from "@/app/utils";
import { ArticleCard } from "@/components/blocks";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import React from "react";
import { DeleteButton } from "./button";

const fetchData = async () => {
  const cookieStore = cookies();

  const res = await fetch(`${API_ENDPOINT.article.url}myarticles/`, {
    headers: {
      Cookie: `${cookieStore.get("sessionid")?.name}=${
        cookieStore.get("sessionid")?.value
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
        return (
          <div className="w-full flex flex-col overflow-auto relative">
            {" "}
            <DeleteButton slug={article.slug}/>
            <ArticleCard key={article.id} data={article} />
          </div>
        );
      })}
    </div>
  );
};

export default Page;

{
  /* <div className="relative">
          <button className="bg-red-400 rounded-md p-2 absolute right-2 top-2">Delete</button>
          <ArticleCard key={article.id} data={article} />
        </div>; */
}
