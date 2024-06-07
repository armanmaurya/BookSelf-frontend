import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArticleCard, ArticleCard2 } from "./components/articleCard";

interface Article {
  id: number;
  title: string;
  content: string;
  author: number;
  created_at: string;
}

const checklogin = async () => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/example/`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      }
    );
    if (response.ok) {
      console.log("Login success")
      // window.location.href = "/";
    } else {
      console.log("Login failed")
    }
  }
  catch (error) {
    console.log("Network error");
  }
}

const fetchData = async () => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/articles`);
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
  await checklogin();

  return (
    <main className="px-2 mt-2">
      <div className="flex space-x-2">
        {data.map(async (articlePromise) => {
          const article = await articlePromise;
          return <ArticleCard key={article.id} data={article} />;
        })}
      </div>
    </main>
  );
}
