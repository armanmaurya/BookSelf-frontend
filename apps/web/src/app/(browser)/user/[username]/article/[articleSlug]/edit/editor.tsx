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

export const Editor = ({
  content,
  slug,
  title,
}: {
  title: string;
  content: string;
  slug: string;
}) => {
  const [articleSlug, setArticleSlug] = useState<string | null>(slug);
  const { user } = useAuth();

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
        })
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
      })

      if (data) {
        const slug = data.updateArticle.slug;
        window.history.replaceState({}, "", `/${user?.username}/article/${slug}/edit`);
        setArticleSlug(slug);
      }

    } catch (error) {
      console.log(error);
    }
  };
  const DeleteArticle = async () => {
    const csrf = Cookies.get("csrftoken");

    try {
      const res = await fetch(`${API_ENDPOINT.article.url}?slug=${slug}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": `${csrf}`,
        },
        credentials: "include",
      });
      if (res.ok) {
        console.log("Article deleted");
        const res = await fetch("/api/revalidate?path=/");
        const ata = await res.json();
        console.log(ata);
        window.location.href = "/";
      }
    } catch (error) {
      console.log(error);
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
