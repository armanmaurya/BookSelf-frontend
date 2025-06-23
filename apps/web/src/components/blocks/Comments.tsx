"use client";

import { CommentType } from "@/types/comment";
import { MouseEventHandler, useEffect, useState } from "react";
import { AddComment } from "./AddComment";
import client from "@/lib/apolloClient";
import { gql } from "@apollo/client";
import { GraphQLData } from "@/types/graphql";
import { CommentLikeButton } from "../element/button/CommentLikeButton";
import { IoIosArrowUp } from "react-icons/io";

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
    <div className="mx-auto px-4">
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
}: {
  comment: CommentType;
  articleSlug: string;
}) => {
  const [replies, setReplies] = useState<CommentType[]>([]);
  const [showAddReply, setShowAddReply] = useState(false);
  const [isLoadingReplies, setIsLoadingReplies] = useState(false);
  const [showReplies, setShowReplies] = useState(false); // default to hidden

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
    } finally {
      setIsLoadingReplies(false);
    }
  };

  const handleToggleReplies = async () => {
    if (!showReplies && replies.length === 0) {
      await loadReplies();
    }
    setShowReplies((v) => !v);
  };

  return (
    <div className="my-4 group" key={comment.id}>
      <div className="flex flex-col p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-150">
        <div className="flex items-start space-x-3">
          <div className="overflow-hidden rounded-full w-9 h-9 flex-shrink-0">
            <img
              src={`https://ui-avatars.com/api/?name=${comment.user.firstName}+${comment.user.lastName}&size=64&background=random`}
              alt={`${comment.user.firstName} ${comment.user.lastName}`}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="flex-1">
            <div className="flex items-center space-x-2">
              <span className="font-medium text-gray-900 dark:text-gray-100">
                {comment.user.firstName} {comment.user.lastName}
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {new Date(comment.createdAt).toLocaleDateString()}
              </span>
            </div>

            <p className="text-sm text-gray-800 dark:text-gray-200 mt-1 leading-relaxed">
              {comment.content}
            </p>

            <div className="flex items-center space-x-4 pt-2">
              <CommentLikeButton
                commentId={comment.id}
                initialLikes={comment.likesCount}
                initialState={comment.isLiked}
              />

              <button
                onClick={() => setShowAddReply(!showAddReply)}
                className="text-xs text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 hover:underline"
              >
                Reply
              </button>

              {comment.repliesCount > 0 && (
                <button
                  onClick={handleToggleReplies}
                  className="flex items-center space-x-1 text-xs text-blue-500 hover:text-blue-600 dark:hover:text-blue-400"
                >
                  {showReplies ? (
                    <>
                      <IoIosArrowUp className="rotate-180" />
                      <span>Hide Replies</span>
                    </>
                  ) : (
                    <>
                      <IoIosArrowUp />
                      <span>Show Replies ({comment.repliesCount})</span>
                    </>
                  )}
                </button>
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
              setComments={setReplies}
              articleSlug={articleSlug}
              parentCommentId={comment.id}
            />
          </div>
        )}
      </div>

      {showReplies && replies.length > 0 && (
        <div className="pl-8 border-l-2 border-gray-200 dark:border-gray-700 ml-3">
          {replies.map((reply) => (
            <Comment articleSlug={articleSlug} comment={reply} key={reply.id} />
          ))}
        </div>
      )}
    </div>
  );
};
