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
          thumbnail
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
            imageUrl
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
    <div className="space-y-6">
      {/* Header with filters */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-semibold">Articles</h2>
          {!loading && articles.length > 0 && (
            <Badge variant="secondary" className="text-xs">
              {articles.length} {articles.length === 1 ? "article" : "articles"}
            </Badge>
          )}
        </div>
        
        <div className="flex items-center gap-4">
          {/* Create New Article Button */}
          {isSelf && (
            <NewArticleButton>
              <FaPenNib className="h-4 w-4" />
              <span>New Article</span>
            </NewArticleButton>
          )}
          
          {/* Filter and Sort Controls */}
          <div className="flex items-center gap-2">
            {/* Tabs for Owner */}
            {isSelf && (
              <div className="flex items-center gap-1 bg-muted/30 rounded-lg p-1">
                {["published", "draft"].map((tabValue) => (
                  <button
                    key={tabValue}
                    onClick={() => setFilter(tabValue as "published" | "draft")}
                    className={`
                      px-3 py-1.5 text-sm rounded-md transition-colors flex items-center gap-1
                      ${filter === tabValue 
                        ? "bg-primary text-primary-foreground" 
                        : "bg-transparent text-muted-foreground hover:bg-muted/80"
                      }
                    `}
                  >
                    {tabValue === "published" ? (
                      <>
                        <FaBookOpen className="h-3.5 w-3.5" />
                        Published
                      </>
                    ) : (
                      <>
                        <FaPenNib className="h-3.5 w-3.5" />
                        Drafts
                      </>
                    )}
                  </button>
                ))}
              </div>
            )}

            {/* Sort Control */}
            <Select
              value={sortBy}
              onValueChange={(value) =>
                setSortBy(value as "LATEST" | "POPULAR")
              }
            >
              <SelectTrigger className="w-[120px] h-8 border-0 bg-muted/50 hover:bg-muted transition-colors focus:ring-1 focus:ring-primary">
                <SelectValue />
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
          </div>
        </div>
      </div>

      {/* Articles Section */}
      <div className="space-y-6">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="relative">
              <div className="h-16 w-16 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
              <div className="absolute inset-0 h-16 w-16 rounded-full border-4 border-transparent border-r-primary/40 animate-spin" style={{ animationDuration: '1.5s', animationDirection: 'reverse' }} />
            </div>
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
                      className="animate-in fade-in slide-in-from-bottom-4 duration-500"
                      style={{ 
                        animationDelay: `${Math.min(idx, 8) * 50}ms`,
                        animationFillMode: 'both'
                      }}
                    >
                      <div className="transform hover:-translate-y-1 transition-all duration-300">
                        <ArticleCard article={article as Article} />
                      </div>
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
                    className="animate-in fade-in slide-in-from-bottom-4 duration-500"
                    style={{ 
                      animationDelay: `${Math.min(idx, 8) * 50}ms`,
                      animationFillMode: 'both'
                    }}
                  >
                    <div className="transform hover:-translate-y-1 transition-all duration-300">
                      <DraftArticleCard
                        draftArticle={draft}
                        href={`/user/${username}/article/${draft.article.slug}/edit`}
                      />
                    </div>
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