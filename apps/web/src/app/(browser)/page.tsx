// Home Page

import { API_ENDPOINT } from "../utils";
import client from "@/lib/apolloClient";
import { gql } from "@apollo/client";
import { ArticleCard } from "@/components/element/cards/ArticleCard";
import { Article } from "@bookself/types";
import { cookies } from "next/headers";
import { LandingPage } from "@/components/LandingPage";

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
  const cookieStore = cookies();
  const isAuthenticated = !!cookieStore.get("sessionid")?.value;

  // If user is not authenticated, show landing page
  if (!isAuthenticated) {
    return <LandingPage />;
  }

  // If user is authenticated, show the articles feed
  const { data } = await client.query({ query: GET_ARTICLES });
  const articles = data.articles;


  return (
    <main>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.map((article: Article) => (
          <div key={article.slug} className="transform hover:-translate-y-1 transition-all duration-300">
            <ArticleCard article={article} />
          </div>
        ))}
      </div>
    </main>
  );
}
