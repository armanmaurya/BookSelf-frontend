"use client";
import { Button } from "@/components/ui/button";
import client from "@/lib/apolloClient";
import { gql } from "@apollo/client";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

export const RemoveArticleFromCollectionBtn = ({
  children,
  collectionId,
  articleSlug,
}: {
  children: React.ReactNode;
  collectionId: number;
  articleSlug: string;
}) => {
  const ARTICLE_REMOVE_MUTATION = gql`
    mutation RemoveArticleFromCollection(
      $articleSlug: String!
      $collectionId: Int!
    ) {
      removeArticleFromCollection(
        articleSlug: $articleSlug
        collectionId: $collectionId
      )
    }
  `;

  const router = useRouter();
  const { toast } = useToast();
  const handleRemove = async () => {
    const { data } = await client.mutate({
      mutation: ARTICLE_REMOVE_MUTATION,
      variables: {
        articleSlug: articleSlug,
        collectionId: collectionId,
      },
    });
  };
  const handleClick = async () => {
    try {
      await handleRemove();
      toast({
        title: "Removed",
        description: "Article removed from collection.",
        variant: "default",
      });
      router.refresh();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to remove article from collection.",
        variant: "destructive",
      });
      console.error("Error removing article from collection:", error);
    }
  };
  return (
    <div className="w-full" onClick={handleClick}>
      {children}
    </div>
  );
};
