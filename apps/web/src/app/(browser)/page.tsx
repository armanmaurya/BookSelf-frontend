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
      isSelf
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
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.map((article: Article) => {
          return (
            <div key={article.slug}>
              <ArticleCard article={article} />
            </div>
          );
        })}
      </div>
    </main>
  );
}
