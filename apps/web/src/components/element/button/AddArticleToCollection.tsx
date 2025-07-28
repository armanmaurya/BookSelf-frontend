"use client";
import { useAuth } from "@/context/AuthContext";
import client from "@/lib/apolloClient";
import { CollectionType } from "@/types/Collection";
import { gql } from "@apollo/client";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AddArticleToCollectionProps {
  articleSlug: string;
  collection: CollectionType;
  onToggle?: (status: boolean) => void;
}

const ADD_ARTICLE_TO_COLLECTION = gql`
  mutation ToggleAddArticleToCollection(
    $articleSlug: String!
    $collectionId: Int!
  ) {
    toggleAddArticleToCollection(
      articleSlug: $articleSlug
      collectionId: $collectionId
    )
  }
`;

export const AddArticleToCollection = ({
  articleSlug,
  collection,
  onToggle,
}: AddArticleToCollectionProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isChecked, setIsChecked] = useState(collection.isAdded);

  const handleCheckboxChange = async () => {
    const newCheckedState = !isChecked;
    setIsChecked(newCheckedState);
    setIsLoading(true);
    
    try {
      const { data } = await client.mutate({
        mutation: ADD_ARTICLE_TO_COLLECTION,
        variables: {
          articleSlug: articleSlug,
          collectionId: collection.id,
        },
      });

      if (data?.toggleAddArticleToCollection !== undefined) {
        const actualStatus = data.toggleAddArticleToCollection;
        setIsChecked(actualStatus);
        onToggle?.(actualStatus);
        
        // Show success toast
        toast({
          title: actualStatus ? "Article added" : "Article removed",
          description: actualStatus 
            ? `Added to "${collection.name}" collection`
            : `Removed from "${collection.name}" collection`,
        });
      }
    } catch (error) {
      console.error("Error updating article in collection:", error);
      setIsChecked(!newCheckedState);
      
      // Show error toast
      toast({
        title: "Error",
        description: "Failed to update article in collection. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center space-x-3 py-2 px-3 hover:bg-accent rounded-md transition-colors">
      {isLoading ? (
        <Loader2 className="h-5 w-5 animate-spin" />
      ) : (
        <Checkbox
          id={`collection-${collection.id}`}
          checked={isChecked}
          onCheckedChange={handleCheckboxChange}
          disabled={isLoading}
          className="h-5 w-5 rounded-sm"
        />
      )}
      <Label htmlFor={`collection-${collection.id}`} className="cursor-pointer flex items-center">
        {collection.name}
        {collection.isPublic && (
          <span className="ml-2 text-xs text-muted-foreground">(Public)</span>
        )}
      </Label>
    </div>
  );
};