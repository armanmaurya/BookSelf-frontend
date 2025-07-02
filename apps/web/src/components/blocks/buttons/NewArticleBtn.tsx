"use client";
import { API_ENDPOINT } from "@/app/utils";
import { useAuth } from "@/context/AuthContext";
import client from "@/lib/apolloClient";
import { gql } from "@apollo/client";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import * as NProgress from "nprogress";
import { FaPenNib } from "react-icons/fa";
import { Button } from "@/components/ui/button"; // shadcn button import

export const NewArticleButton = ({
  children,
}: {
  children: React.ReactNode;
}) => {
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
        router.push(
          `/user/${user?.username}/article/${data.createArticle.article.slug}/edit`
        );
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <Button
      variant="ghost"
      onClick={() => newArticle()}
      className="flex items-center space-x-1.5"
    >
      {children}
    </Button>
  );
};
