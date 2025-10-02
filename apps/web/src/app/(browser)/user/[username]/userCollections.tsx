"use client";
import client from "@/lib/apolloClient";
import { CollectionType } from "@/types/collection";
import { gql } from "@apollo/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";
import { FaPlus, FaFolderOpen } from "react-icons/fa";

const COLLECTION_QUERY = gql`
  query GetUserCollections($username: String!, $lastId: Int) {
    user(username: $username) {
      collections(number: 10, lastId: $lastId) {
        createdAt
        description
        id
        updatedAt
        name
        indexArticle {
          createdAt
          id
          isLiked
          isSelf
          likesCount
          slug
          status
          thumbnail
          title
          totalCommentsCount
          updatedAt
          views
          savesCount
          commentsCount
        }
      }
    }
  }
`;

export const UserCollections = ({
  username,
  isSelf,
}: {
  username: string;
  isSelf: boolean;
}) => {
  const [collections, setCollections] = useState<CollectionType[]>([]);
  const [lastId, setLastId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  const fetchCollections = async (currentLastId: number | null = null) => {
    setLoading(true);
    try {
      const { data } = await client.query({
        query: COLLECTION_QUERY,
        variables: { username, lastId: currentLastId },
      });

      if (data.user.collections.length === 0) {
        setHasMore(false);
      } else {
        setCollections((prev) => [...prev, ...data.user.collections]);
        // Update lastId to the id of the last collection for next pagination
        const lastCollection = data.user.collections[data.user.collections.length - 1];
        setLastId(parseInt(lastCollection.id));
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch collections"
      );
    } finally {
      setLoading(false);
      setInitialLoading(false);
    }
  };

  useEffect(() => {
    fetchCollections();
  }, [username]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          fetchCollections(lastId);
        }
      },
      { threshold: 0.1 }
    );

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => {
      if (loadMoreRef.current) {
        observer.unobserve(loadMoreRef.current);
      }
    };
  }, [hasMore, loading, lastId]);

  if (error) {
    return <div className="text-red-500 p-4">Error: {error}</div>;
  }

  if (initialLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="relative">
          <div className="h-16 w-16 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
          <div
            className="absolute inset-0 h-16 w-16 rounded-full border-4 border-transparent border-r-primary/40 animate-spin"
            style={{ animationDuration: "1.5s", animationDirection: "reverse" }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with filters */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-semibold">Collections</h2>
          {!initialLoading && collections.length > 0 && (
            <Badge variant="secondary" className="text-xs">
              {collections.length}{" "}
              {collections.length === 1 ? "collection" : "collections"}
            </Badge>
          )}
        </div>

        <div className="flex items-center gap-4">
          {/* Create New Collection Button */}
          {isSelf && (
            <Button className="gap-2 shrink-0">
              <FaPlus className="h-4 w-4" />
              <span>New Collection</span>
            </Button>
          )}
        </div>
      </div>

      {/* Collections Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {collections.map((col, index) => (
          <div
            key={col.id}
            className="animate-in fade-in slide-in-from-bottom-4 duration-500"
            style={{
              animationDelay: `${Math.min(index, 8) * 50}ms`,
              animationFillMode: "both",
            }}
          >
            <Link
              href={`/user/${username}/collection/${col.id}`}
              className="group block h-full"
            >
              {/* Stack Effect Container */}
              <div className="relative">
                {/* Stack layers - multiple cards behind the main one */}
                <div className="absolute inset-0 bg-white dark:bg-gray-800 rounded-lg shadow-sm transform rotate-1 translate-x-1 translate-y-1 opacity-60" />
                <div className="absolute inset-0 bg-white dark:bg-gray-700 rounded-lg shadow-sm transform -rotate-0.5 translate-x-0.5 translate-y-0.5 opacity-80" />

                {/* Main Card */}
                <Card className="group overflow-hidden relative border-0 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer h-full transform hover:-translate-y-1">
                  <div className="relative w-full aspect-[16/9] overflow-hidden">
                    {/* Background - either article thumbnail or gradient fallback */}
                    {col.indexArticle?.thumbnail ? (
                      <>
                        <Image
                          src={col.indexArticle.thumbnail}
                          alt={`Cover for ${col.name}`}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        />
                        {/* Overlay to indicate it's a collection */}
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/30 via-transparent to-primary/20" />
                      </>
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-100 via-purple-50 to-pink-100 dark:from-blue-900 dark:via-purple-800 dark:to-pink-900">
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-primary/10" />
                      </div>
                    )}

                    {/* Collection Icon with stack indicator */}
                    <div className="absolute top-4 left-4">
                      <div className="relative">
                        {/* Stack indicator - small cards behind icon */}
                        <div className="absolute -top-1 -left-1 w-10 h-10 bg-white/10 dark:bg-black/10 rounded-lg transform rotate-12" />
                        <div className="absolute -top-0.5 -left-0.5 w-10 h-10 bg-white/15 dark:bg-black/15 rounded-lg transform rotate-6" />

                        {/* Main icon */}
                        <div className="relative w-12 h-12 bg-white/20 dark:bg-black/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                          <FaFolderOpen className="h-6 w-6 text-primary" />
                        </div>
                      </div>
                    </div>

                    {/* Stack count indicator */}
                    <div className="absolute top-4 right-4">
                      <div className="bg-black/30 backdrop-blur-sm rounded-full px-2 py-1 text-xs text-white font-medium">
                        📚 Collection
                      </div>
                    </div>

                    {/* Gradient overlay for text contrast */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                    {/* Content overlay */}
                    <div className="absolute inset-0 p-4 flex flex-col justify-end text-white">
                      <div className="space-y-2">
                        <h3 className="text-lg font-bold text-white line-clamp-2 leading-tight">
                          {col.name}
                        </h3>

                        {col.description && (
                          <p className="text-sm text-white/80 line-clamp-2 mb-2">
                            {col.description}
                          </p>
                        )}

                        {/* Metadata with stack-like styling */}
                        <div className="flex items-center justify-between text-xs text-white/70">
                          <div className="flex items-center gap-1">
                            <div className="w-1 h-1 bg-white/60 rounded-full" />
                            <span>
                              Created{" "}
                              {new Date(col.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          {col.updatedAt && col.updatedAt !== col.createdAt && (
                            <div className="flex items-center gap-1">
                              <div className="w-1 h-1 bg-white/60 rounded-full" />
                              <span>
                                Updated{" "}
                                {new Date(col.updatedAt).toLocaleDateString()}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            </Link>
          </div>
        ))}

        {loading && collections.length > 0 && (
          <div className="col-span-full flex justify-center py-8">
            <div className="relative">
              <div className="h-10 w-10 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
              <div
                className="absolute inset-0 h-10 w-10 rounded-full border-4 border-transparent border-r-primary/40 animate-spin"
                style={{
                  animationDuration: "1.5s",
                  animationDirection: "reverse",
                }}
              />
            </div>
          </div>
        )}
      </div>

      <div ref={loadMoreRef} className="flex justify-center py-4 min-h-16">
        {!hasMore && collections.length === 0 && (
          <Card className="border-dashed border-2 border-muted-foreground/20 w-full">
            <CardContent className="flex flex-col items-center justify-center py-16 px-6 text-center">
              <div className="rounded-full bg-muted p-4 mb-4">
                <FaFolderOpen className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">
                {isSelf
                  ? "No collections created yet"
                  : `${username} hasn't created any collections yet`}
              </h3>
              <p className="text-muted-foreground max-w-md mb-6">
                {isSelf
                  ? "Start organizing your articles by creating your first collection."
                  : "This user hasn't started creating collections yet."}
              </p>
              {isSelf && (
                <Button className="gap-2">
                  <FaPlus className="h-4 w-4" />
                  Create Collection
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};
