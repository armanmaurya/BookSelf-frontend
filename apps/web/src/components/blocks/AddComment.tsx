"use client";

import { useRef, useState } from "react";
import { Button } from "../element/button";
import { gql } from "@apollo/client";
import client from "@/lib/apolloClient";
import { CommentType } from "@/types/comment";

export const AddComment = ({
  articleSlug,
  comments,
  setComments,
  parentCommentId,
}: {
  articleSlug: string;
  comments: CommentType[];
  setComments: React.Dispatch<React.SetStateAction<CommentType[]>>;
  parentCommentId?: number;
}) => {
  const [text, setText] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(event.target.value);
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"; // Reset height to recalculate
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`; // Set to scrollHeight
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && event.ctrlKey) {
      addComment();
    }
  };

  const MUTATION = gql`
    mutation MyMutation($content: String!, $articleSlug: String!, $parentId: Int) {
      createComment(articleSlug: $articleSlug, content: $content, parentId: $parentId) {
        content
        id
        createdAt
        user {
          firstName
          lastName
          username
        }
      }
    }
  `;

  const addComment = async () => {
    try {
      const { data } = await client.mutate({
        mutation: MUTATION,
        variables: { content: text, articleSlug, parentId: parentCommentId },
      });
      setComments([data.createComment, ...comments]);
      setText("");
    } catch (error) {
      console.error("Error adding comment", error);
    }
  };

  return (
    <div className="flex flex-col space-y-2">
      <textarea
        ref={textareaRef}
        placeholder="Add a comment"
        className={`w-full focus:outline-none resize-none bg-transparent border-b-2 border-gray-400 focus:border-white`}
        onChange={handleChange}
        rows={1}
        value={text}
        onKeyDown={handleKeyDown}
      ></textarea>
      <div className="flex justify-end">
        <button
          onClick={addComment}
          className={`rounded-full p-2 right-0 ${
            text.length == 0 ? "bg-gray-400 opacity-30" : "bg-blue-400"
          }`}
        >
          Comment
        </button>
      </div>
    </div>
  );
};
