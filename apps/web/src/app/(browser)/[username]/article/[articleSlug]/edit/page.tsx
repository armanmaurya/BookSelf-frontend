import React from "react";
import { Editor } from "./editor";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { API_ENDPOINT } from "@/app/utils";
// import { Article } from "@/app/types";
import { gql } from "@apollo/client";
import client from "@/lib/apolloClient";
import { createServerClient } from "@/lib/ServerClient";
import { Article } from "@bookself/types";
import { GraphQLData } from "@/types/graphql";

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
      article(slug: $slug) {
        content
        slug
        title
        isSelf
      }
    }
  `;    
//   console.log(article);
  const { data }: {
    data: GraphQLData;
  } = await createServerClient().query({ query: QUERY, variables: { slug: articleSlug } });
  
  if (data.article.isSelf === false) {
    redirect("/");
  }


  return (
    <div className="">
      {/* <RNotification /> */}
      <Editor content={data.article.content} title={data.article.title} slug={articleSlug} />
    </div>
  );
};

export default Page;
