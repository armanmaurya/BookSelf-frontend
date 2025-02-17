"use client";
import { API_ENDPOINT } from "@/app/utils";
import { useAuth } from "@/context/AuthContext";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import * as NProgress from "nprogress";
import { FaPenNib } from "react-icons/fa";

export const NewArticleButton = () => {
  const router = useRouter();
  const { user } = useAuth();
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
        NProgress.start();
        router.push(`/${user?.username}/article/${data.slug}`);
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <button
      onClick={(e) => {
        newArticle();
      }}
      className="p-1 flex items-center text-gray-700 hover:text-black space-x-1.5 dark:text-gray-300 dark:hover:text-white"
    >
      <FaPenNib />
      <span>Write</span>
    </button>
  );
};
