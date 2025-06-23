"use client";

import { useRef, useState } from "react";
import { gql } from "@apollo/client";
import client from "@/lib/apolloClient";
import { CommentType } from "@/types/comment";
import { useRouter } from "next/navigation";
import nProgress from "nprogress";

export const AddComment = ({
  articleSlug,
  comments,
  setComments,
  parentCommentId,
  onCanceled,
  focused
}: {
  articleSlug: string;
  comments: CommentType[];
  setComments: React.Dispatch<React.SetStateAction<CommentType[]>>;
  parentCommentId?: number;
  onCanceled?: () => void;
  focused?: boolean;
}) => {
  const [text, setText] = useState("");
  const [isShow, setIsShow] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const router = useRouter();
  
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
        ... on AuthencatationError {
          __typename
          message
        }
        ... on CommentType {
          id
          content
          createdAt
          isLiked
          likesCount
          repliesCount
          user {
            firstName
            lastName
            username
          }
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

      if (!data || !data.createComment) {
        console.error("No comment returned from server.");
        return;
      }

      if (data.createComment.__typename === "AuthencatationError") {
        // Redirect to login
        nProgress.start();
        router.push("/signin");
        return;
      }

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
        onFocus={() => setIsShow(true)}
        autoFocus={focused}
      ></textarea>
      {
        isShow && (
          <div className="flex justify-end space-x-2">
            <button
              onClick={() => {
                setText("");
                if (onCanceled) {
                  onCanceled();
                } else {
                  setIsShow(false);
                }
              }}
              className={`rounded-full p-2 right-0 bg-gray-400 bg-opacity-25`}
            >
              Cancel
            </button>
            <button
              onClick={addComment}
              className={`rounded-full p-2 right-0 ${text.length == 0 ? "bg-gray-400 opacity-30" : "bg-blue-400"
                }`}
            >
              Comment
            </button>
          </div>
        )
      }
    </div>
  );
};
