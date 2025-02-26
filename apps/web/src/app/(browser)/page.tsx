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
    <main className="flex">
      <div className="w-full space-y-2">
        {articles.map((article: Article) => {
          return <div>
            <ArticleCard article={article} />
            {/* <div style={{ height: 1 }} className='bg-white bg-opacity-25' /> */}
          </div>
        })}
      </div>

    </main>
  );
}
