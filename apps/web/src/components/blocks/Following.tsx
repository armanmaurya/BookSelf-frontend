"use client";
import { gql } from "@apollo/client";
import { GraphQLData } from "@/types/graphql";
import client from "@/lib/apolloClient";
import { useEffect, useState } from "react";
import { User } from "@/types/auth";
import { FollowCard } from "../element/cards/FollowCard";
// import { Skeleton } from "../ui/skeleton";

export const FollowingBlock = ({ username }: { username: string }) => {
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
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {following.map((user: User) => (
          <FollowCard key={user.id} {...user} />
        ))}
        
        {/* {loading && (
          Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="space-y-3 p-4 border rounded-lg">
              <div className="flex items-center space-x-3">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-[120px]" />
                  <Skeleton className="h-3 w-[80px]" />
                </div>
              </div>
              <Skeleton className="h-8 w-full rounded-md" />
            </div>
          ))
        )} */}
      </div>

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