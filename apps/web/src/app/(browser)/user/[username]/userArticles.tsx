"use client";
import { ArticleCard } from "@/components/element/cards/ArticleCard";
import { DraftArticleCard } from "@/components/element/cards/DraftArticleCard";
import client from "@/lib/apolloClient";
import { GraphQLData } from "@/types/graphql";
import { gql } from "@apollo/client";
import { Article, DraftArticle } from "@bookself/types";
import React from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";

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
          isSelf
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
    
    const fetchArticles = async () => {
      try {
        if (filter === "published") {
          const { data } = await client.query({
            query: PUBLISHED_QUERY,
            variables: { username },
          });
          if (isMounted) setArticles(data.user.articles);
        } else {
          const { data } = await client.query({ query: DRAFT_QUERY });
          if (isMounted && data.draftArticles.__typename === "DraftArticleList") {
            setArticles(data.draftArticles.articles);
          }
        }
      } catch (err) {
        if (isMounted) setError(filter === "published" 
          ? "Failed to load articles" 
          : "Failed to load draft articles");
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchArticles();

    return () => {
      isMounted = false;
    };
  }, [username, filter]);

  return (
    <div className="space-y-6">
      {isSelf && (
        <Tabs 
          value={filter} 
          onValueChange={(value) => setFilter(value as "published" | "draft")}
          className="mb-6"
        >
          <TabsList>
            <TabsTrigger value="published">Published</TabsTrigger>
            <TabsTrigger value="draft">Drafts</TabsTrigger>
          </TabsList>
        </Tabs>
      )}

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, idx) => (
            <Skeleton key={idx} className="h-[200px] w-full rounded-lg" />
          ))}
        </div>
      ) : error ? (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : articles.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article, idx) => {
            if (filter === "published") {
              if ((article as Article).slug) {
                return (
                  <ArticleCard
                    key={(article as Article).slug}
                    article={article as Article}
                  />
                );
              }
              return null;
            }
            const draft = article as DraftArticle;
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
        <div className="text-center py-12 text-muted-foreground">
          No {filter === "published" ? "published" : "draft"} articles found
        </div>
      )}
    </div>
  );
};