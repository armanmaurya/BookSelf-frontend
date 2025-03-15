"use client";
import { WSGIEditor } from "@bookself/slate-editor";
// import { Article } from "@/app/types";
import Cookies from "js-cookie";
import { useCallback, useState } from "react";
import { API_ENDPOINT } from "@/app/utils";
import { Store } from "react-notifications-component";
import { useAuth } from "@/context/AuthContext";
import { gql } from "@apollo/client";
import client from "@/lib/apolloClient";
import { FaImage } from "react-icons/fa6";
import nProgress from "nprogress";
import { useRouter } from "next/navigation";

export const Editor = ({
  content,
  slug,
  title,
  status,
}: {
  title: string;
  content: string;
  slug: string;
  status: string
}) => {
  const [articleSlug, setArticleSlug] = useState<string | null>(slug);
  const { user } = useAuth();
  const router = useRouter();

  const MUTATION = gql`
    mutation MyMutation($content: String, $title: String, $slug: String!) {
      updateArticle(title: $title, content: $content, slug: $slug) {
        slug
      }
    }
  `;
  const UpdateContent = useCallback(
    async (body: string) => {
      console.log(body);

      const csrf = Cookies.get("csrftoken");

      try {
        const { data } = await client.mutate({
          mutation: MUTATION,
          variables: { content: body, title: null, slug: articleSlug },
        });
        if (data) {
          console.log("Success");
        }
      } catch (error) {
        console.log(error);
      }
    },
    [articleSlug]
  );

  const UpdateTitle = async (title: string) => {
    const csrf = Cookies.get("csrftoken");

    try {
      const { data } = await client.mutate({
        mutation: MUTATION,
        variables: { content: null, title: title, slug: articleSlug },
      });

      if (data) {
        const slug = data.updateArticle.slug;
        window.history.replaceState(
          {},
          "",
          `/${user?.username}/article/${slug}/edit`
        );
        setArticleSlug(slug);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const PublishArticleMutation = gql`
    mutation MyMutation($slug: String!) {
      publishArticle(slug: $slug) 
    }
  `;

  const PublishArticle = async () => {
    const { data } = await client.mutate({
      mutation: PublishArticleMutation,
      variables: { slug: articleSlug },
    });
    // console.log(data);
    if (data.publishArticle != "") {
      nProgress.start();
      router.push(`/user/${user?.username}/article/${data.publishArticle}`);
    }
  };
  console.log("content", content);
  return (
    <div className="">
      <div className="flex">
        <div className="flex items-center p-1 rounded-md space-x-2 hover:bg-gray-100 hover:bg-opacity-5 cursor-pointer">
          <FaImage />
          <span>Add Cover</span>
        </div>
        <div className="bg-green-600 rounded-full flex items-center justify-center m-1 text-xs p-1 cursor-pointer" onClick={PublishArticle}>
          {
            status === "DR" ? "Publish" : "Update"
          }
        </div>
      </div>
      <WSGIEditor
        onTitleChange={(title) => {
          console.log("title changed");
          UpdateTitle(title);
        }}
        onContentChange={UpdateContent}
        initialValue={content}
        title={title}
      />
    </div>
  );
};
