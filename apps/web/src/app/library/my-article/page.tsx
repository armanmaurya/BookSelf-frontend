import { Article } from "@/app/types";
import { API_ENDPOINT } from "@/app/utils";
import { ArticleCard } from "@/components/blocks";
import { cookies } from "next/headers";
import React from "react";

const fetchData = async () => {
  const cookieStore = cookies();

  try {
    const res = await fetch(`${API_ENDPOINT.article.url}myarticles/`, {
      headers: {
        Cookie: `${cookieStore.get("sessionid")?.name}=${
          cookieStore.get("sessionid")?.value
        }`,
      },
    });
    return res.json();
  } catch (error) {
    console.error("Error fetching data:", error);
    // Handle the error here, e.g. show an error message to the user
    throw error; // Rethrow the error to propagate it to the caller
  }
};

const Page = async () => {
  const data: Promise<Article>[] = await fetchData();

  return (
    <div className="w-full h-full space-y-2 overflow-auto pr-2">
      {data.map(async (articlePromise) => {
        const article = await articlePromise;
        return <ArticleCard key={article.id} data={article} />;
      })}
    </div>
  );
};

export default Page;
