"use client";

import { useRef, useState } from "react";
import { gql } from "@apollo/client";
import client from "@/lib/apolloClient";
import { CommentType } from "@/types/comment";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const router = useRouter();
  const { toast } = useToast();
  
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
    if (text.trim().length === 0 || isSubmitting) return;

    setIsSubmitting(true);

    try {
      const { data } = await client.mutate({
        mutation: MUTATION,
        variables: { content: text, articleSlug, parentId: parentCommentId },
      });

      if (!data || !data.createComment) {
        throw new Error("No comment returned from server.");
      }

      if (data.createComment.__typename === "AuthencatationError") {
        toast({
          title: "Authentication Required",
          description: "Please sign in to add a comment.",
          variant: "destructive",
        });
        // Redirect to login
        nProgress.start();
        router.push("/signin");
        return;
      }

      setComments([data.createComment, ...comments]);
      setText("");
      setIsShow(false);
      
      toast({
        title: "Success!",
        description: "Comment added successfully.",
      });
    } catch (error) {
      console.error("Error adding comment", error);
      toast({
        title: "Error",
        description: "Failed to add comment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col space-y-2">
      <Textarea
        ref={textareaRef}
        placeholder="Add a comment"
        className="resize-none bg-transparent border-b-2 border-border focus:border-primary"
        onChange={handleChange}
        rows={1}
        value={text}
        onKeyDown={handleKeyDown}
        onFocus={() => setIsShow(true)}
        autoFocus={focused}
        disabled={isSubmitting}
      />
      {
        isShow && (
          <div className="flex justify-end space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setText("");
                if (onCanceled) {
                  onCanceled();
                } else {
                  setIsShow(false);
                }
              }}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={addComment}
              disabled={text.trim().length === 0 || isSubmitting}
              className="min-w-[80px]"
            >
              {isSubmitting ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
                  Adding...
                </div>
              ) : (
                "Comment"
              )}
            </Button>
          </div>
        )
      }
    </div>
  );
};
