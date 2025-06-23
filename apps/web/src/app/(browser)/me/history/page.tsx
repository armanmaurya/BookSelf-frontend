"use client";
import { ArticleCard } from "@/components/element/cards/ArticleCard";
import client from "@/lib/apolloClient";
import { gql } from "@apollo/client";
import { useEffect, useState } from "react";
import { format } from "date-fns";
// import { Skeleton } from "@/components/ui/skeleton";

const Page = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const QUERY = gql`
    query MyQuery($lastId: Int, $number: Int!) {
      me {
        readingHistory(lastId: $lastId, number: $number) {
          lastVisited
          visitCount
          id
          article {
            views
            createdAt
            title
            slug
            author {
              username
            }
          }
        }
      }
    }
  `;

  const fetchHistory = async ({ lastId }: { lastId: number }) => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await client.query({
        query: QUERY,
        variables: { lastId: lastId, number: 10 },
      });
      if (data) {
        setHistory(data.me.readingHistory);
      }
    } catch (err) {
      console.error("Error fetching reading history:", err);
      setError("Failed to load reading history. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory({ lastId: 0 });
  });

  const groupedHistory = history.reduce((acc: any, item: any) => {
    const date = format(new Date(item.lastVisited), "MMMM dd, yyyy");
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(item);
    return acc;
  }, {});

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Reading History</h1>
      
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6 text-red-700 dark:text-red-300">
          {error}
        </div>
      )}

      {loading ? (
        <div className="space-y-8">
          {/* {[...Array(3)].map((_, i) => (
            <div key={i}>
              <Skeleton className="h-7 w-48 mb-4" />
              <div className="space-y-4">
                {[...Array(3)].map((_, j) => (
                  <div key={j} className="flex space-x-4">
                    <Skeleton className="h-24 w-full rounded-lg" />
                  </div>
                ))}
              </div>
            </div>
          ))} */}
        </div>
      ) : (
        <div className="space-y-8">
          {Object.keys(groupedHistory).length > 0 ? (
            Object.keys(groupedHistory).map((date) => (
              <div key={date} className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                  {date}
                </h2>
                <div className="space-y-4">
                  {groupedHistory[date].map((item: any) => (
                    <div key={item.id} className="relative">
                      <ArticleCard article={item.article} />
                      <div className="absolute -bottom-2 left-0 right-0 h-px bg-gray-100 dark:bg-gray-800/50" />
                    </div>
                  ))}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 dark:text-gray-400">
                No reading history found
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Page;