"use client";
import { ArticleCard } from "@/components/element/cards/ArticleCard";
import client from "@/lib/apolloClient";
import { gql } from "@apollo/client";
import { useEffect, useState } from "react";
import { format } from "date-fns";

const Page = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

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
    const { data } = await client.query({
      query: QUERY,
      variables: { lastId: lastId, number: 10 },
    });
    if (data) {
      setHistory(data.me.readingHistory);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory({ lastId: 0 });
  }, []);

  const groupedHistory = history.reduce((acc: any, item: any) => {
    const date = format(new Date(item.lastVisited), "MMMM dd, yyyy");
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(item);
    return acc;
  }, {});

  return (
    <div className="">
      <h1 className="text-3xl font-bold mb-5">Reading History</h1>
      {loading ? (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="animate-spin w-24 h-24 border-t-2 rounded-full" />
        </div>
      ) : (
        <div>
          {Object.keys(groupedHistory).map((date) => (
            <div key={date}>
              <h2 className="text-2xl font-semibold mb-3 mt-2">{date}</h2>
              <div className="flex flex-col space-y-2">
                {groupedHistory[date].map((item: any) => (
                  <div key={item.id}>
                    <ArticleCard article={item.article} />
                    <div style={{ height: 1 }} className="bg-white bg-opacity-25" />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Page;
