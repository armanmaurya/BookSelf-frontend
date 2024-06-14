import React from "react";
import Image from "next/image";
import Link from "next/link";
import { cookies } from "next/headers";
import { ArticleCard, ArticleCard2 } from "./components/card";
import { API_ENDPOINT } from "./utils";

interface Article {
  id: number;
  title: string;
  content: string;
  author: number;
  created_at: string;
}


const fetchData = async () => {
  try {
    const res = await fetch(API_ENDPOINT.article.url);
    return res.json();
  } catch (error) {
    console.error("Error fetching data:", error);
    // Handle the error here, e.g. show an error message to the user
    throw error; // Rethrow the error to propagate it to the caller
  }
};



export default function Home() {

  
  // const data: Promise<Article>[] = await fetchData();
  // console.log(data);
  // await checklogin();

  return (
    <main className="px-2 mt-2">
      <div className="flex space-x-2">
        {/* {data.map(async (articlePromise) => {
          const article = await articlePromise;
          return <ArticleCard key={article.id} data={article} />;
        })} */}
      </div>
    </main>
  );
}
