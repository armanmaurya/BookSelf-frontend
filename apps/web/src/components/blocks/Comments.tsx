"use client";

import { CommentType } from "@/types/comment";
import { MouseEventHandler, useState } from "react";
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

  return (
    <div>
      <h3 className="text-2xl font-bold my-2">
        <span>{totalCommentsCount}</span> Comments
      </h3>
      <AddComment
        comments={comments}
        setComments={setComments}
        articleSlug={articleSlug}
      />
      <div>
        {comments.map((comment: CommentType) => {
          return (
            <Comment
              articleSlug={articleSlug}
              comment={comment}
              key={comment.id}
            />
          );
        })}
      </div>
      {comments.length < commentsCount && (
        <button
          className="border rounded-full my-5 p-2 text-sm"
          onClick={async () => {
            const lastId =
              comments.length > 0
                ? comments[comments.length - 1].id
                : undefined;
            const newComments = await fetchComments({
              lastId: lastId,
              slug: articleSlug,
            });
            if (newComments) {
              setComments([...comments, ...newComments]);
            }
          }}
        >
          Show More
        </button>
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
  // console.log(comment.repliesCount);
  const [replies, setReplies] = useState<CommentType[]>([]);
  const [showAddReply, setShowAddReply] = useState(false);
  return (
    <div className="my-4" key={comment.id}>
      <div className="flex flex-col">
        <div className="flex items-center space-x-2">
          <div className="overflow-hidden rounded-full w-8 h-8">
            <img
              src={`https://ui-avatars.com/api/?name=${comment.user.firstName}+${comment.user.lastName}&size=64`}
              alt="avatar"
            />
          </div>
          <div className="text-base">
            {comment.user.firstName} {comment.user.lastName}
          </div>
        </div>
        <p
          className="text-sm px-1 pt-1.5"
          style={{ fontFamily: "sohne, Helvetica Neue, Helvetica" }}
        >
          {comment.content}
        </p>
        <div className="flex items-center space-x-2 pt-1.5">
          <CommentLikeButton
            commentId={comment.id}
            initialLikes={comment.likesCount}
            initialState={comment.isLiked}
          />
          <span
            className="text-xs cursor-pointer hover:underline"
            onClick={() => setShowAddReply(!showAddReply)}
          >
            Reply
          </span>
          {comment.repliesCount > 0 &&
            replies.length < comment.repliesCount && (
              <button
                className=""
                onClick={async () => {
                  if (replies.length === 0) {
                    const newComments = await fetchComments({
                      slug: articleSlug,
                      parentId: comment.id,
                    });
                    if (newComments) {
                      setReplies([...replies, ...newComments]);
                    }
                  } else {
                    const lastId = replies[replies.length - 1].id;
                    const newComments = await fetchComments({
                      lastId: lastId,
                      slug: articleSlug,
                      parentId: comment.id,
                    });
                    if (newComments) {
                      setReplies([...replies, ...newComments]);
                    }
                  }
                }}
              >
                <div className="flex space-x-1 items-center text-blue-400">
                  <IoIosArrowUp className="rotate-180 -z-10" />
                  <span className="text-xs">
                    <span>{comment.repliesCount}</span> <span>Replies</span>
                  </span>
                </div>
              </button>
            )}
        </div>
      </div>
      <div className="ml-5">
        {showAddReply && (
          <AddComment
            focused={true}
            onCanceled={() => setShowAddReply(false)}
            comments={replies}
            setComments={setReplies}
            articleSlug={articleSlug}
            parentCommentId={comment.id}
          />
        )}
      </div>

      {/* If Stored Replies Lenght if Greater than Zero The Render the Replies*/}
      {replies.length > 0 && (
        <div className="pl-5" style={{ borderLeft: "1px solid #ccc" }}>
          {replies.map((reply: CommentType) => {
            return (
              <Comment
                articleSlug={articleSlug}
                comment={reply}
                key={reply.id}
              />
            );
          })}
        </div>
      )}

      {/* If Commment Replies Count is Greater than zero and Current Replies Lenght is Less than Comment replies count then Show the Reply Button */}
      {/* <div
        style={{ height: 1 }}
        className="w-full bg-gray-200 bg-opacity-30 my-2"
      /> */}
    </div>
  );
};
