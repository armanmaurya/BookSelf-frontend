"use client";
import { useAuth } from "@/context/AuthContext";
import client from "@/lib/apolloClient";
import { CollectionType } from "@/types/Collection";
import { gql } from "@apollo/client";
import { useState } from "react";
export const AddArticleToCollection = ({
  articleSlug,
  collection,
  onToggle,
}: {
  articleSlug: string;
  collection: CollectionType;
  onToggle?: (status: boolean) => void;
}) => {
  const { user } = useAuth();
  // const [isAdded, setIsAdded] = useState(collection.isAdded);
  console.log("articleSlug", articleSlug);
  const ADD_ARTICLE_TO_COLLECTION = gql`
    mutation MyMutation($articleSlug: String!, $collectionId: Int!) {
      toggleAddArticleToCollection(
        articleSlug: $articleSlug
        collectionId: $collectionId
      )
    }
  `;

  const handleToggleAddArticleToCollection = async () => {
    const { data } = await client.mutate({
      mutation: ADD_ARTICLE_TO_COLLECTION,
      variables: {
        articleSlug: articleSlug,
        collectionId: collection.id,
      },
    });
    if (data) {
      onToggle && onToggle(data.toggleAddArticleToCollection);
    }
  };
  return (
    <div className="flex items-center space-x-2">
      <input
        className="h-5 w-5"
        type="checkbox"
        checked={collection.isAdded}
        onChange={handleToggleAddArticleToCollection}
      />
      <span>{collection.name}</span>
    </div>
  );
};
