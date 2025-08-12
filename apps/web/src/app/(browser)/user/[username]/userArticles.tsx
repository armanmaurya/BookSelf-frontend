"use client";
import { ArticleCard } from "@/components/element/cards/ArticleCard";
import { DraftArticleCard } from "@/components/element/cards/DraftArticleCard";
import client from "@/lib/apolloClient";
import { GraphQLData } from "@/types/graphql";
import { gql } from "@apollo/client";
import { Article, DraftArticle } from "@/types/article";
import React from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  FaBookOpen,
  FaPenNib,
  FaFire,
  FaClock,
  FaFilter,
  FaExclamationTriangle,
} from "react-icons/fa";
import { NewArticleButton } from "@/components/blocks/buttons/NewArticleBtn";

export const UserArticles = ({
  username,
  isSelf,
}: {
  username: string;
  isSelf: boolean;
}) => {
  const PUBLISHED_QUERY = gql`
    query MyQuery($username: String!, $sortBy: ArticleSortBy) {
      user(username: $username) {
        articles(sortBy: $sortBy) {
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
              author {
                username
              }
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
  const [sortBy, setSortBy] = React.useState<"LATEST" | "POPULAR">("LATEST");

  React.useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError(null);

    const fetchArticles = async () => {
      try {
        if (filter === "published") {
          const { data } = await client.query({
            query: PUBLISHED_QUERY,
            variables: { username, sortBy },
          });
          if (isMounted) setArticles(data.user.articles);
        } else {
          const { data } = await client.query({ query: DRAFT_QUERY });
          if (
            isMounted &&
            data.draftArticles.__typename === "DraftArticleList"
          ) {
            setArticles(data.draftArticles.articles);
          }
        }
      } catch (err) {
        if (isMounted)
          setError(
            filter === "published"
              ? "Failed to load articles"
              : "Failed to load draft articles"
          );
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchArticles();

    return () => {
      isMounted = false;
    };
  }, [username, filter, sortBy]);

  return (
    <div className="space-y-8">
      {/* Header Section with improved design */}
      <div className="flex flex-col space-y-6">
        {/* Sort Controls - Always visible for published articles */}
        <Card className="border-0 shadow-sm bg-gradient-to-r from-background via-background to-muted/20">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <FaFilter className="h-4 w-4" />
                  <span className="text-sm font-medium">Sort Articles</span>
                </div>
                <Select
                  value={sortBy}
                  onValueChange={(value) =>
                    setSortBy(value as "LATEST" | "POPULAR")
                  }
                >
                  <SelectTrigger className="w-[140px] h-9 border-2 hover:border-primary/50 transition-colors">
                    <div className="flex items-center gap-2">
                      {sortBy === "LATEST" ? (
                        <FaClock className="h-3 w-3 text-blue-500" />
                      ) : (
                        <FaFire className="h-3 w-3 text-orange-500" />
                      )}
                      <SelectValue />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="LATEST">
                      <div className="flex items-center gap-2">
                        <FaClock className="h-3 w-3 text-blue-500" />
                        <span>Latest</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="POPULAR">
                      <div className="flex items-center gap-2">
                        <FaFire className="h-3 w-3 text-orange-500" />
                        <span>Popular</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
                <Badge variant="outline" className="hidden sm:inline-flex">
                  {articles.length}{" "}
                  {articles.length === 1 ? "article" : "articles"}
                </Badge>
              </div>

              {/* Owner Controls */}
              {isSelf && (
                <div className="flex items-center gap-3">
                  <div className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-200 rounded-md">
                    <NewArticleButton>
                      <FaPenNib className="h-4 w-4" />
                      <span>Create Article</span>
                    </NewArticleButton>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Tabs for Owner */}
        {isSelf && (
          <div className="flex justify-center">
            <Tabs
              value={filter}
              onValueChange={(value) =>
                setFilter(value as "published" | "draft")
              }
              className="w-full max-w-md"
            >
              <TabsList className="grid w-full grid-cols-2 h-11 bg-muted/50">
                <TabsTrigger
                  value="published"
                  className="text-sm font-medium data-[state=active]:bg-background data-[state=active]:shadow-sm"
                >
                  📚 Published
                </TabsTrigger>
                <TabsTrigger
                  value="draft"
                  className="text-sm font-medium data-[state=active]:bg-background data-[state=active]:shadow-sm"
                >
                  ✏️ Drafts
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        )}
      </div>

      {/* Articles Section */}
      <div className="space-y-6">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card
                key={i}
                className="group hover:shadow-lg transition-all duration-300"
              >
                <CardContent className="p-0">
                  <div className="aspect-[16/9] bg-gradient-to-br from-muted via-muted/70 to-muted animate-pulse rounded-t-lg" />
                  <div className="p-6 space-y-3">
                    <div className="h-4 bg-muted animate-pulse rounded" />
                    <div className="h-3 bg-muted animate-pulse rounded w-3/4" />
                    <div className="flex gap-2">
                      <div className="h-5 bg-muted animate-pulse rounded w-16" />
                      <div className="h-5 bg-muted animate-pulse rounded w-20" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : error ? (
          <Card className="border-destructive/20 bg-destructive/5">
            <CardContent className="flex flex-col items-center justify-center py-16 px-6 text-center">
              <div className="rounded-full bg-destructive/10 p-4 mb-4">
                <FaExclamationTriangle className="h-8 w-8 text-destructive" />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-destructive">
                Something went wrong
              </h3>
              <p className="text-muted-foreground max-w-md">{error}</p>
            </CardContent>
          </Card>
        ) : articles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((article, idx) => {
              if (filter === "published") {
                if ((article as Article).slug) {
                  return (
                    <div
                      key={(article as Article).slug}
                      className="transform hover:-translate-y-1 transition-all duration-300"
                    >
                      <ArticleCard article={article as Article} />
                    </div>
                  );
                }
                return null;
              }
              const draft = article as DraftArticle;
              if (draft.article?.slug) {
                return (
                  <div
                    key={draft.article.slug}
                    className="transform hover:-translate-y-1 transition-all duration-300"
                  >
                    <DraftArticleCard
                      draftArticle={draft}
                      href={`/user/${username}/article/${draft.article.slug}/edit`}
                    />
                  </div>
                );
              }
            })}
          </div>
        ) : (
          <Card className="border-dashed border-2 border-muted-foreground/20">
            <CardContent className="flex flex-col items-center justify-center py-16 px-6 text-center">
              <div className="rounded-full bg-muted p-4 mb-4">
                {filter === "draft" ? (
                  <FaPenNib className="h-8 w-8 text-muted-foreground" />
                ) : (
                  <FaBookOpen className="h-8 w-8 text-muted-foreground" />
                )}
              </div>
              <h3 className="text-lg font-semibold mb-2">
                {filter === "draft"
                  ? "No drafts yet"
                  : isSelf
                  ? "No published articles yet"
                  : "No articles published yet"}
              </h3>
              <p className="text-muted-foreground max-w-md mb-6">
                {filter === "draft"
                  ? "Start writing and save your ideas as drafts. They'll appear here when you're ready to work on them."
                  : isSelf
                  ? "Share your knowledge and stories with the world. Create your first article to get started."
                  : "This user hasn't published any articles yet. Check back later!"}
              </p>
              {isSelf && filter === "published" && (
                <NewArticleButton>
                  <FaPenNib className="h-4 w-4" />
                  <span>Create Your First Article</span>
                </NewArticleButton>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};
