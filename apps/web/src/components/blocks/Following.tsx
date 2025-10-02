"use client";
import { gql } from "@apollo/client";
import { GraphQLData } from "@/types/graphql";
import client from "@/lib/apolloClient";
import { useEffect, useState } from "react";
import { User } from "@/types/user";
import { FollowCard } from "../element/cards/FollowCard";
// import { Skeleton } from "../ui/skeleton";

export const FollowingBlock = ({ username, className }: { username: string; className?: string }) => {
  const [following, setFollowing] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);

  const QUERY = gql`
    query MyQuery($username: String!, $lastId: Int, $number: Int!) {
      user(username: $username) {
        following(lastId: $lastId, number: $number) {
          id
          username
          isFollowing
          profilePicture
          followingCount
          firstName
          lastName
        }
      }
    }
  `;

  const fetchFollowing = async ({ lastId }: { lastId?: number }) => {
    try {
      setLoading(true);
      const { data }: { data: GraphQLData } = await client.query({
        query: QUERY,
        variables: {
          username: username,
          lastId: lastId,
          number: 10,
        },
      });
      
      const newFollowing = data.user.following;
      setFollowing(prev => [...prev, ...newFollowing]);
      setHasMore(newFollowing.length > 0);
    } catch (error) {
      console.error("Error fetching following:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFollowing({});
  }, [username]);

  const handleLoadMore = () => {
    const lastId = following.length > 0 ? following[following.length - 1].id : undefined;
    fetchFollowing({ lastId });
  };

  return (
    <div className={"space-y-4 " + (className || "") }>
      {loading && following.length === 0 ? (
        <div className="flex items-center justify-center py-16">
          <div className="relative">
            <div className="h-12 w-12 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
            <div className="absolute inset-0 h-12 w-12 rounded-full border-4 border-transparent border-r-primary/40 animate-spin" style={{ animationDuration: '1.5s', animationDirection: 'reverse' }} />
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {following.map((user: User, index: number) => (
            <div
              key={user.id}
              className="animate-in fade-in slide-in-from-bottom-4 duration-500"
              style={{ 
                animationDelay: `${Math.min(index, 8) * 50}ms`,
                animationFillMode: 'both'
              }}
            >
              <FollowCard {...user} />
            </div>
          ))}
        </div>
      )}

      {/* {hasMore && !loading && (
        <div className="flex justify-center mt-6">
          <button
            onClick={handleLoadMore}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Load More
          </button>
        </div>
      )} */}

      {!loading && following.length === 0 && (
        <div className="text-center py-10">
          <p className="text-gray-500 dark:text-gray-400">
            No following users found
          </p>
        </div>
      )}
    </div>
  );
};