// Home Page

import { ArticleCard } from "../../components/blocks/card";
import { API_ENDPOINT } from "../utils";
import { Article } from "../types";
import client from "@/lib/apolloClient";
import { gql } from "@apollo/client";

const GET_ARTICLES = gql`
  query MyQuery {
    articles {
      content
      slug
      title
      views
      createdAt
      author {
        username
        firstName
        lastName
      }
    }
}
`;


export default async function Home() {
  const { data } = await client.query({ query: GET_ARTICLES });
  const articles = data.articles;

  return (
    <main className="flex justify-center items-center">
      <div className="w-full h-full space-y-2 overflow-auto flex flex-col p-2">
        {articles.map((article: Article) => {
          return <ArticleCard href={`/${article.author.username}/article/${article.slug}`} key={article.id} data={article} />;
        })}
      </div>
    </main>
  );
}
