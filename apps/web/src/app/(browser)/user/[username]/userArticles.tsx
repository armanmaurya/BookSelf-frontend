"use client";
import { ArticleCard } from "@/components/element/cards/ArticleCard";
import { DraftArticleCard } from "@/components/element/cards/DraftArticleCard";
import client from "@/lib/apolloClient";
import { createServerClient } from "@/lib/ServerClient";
import { GraphQLData } from "@/types/graphql";
import { gql } from "@apollo/client";
import { Article, DraftArticle } from "@bookself/types";
import React from "react";

export const UserArticles = ({
  username,
  isSelf,
}: {
  username: string;
  isSelf: boolean;
}) => {
  const PUBLISHED_QUERY = gql`
    query MyQuery($username: String!) {
      user(username: $username) {
        articles {
          title
          slug
          views
          likesCount
          createdAt
          status
          author {
            isSelf
            username
            profilePicture
          }
        }
      }
    }
  `;

  const DRAFT_QUERY = gql`
    query MyQuery {
      draftArticles {
        ... on AuthencatationError {
          __typename
        }
        ... on DraftArticleList {
          __typename
          articles {
            title
            updatedAt
            article {
              slug
            }
          }
        }
      }
    }
  `;

  const [articles, setArticles] = React.useState<Array<Article | DraftArticle>>(
    []
  );
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [filter, setFilter] = React.useState<"published" | "draft">(
    "published"
  );

  React.useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError(null);
    if (filter === "published") {
      client
        .query({
          query: PUBLISHED_QUERY,
          variables: { username },
        })
        .then(({ data }: { data: GraphQLData }) => {
          if (isMounted) {
            setArticles(data.user.articles);
          }
        })
        .catch((err) => {
          if (isMounted) setError("Failed to load articles");
        })
        .finally(() => {
          if (isMounted) setLoading(false);
        });
    } else {
      client
        .query({
          query: DRAFT_QUERY,
        })
        .then(({ data }) => {
          if (isMounted) {
            if (data.draftArticles.__typename === "DraftArticleList") {
              setArticles(data.draftArticles.articles);
            } else {
              setArticles([]);
            }
          }
        })
        .catch((err) => {
          if (isMounted) setError("Failed to load draft articles");
        })
        .finally(() => {
          if (isMounted) setLoading(false);
        });
    }
    return () => {
      isMounted = false;
    };
  }, [username, filter]);

  return (
    <div>
      {isSelf && (
        <div className="flex gap-2 mb-6">
          <button
            className={`px-4 py-2 rounded-md font-medium transition-colors border focus:outline-none ${
              filter === "published"
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-neutral-200 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-200 border-neutral-300 dark:border-neutral-700 hover:bg-neutral-300 dark:hover:bg-neutral-700"
            }`}
            onClick={() => setFilter("published")}
          >
            Published
          </button>
          <button
            className={`px-4 py-2 rounded-md font-medium transition-colors border focus:outline-none ${
              filter === "draft"
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-neutral-200 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-200 border-neutral-300 dark:border-neutral-700 hover:bg-neutral-300 dark:hover:bg-neutral-700"
            }`}
            onClick={() => setFilter("draft")}
          >
            Draft
          </button>
        </div>
      )}
      {loading ? (
        <div className="text-center py-12 text-gray-500 dark:text-gray-400">
          Loading articles...
        </div>
      ) : error ? (
        <div className="text-center py-12 text-red-500 dark:text-red-400">
          {error}
        </div>
      ) : articles.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {articles.map((article, idx) => {
            if (filter === "published") {
              // Only render ArticleCard for real published articles (with slug)
              if ((article as Article).slug) {
                return (
                  <ArticleCard
                    key={(article as Article).slug}
                    article={article as Article}
                  />
                );
              }
              // If not a published article, skip rendering
              return null;
            }
            // Otherwise, render Draft card
            const draft = article as DraftArticle;
            const title = draft.title ?? "Untitled";
            if (draft.article?.slug) {
              return (
                <DraftArticleCard
                  key={draft.article.slug}
                  draftArticle={draft}
                  href={`/user/${username}/article/${draft.article.slug}/edit`}
                />
              );
            }
          })}
        </div>
      ) : (
        <div className="text-center py-12 text-gray-500 dark:text-gray-400">
          No {filter === "published" ? "published" : "draft"} articles found
        </div>
      )}
    </div>
  );
};
