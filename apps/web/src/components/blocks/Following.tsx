"use client";
import { gql } from "@apollo/client";
import { GraphQLData } from "@/types/graphql";
import client from "@/lib/apolloClient";
import { useEffect, useState } from "react";
import { User } from "@/types/auth";
import { FollowCard } from "../element/cards/FollowCard";

export const Following = ({ username }: { username: string }) => {
  // const [following, setFollowing] = useState<User[]>([]);
  const [following, setFollowing] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const QUERY = gql`
    query MyQuery($username: String!, $lastId: Int, $number: Int!) {
      user(username: $username) {
        following(lastId: $lastId, number: $number) {
          id
          username
          isFollowing
          profilePicture
          followingCount
        }
      }
    }
  `;

  const fetchFollowing = async ({ lastId }: { lastId?: number }) => {
    const { data }: { data: GraphQLData } = await client.query({
      query: QUERY,
      variables: {
        username: username,
        lastId: lastId,
        number: 10,
      },
    });
    setFollowing([...following, ...data.user.following]);
  };
  useEffect(() => {
    fetchFollowing({});
  }, []);
  console.log(following)
  return (
    <div className="justify-center grid grid-cols-[repeat(auto-fill,minmax(200px,2fr))] sm:grid-cols-[repeat(auto-fill,minmax(256px,2fr))] gap-3">
      {following.map((user: User) => {
        return (
          <FollowCard key={user.id} {...user} />
        );
      })}
    </div>
  );
};
