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
import { AddArticleCover } from "@/components/element/AddArticleCover";
import Image from "next/image";

export const Editor = ({
  content,
  slug,
  title,
  status,
  imageUrl,
}: {
  title: string;
  content: string;
  slug: string;
  status: string;
  imageUrl: string;
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
  // console.log("content", content);
  return (
    <div className="mt-12">
      <div className="w-full mb-4 flex items-center justify-center">
        {/* Show Cover Image */}
        {/* {imageUrl && (
          <div className="aspect-w-16 aspect-h-9 w-[800px] bg-white">
            <Image
              width={300}
              height={200}

              src={`${imageUrl}`}
              alt="Cover Image"
              className="w-full h-full object-cover overflow-hidden rounded-lg"
            />
          </div>
        )} */}
      </div>
      <div className="flex">
        <AddArticleCover articleSlug={articleSlug} />
        <div
          className="bg-green-600 rounded-full flex items-center justify-center m-1 text-xs p-1 cursor-pointer"
          onClick={PublishArticle}
        >
          {status === "DR" ? "Publish" : "Update"}
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
