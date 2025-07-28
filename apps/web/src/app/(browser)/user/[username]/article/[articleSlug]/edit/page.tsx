import React from "react";
import { Editor } from "./editor";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { API_ENDPOINT } from "@/app/utils";
// import { Article } from "@/app/types";
import { gql } from "@apollo/client";
import client from "@/lib/apolloClient";
import { createServerClient } from "@/lib/ServerClient";
import { GraphQLData } from "@/types/graphql";
import Tiptap from "@/components/TipTap";

const Page = async ({
  params,
}: {
  params: Promise<{ username: string; articleSlug: string }>;
}) => {
  const { username, articleSlug } = await params;
  //   console.log("username", username);
  //   console.log("article", article);
  const cookieStore = cookies();

  if (!cookieStore.get("sessionid")?.value) {
    redirect("/");
  }

  const QUERY = gql`
    query MyQuery($slug: String!) {
      draftArticle(slug: $slug) {
        ... on PermissionError {
          __typename
          message
        }
        ... on ArticleDraftType {
          __typename
          title
          content
          imageUrl
          article {
            slug
            isSelf
            status
          }
        }
      }
    }
  `;

  const { data } = await createServerClient().query({
    query: QUERY,
    variables: { slug: articleSlug },
  });

  if (data.draftArticle.__typename === "PermissionError") {
    redirect("/");
  }

  if (!data || data.draftArticle.article.isSelf === false) {
    redirect("/");
  }

  if (data.draftArticle.article.slug != articleSlug) {
    redirect(
      `/user/${username}/article/${data.draftArticle.article.slug}/edit`
    );
  }

  return (
    <div className="">
      <Editor
        title={data.draftArticle.title}
        content={data.draftArticle.content}
        slug={data.draftArticle.article.slug}
        imageUrl={data.draftArticle.imageUrl}
        status={data.draftArticle.article.status}
      />
    </div>
  );
};

export default Page;
