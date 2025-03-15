"use client";
import { API_ENDPOINT } from "@/app/utils";
import { useAuth } from "@/context/AuthContext";
import client from "@/lib/apolloClient";
import { gql } from "@apollo/client";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import * as NProgress from "nprogress";
import { FaPenNib } from "react-icons/fa";

export const NewArticleButton = () => {
  const router = useRouter();
  const { user } = useAuth();
  const MUTATION = gql`
    mutation MyMutation($content: String, $title: String) {
      createArticle(content: $content, title: $title) {
        content
        title
        article {
          slug
        }
      }
    }
  `;

  const newArticle = async () => {
    const csrf = Cookies.get("csrftoken");
    try {
      const { data } = await client.mutate({
        mutation: MUTATION,
        variables: { content: null, title: null },
      });

      if (data) {
        console.log("Article created");
        NProgress.start();
        router.push(`/user/${user?.username}/article/${data.createArticle.article.slug}/edit`);
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
