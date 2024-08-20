import React from "react";

import { ArticleCard } from "../../components/blocks/card";
import { API_ENDPOINT } from "../utils";
import { Article } from "../types";

const fetchData = async () => {
  try {
    const res = await fetch(API_ENDPOINT.article.url, {
      next: {
        tags: ["home"],
      },
    });
    return res.json();
  } catch (error) {
    console.error("Error fetching data:", error);
    // Handle the error here, e.g. show an error message to the user
    throw error; // Rethrow the error to propagate it to the caller
  }
};

export default async function Home() {
  const data: Promise<Article>[] = await fetchData();
  // console.log(data);
  // await checklogin();

  return (
    <main className="h-full flex justify-center items-center">
      <div className="w-full h-full space-y-2 overflow-auto flex flex-col p-2">
        {data.map(async (articlePromise) => {
          const article = await articlePromise;
          return <ArticleCard key={article.id} data={article} />;
        })}
      </div>
      {/* <div className="w-96 flex items-center justify-center border mx-2 rounded-md">
        Latest Article
      </div> */}
    </main>
  );
}
