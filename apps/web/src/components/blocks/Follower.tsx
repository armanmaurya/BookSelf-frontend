"use client";
import { gql } from "@apollo/client";
import { GraphQLData } from "@/types/graphql";
import client from "@/lib/apolloClient";
import { useEffect, useState } from "react";
import { User } from "@/types/auth";
import { FollowCard } from "../element/cards/FollowCard";
// import { Skeleton } from "../ui/skeleton";
// import { Button } from "../ui/button";
// import { Alert, AlertDescription } from "../ui/alert";

export const Follower = ({ username }: { username: string }) => {
  const [followers, setFollowers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [lastId, setLastId] = useState<number | undefined>();

  const QUERY = gql`
    query MyQuery($username: String!, $lastId: Int, $number: Int!) {
      user(username: $username) {
        followers(lastId: $lastId, number: $number) {
          id
          username
          isFollowing
          profilePicture
          followingCount
          firstName
          lastName
          isSelf
        }
      }
    }
  `;

  const fetchFollowers = async ({ lastId }: { lastId?: number } = {}) => {
    try {
      setLoading(true);
      setError(null);
      
      const { data }: { data: GraphQLData } = await client.query({
        query: QUERY,
        variables: {
          username: username,
          lastId: lastId,
          number: 10,
        },
      });
      
      const newFollowers = data.user.followers;
      setFollowers(prev => [...prev, ...newFollowers]);
      setHasMore(newFollowers.length > 0);
      if (newFollowers.length > 0) {
        setLastId(newFollowers[newFollowers.length - 1].id);
      }
    } catch (err) {
      console.error("Error fetching followers:", err);
      setError("Failed to load followers. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setFollowers([]);
    fetchFollowers();
  }, [username]);

  const handleLoadMore = () => {
    fetchFollowers({ lastId });
  };

  return (
    <div className="space-y-4">
      {/* {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )} */}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {followers.map((user) => (
          <FollowCard 
            key={user.id} 
            {...user} 
            showFollowButton={!user.isSelf}
            // displayName={`${user.firstName} ${user.lastName}`}
          />
        ))}

        {/* {loading && (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-center space-x-4 p-4 border rounded-lg">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
              <Skeleton className="h-9 w-24 rounded-md" />
            </div>
          ))
        )} */}
      </div>

      {/* {hasMore && !loading && (
        <div className="flex justify-center mt-6">
          <Button 
            onClick={handleLoadMore}
            variant="outline"
            className="px-6"
          >
            Load More Followers
          </Button>
        </div>
      )} */}

      {!loading && !error && followers.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            No followers found
          </p>
        </div>
      )}
    </div>
  );
};