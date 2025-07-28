"use client";
import { CommentType } from "@/types/comment";
import { MouseEventHandler, useEffect, useState } from "react";
import { AddComment } from "./AddComment";
import client from "@/lib/apolloClient";
import { gql } from "@apollo/client";
import { GraphQLData } from "@/types/graphql";
import { CommentLikeButton } from "../element/button/CommentLikeButton";
import { IoIosArrowUp } from "react-icons/io";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, Reply, MoreVertical } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const QUERY = gql`
  query MyQuery($slug: String!, $number: Int!, $lastId: Int, $parentId: Int) {
    article(slug: $slug) {
      slug
      comments(number: $number, lastId: $lastId, parentId: $parentId) {
        content
        id
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
const fetchComments = async ({
  lastId,
  parentId,
  slug,
}: {
  lastId?: number;
  parentId?: number;
  slug: string;
}) => {
  // console.log(comments);

  try {
    const {
      data,
    }: {
      data: GraphQLData;
    } = await client.query({
      query: QUERY,
      variables: {
        slug: slug,
        number: 10,
        lastId: lastId,
        parentId: parentId,
      },
      fetchPolicy: "no-cache",
    });
    //   Append Comments
    // setComments([...comments, ...data.article.comments]);
    return data.article.comments;
  } catch (error) {
    console.error("Error fetching comments", error);
  }
};

export const Comments = ({
  initialComments,
  articleSlug,
  commentsCount,
  totalCommentsCount,
}: {
  initialComments: CommentType[];
  articleSlug: string;
  commentsCount: number;
  totalCommentsCount: number;
}) => {
  const [comments, setComments] = useState(initialComments);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [showScrollToTop, setShowScrollToTop] = useState(false);

  const loadMoreComments = async () => {
    try {
      setIsLoadingMore(true);
      const lastId =
        comments.length > 0 ? comments[comments.length - 1].id : undefined;
      const newComments = await fetchComments({
        lastId,
        slug: articleSlug,
      });
      if (newComments) {
        setComments([...comments, ...newComments]);
      }
    } finally {
      setIsLoadingMore(false);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollToTop(window.scrollY > 300);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
          {totalCommentsCount}{" "}
          {totalCommentsCount === 1 ? "Comment" : "Comments"}
        </h3>
        {showScrollToTop && (
          <button
            onClick={scrollToTop}
            className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 flex items-center"
          >
            <span>Back to top</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 ml-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 10l7-7m0 0l7 7m-7-7v18"
              />
            </svg>
          </button>
        )}
      </div>

      <div className="mb-8">
        <AddComment
          comments={comments}
          setComments={setComments}
          articleSlug={articleSlug}
        />
      </div>

      <div className="space-y-6">
        {comments.map((comment: CommentType) => (
          <Comment
            articleSlug={articleSlug}
            comment={comment}
            key={comment.id}
            onCommentDeleted={(deletedCommentId) => {
              setComments(comments.filter(c => c.id !== deletedCommentId));
            }}
          />
        ))}
      </div>

      {comments.length < commentsCount && (
        <div className="mt-8 text-center">
          <button
            onClick={loadMoreComments}
            disabled={isLoadingMore}
            className="px-6 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-full text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200 inline-flex items-center"
          >
            {isLoadingMore ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-700 dark:text-gray-300"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Loading...
              </>
            ) : (
              `Show ${Math.min(
                10,
                commentsCount - comments.length
              )} more comments`
            )}
          </button>
        </div>
      )}
    </div>
  );
};

const Comment = ({
  comment,
  articleSlug,
  onCommentDeleted,
}: {
  comment: CommentType;
  articleSlug: string;
  onCommentDeleted?: (commentId: number) => void;
}) => {
  const [replies, setReplies] = useState<CommentType[]>([]);
  const [showAddReply, setShowAddReply] = useState(false);
  const [isLoadingReplies, setIsLoadingReplies] = useState(false);
  const [showReplies, setShowReplies] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  // Check if the current user is the comment author
  const isOwnComment = user?.username === comment.user.username;

  const loadReplies = async () => {
    try {
      setIsLoadingReplies(true);
      const newComments = await fetchComments({
        slug: articleSlug,
        parentId: comment.id,
        lastId: replies.length > 0 ? replies[replies.length - 1].id : undefined,
      });
      if (newComments) {
        setReplies([...replies, ...newComments]);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load replies",
        variant: "destructive",
      });
    } finally {
      setIsLoadingReplies(false);
    }
  };

  const handleToggleReplies = async () => {
    if (!showReplies) {
      // Only load replies if we don't have any yet
      if (replies.length === 0) {
        await loadReplies();
      }
      setShowReplies(true);
    } else {
      setShowReplies(false);
    }
  };

  const DELETE_COMMENT = gql`
    mutation MyMutation($id: Int!) {
      deleteComment(id: $id)
    }
  `;

  const handleDeleteComment = async (event: React.MouseEvent) => {
    event.stopPropagation();
    try {
      await client.mutate({
        mutation: DELETE_COMMENT,
        variables: { id: comment.id },
      });
      toast({
        title: "Comment deleted",
        description: "Your comment has been successfully deleted.",
      });
      // Call the parent callback to remove the comment from state
      onCommentDeleted?.(comment.id);
    } catch (error) {
      console.error("Error deleting comment", error);
      toast({
        title: "Error",
        description: "Failed to delete comment. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="my-4 group" key={comment.id}>
      <div className="flex flex-col">
        <div className="flex items-start gap-3">
          <Avatar className="h-9 w-9">
            <AvatarImage src={comment.user.profilePicture} />
            <AvatarFallback>
              {comment.user.firstName.charAt(0)}
              {comment.user.lastName.charAt(0)}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-medium">
                  {comment.user.firstName} {comment.user.lastName}
                </span>
                <span className="text-xs text-muted-foreground">
                  {new Date(comment.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </span>
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {isOwnComment && (
                    <>
                      <DropdownMenuItem
                        onClick={(e) =>
                          handleDeleteComment(e)
                        }
                        className="text-destructive"
                      >
                        Delete
                      </DropdownMenuItem>
                    </>
                  )}
                  <DropdownMenuItem
                    onClick={() =>
                      toast({ title: "Report feature coming soon" })
                    }
                  >
                    Report
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <p className="text-sm leading-relaxed">{comment.content}</p>

            <div className="flex items-center gap-2 pt-1">
              <CommentLikeButton
                commentId={comment.id}
                initialLikes={comment.likesCount}
                initialState={comment.isLiked}
              />

              <Button
                variant="ghost"
                size="sm"
                className="h-8 gap-1 text-muted-foreground"
                onClick={() => setShowAddReply(!showAddReply)}
              >
                <Reply className="h-3.5 w-3.5" />
                <span>Reply</span>
              </Button>

              {comment.repliesCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 gap-1"
                  onClick={handleToggleReplies}
                >
                  {showReplies ? (
                    <>
                      <ChevronUp className="h-3.5 w-3.5" />
                      <span>Hide Replies</span>
                    </>
                  ) : (
                    <>
                      <ChevronDown className="h-3.5 w-3.5" />
                      <span>Replies ({comment.repliesCount})</span>
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
        </div>

        {showAddReply && (
          <div className="mt-3 ml-12">
            <AddComment
              focused={true}
              onCanceled={() => setShowAddReply(false)}
              comments={replies}
              setComments={(newReplies) => {
                setReplies(newReplies);
                // Show replies when a new reply is added
                if (newReplies.length > replies.length) {
                  setShowReplies(true);
                  setShowAddReply(false); // Close the add reply form
                  // Update the comment's replies count
                  comment.repliesCount = newReplies.length;
                }
              }}
              articleSlug={articleSlug}
              parentCommentId={comment.id}
            />
          </div>
        )}
      </div>

      {showReplies && (
        <div className="pl-8 border-l-2 border-border ml-3">
          {isLoadingReplies ? (
            <div className="space-y-3 mt-3">
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
            </div>
          ) : replies.length > 0 ? (
            replies.map((reply) => (
              <Comment
                articleSlug={articleSlug}
                comment={reply}
                key={reply.id}
                onCommentDeleted={(deletedCommentId) => {
                  const updatedReplies = replies.filter(r => r.id !== deletedCommentId);
                  setReplies(updatedReplies);
                  // Update the parent comment's replies count
                  comment.repliesCount = updatedReplies.length;
                }}
              />
            ))
          ) : (
            <div className="text-sm text-muted-foreground mt-3">
              No replies yet
            </div>
          )}
        </div>
      )}
    </div>
  );
};
