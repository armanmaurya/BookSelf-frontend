"use client";
import { gql } from "@apollo/client";
import { GraphQLData } from "@/types/graphql";
import client from "@/lib/apolloClient";
import { useEffect, useState } from "react";
import { User } from "@/types/user";
import { FollowCard } from "../element/cards/FollowCard";
// import { Skeleton } from "../ui/skeleton";
// import { Button } from "../ui/button";
// import { Alert, AlertDescription } from "../ui/alert";

export const Follower = ({ username, className }: { username: string; className?: string }) => {
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
    <div className={"space-y-4 " + (className || "")}>
      {loading && followers.length === 0 ? (
        <div className="flex items-center justify-center py-16">
          <div className="relative">
            <div className="h-12 w-12 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
            <div className="absolute inset-0 h-12 w-12 rounded-full border-4 border-transparent border-r-primary/40 animate-spin" style={{ animationDuration: '1.5s', animationDirection: 'reverse' }} />
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
          {followers.map((user, index) => (
            <div
              key={user.id}
              className="animate-in fade-in slide-in-from-bottom-4 duration-500"
              style={{ 
                animationDelay: `${Math.min(index, 8) * 50}ms`,
                animationFillMode: 'both'
              }}
            >
              <FollowCard 
                {...user} 
                showFollowButton={!user.isSelf}
              />
            </div>
          ))}
        </div>
      )}

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