import client from "@/lib/apolloClient";
import { gql } from "@apollo/client";
import React from "react";
import { IoMdHeart, IoMdHeartEmpty } from "react-icons/io";

export const CommentLikeButton = ({
  initialLikes,
  initialState,
  commentId,
}: {
  initialLikes: number;
  initialState: boolean;
  commentId: number;
}) => {
  const [liked, setLiked] = React.useState(initialState);
  const [likes, setLikes] = React.useState(initialLikes);

  const MUTATION = gql`
    mutation MyMutation($id: Int!) {
      toggleCommentLike(id: $id) {
        id
      }
    }
  `;

  const toggleLike = async () => {
    try {
      const res = await client.mutate({
        mutation: MUTATION,
        variables: {
          id: commentId,
        },
      });

      if (res.data) {
        setLiked(!liked);
        setLikes(liked ? likes - 1 : likes + 1);
      }
    } catch (error) {
      console.error("Error toggling like", error);
    }
  };

  return (
    <span
      className="flex items-center space-x-1 cursor-pointer"
      onClick={toggleLike}
    >
      {liked ? (
        <IoMdHeart color="#808080" size={20} />
      ) : (
        <IoMdHeartEmpty color="#808080" size={20} />
      )}
      <span className="text-sm">{likes}</span>
    </span>
  );
};
