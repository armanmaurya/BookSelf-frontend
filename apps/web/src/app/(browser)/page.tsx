// Home Page

// import { ArticleCard } from "../../components/blocks/card";
import { API_ENDPOINT } from "../utils";
// import { Article } from "../types";
import client from "@/lib/apolloClient";
import { gql } from "@apollo/client";
import { ArticleCard } from "@/components/element/cards/ArticleCard";
import { Article } from "@bookself/types";

const GET_ARTICLES = gql`
  query MyQuery {
    articles {
      slug
      title
      views
      createdAt
      likesCount
      status
      author {
        username
        firstName
        lastName
        profilePicture
        isSelf
      }
    }
}
`;


export default async function Home() {
  const { data } = await client.query({ query: GET_ARTICLES });
  const articles = data.articles;

  return (
    <main className="">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-4">
        {articles.map((article: Article) => {
          return <div>
            <ArticleCard article={article} />
          </div>
        })}
      </div>

    </main>
  );
}
