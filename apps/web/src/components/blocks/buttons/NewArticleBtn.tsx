"use client";
import { API_ENDPOINT } from "@/app/utils";
import { useAuth } from "@/hooks/use-user";
import client from "@/lib/apolloClient";
import { gql } from "@apollo/client";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import * as NProgress from "nprogress";
import { FaPenNib } from "react-icons/fa";
import { Button } from "@/components/ui/button"; // shadcn button import
import { Loader2 } from "lucide-react";
import { useState } from "react";

export const NewArticleButton = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const router = useRouter();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
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
    setIsLoading(true);
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
      disabled={isLoading}
    >
      {isLoading ? (
        <span className="flex items-center gap-2">
          <Loader2 className="animate-spin h-4 w-4" />
          Creating...
        </span>
      ) : (
        children
      )}
    </Button>
  );
};
