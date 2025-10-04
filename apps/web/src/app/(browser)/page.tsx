// Home Page

import { API_ENDPOINT } from "../utils";
import client from "@/lib/apolloClient";
import { gql } from "@apollo/client";
import { ArticleCard } from "@/components/element/cards/ArticleCard";
import { NotebookCard } from "@/components/notebook/NotebookCard";
import { Article } from "@/types/article";
import { cookies } from "next/headers";
import { LandingPage } from "@/components/LandingPage";
import { Metadata } from "next";
import Script from "next/script";

export const metadata: Metadata = {
  alternates: {
    canonical: "https://infobite.online",
  },
};

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
      thumbnail
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

const GET_NOTEBOOKS = gql`
  query GetNotebooks {
    notebooks(limit: 10, query: "", sortBy: LATEST, username: "") {
      cover
      createdAt
      hasPages
      id
      name
      overview
      pagesCount
      slug
      rootPages {
        createdAt
        hasChildren
        id
        index
        path
        slug
        title
        updatedAt
      }
      user {
        email
        username
        profilePicture
        lastName
        id
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

  // If user is authenticated, fetch both articles and notebooks in parallel
  const [articlesResult, notebooksResult] = await Promise.all([
    client.query({ query: GET_ARTICLES }),
    client.query({ query: GET_NOTEBOOKS }),
  ]);

  const articles = articlesResult.data.articles;
  const notebooks = notebooksResult.data.notebooks;

  return (
    <>
      {/* Google AdSense Script */}
      <Script
        async
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2256001565970115"
        crossOrigin="anonymous"
        strategy="afterInteractive"
      />
      
      <main className="p-3 space-y-8">
      {/* Notebooks Section */}
      {notebooks && notebooks.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">Latest Notebooks</h2>
            <a href="/notebooks" className="text-sm text-primary hover:underline">
              View all
            </a>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            {notebooks.slice(0, 5).map((notebook: any, index: number) => (
              <NotebookCard key={notebook.id} notebook={notebook} index={index} />
            ))}
          </div>
        </section>
      )}

      {/* Google AdSense Ad - Between Sections */}
      <div className="flex justify-center my-8">
        <ins
          className="adsbygoogle"
          style={{ display: "block" }}
          data-ad-client="ca-pub-2256001565970115"
          data-ad-slot="YOUR_AD_SLOT_ID_HOME"
          data-ad-format="auto"
          data-full-width-responsive="true"
        />
        <Script id="adsense-init-home" strategy="afterInteractive">
          {`(adsbygoogle = window.adsbygoogle || []).push({});`}
        </Script>
      </div>

      {/* Articles Section */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">Latest Articles</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article: Article) => (
            <div key={article.slug} className="transform hover:-translate-y-1 transition-all duration-300">
              <ArticleCard article={article} />
            </div>
          ))}
        </div>
      </section>
    </main>
    </>
  );
}
