"use client";
import client from "@/lib/apolloClient";
import { CollectionType } from "@/types/Collection";
import { gql } from "@apollo/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";

const COLLECTION_QUERY = gql`
  query GetUserCollections($username: String!, $page: Int!) {
    collections(page: $page, username: $username) {
      createdAt
      description
      id
      updatedAt
      name
    }
  }
`;

export const UserCollections = ({ username }: { username: string }) => {
  const [collections, setCollections] = useState<CollectionType[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  const fetchCollections = async (pageNum: number) => {
    setLoading(true);
    try {
      const { data } = await client.query({
        query: COLLECTION_QUERY,
        variables: { username, page: pageNum },
      });

      if (data.collections.length === 0) {
        setHasMore(false);
      } else {
        setCollections((prev) => [...prev, ...data.collections]);
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
    fetchCollections(page);
  }, [page]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          setPage((prev) => prev + 1);
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
  }, [hasMore, loading]);

  if (error) {
    return <div className="text-red-500 p-4">Error: {error}</div>;
  }

  if (initialLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <Card key={`skeleton-${index}`}>
            <CardHeader>
              <Skeleton className="h-6 w-3/4" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-4 w-full mt-2" />
              <Skeleton className="h-4 w-1/2 mt-2" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {collections.map((col) => (
          <Link 
            href={`/user/${username}/collection/${col.id}`} 
            key={col.id}
            className="group"
          >
            <Card className="transition-all duration-200 group-hover:border-primary group-hover:shadow-lg h-full">
              <CardHeader>
                <CardTitle className="text-lg group-hover:text-primary transition-colors">
                  {col.name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground group-hover:text-foreground transition-colors">
                  {col.description || "No description"}
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}

        {loading && collections.length > 0 && (
          <>
            {Array.from({ length: 3 }).map((_, index) => (
              <Card key={`loading-${index}`}>
                <CardHeader>
                  <Skeleton className="h-6 w-3/4" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-4 w-full mt-2" />
                  <Skeleton className="h-4 w-1/2 mt-2" />
                </CardContent>
              </Card>
            ))}
          </>
        )}
      </div>

      <div ref={loadMoreRef} className="flex justify-center py-4 min-h-16">
        {loading && collections.length === 0 && (
          <Loader2 className="h-6 w-6 animate-spin" />
        )}
        {!hasMore && collections.length === 0 && (
          <span className="text-muted-foreground text-sm">
            No collections found
          </span>
        )}
      </div>
    </div>
  );
};