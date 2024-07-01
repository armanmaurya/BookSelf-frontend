"use client";
import { API_ENDPOINT } from "@/app/utils";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

export const NewArticleBtn = () => {
  const router = useRouter();

  const newArticle = async () => {
    const csrf = Cookies.get("csrftoken");
    try {
      const res = await fetch(API_ENDPOINT.article.url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": `${csrf}`,
        },
        credentials: "include",
      });

      if (res.ok) {
        console.log("Article created");
        const data = await res.json();
        // console.log(data);
        // setIsOpened(false);

        router.push(`/editor/${data.id}`);
      }
    } catch (error) {
      console.log("Network error");
    }
  };
  return <button onClick={newArticle}>New Article</button>;
};
