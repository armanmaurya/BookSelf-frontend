"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { gql } from "@apollo/client";
import client from "@/lib/apolloClient";
import { useRouter } from "next/navigation";

interface TogglePublishButtonProps {
  isPublished: boolean;
  slug: string; // Assuming slug is passed as a prop
}

export const TogglePublishArticleButton = ({
  isPublished,
  slug, // Assuming slug is passed as a prop
}: TogglePublishButtonProps) => {
  const action = isPublished ? "unpublish" : "publish";
  const actionCapitalized = action.charAt(0).toUpperCase() + action.slice(1);

  const router = useRouter();

  const TOGGLE_PUBLISH_MUTATION = gql`
    mutation TogglePublishArticle($slug: String!) {
      togglePublishArticle(slug: $slug) {
        status
      }
    }
  `;

  const onTogglePublish = async () => {
    try {
      const { data } = await client.mutate({
        mutation: TOGGLE_PUBLISH_MUTATION,
        variables: { slug: slug }, // Replace with actual article slug
      });
      if (!data.togglePublishArticle) {
        throw new Error("Failed to toggle publish status");
      }
      router.refresh(); // Refresh the page to reflect changes
    } catch (error) {
      console.error("Error toggling publish status:", error);
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant={isPublished ? "default" : "destructive"}
          className={`w-full sm:w-auto px-4 sm:px-6 py-2 text-base font-medium rounded-md transition-colors flex justify-center items-center ${
            isPublished
              ? "bg-green-600 text-white hover:bg-green-700"
              : "bg-red-600 text-white hover:bg-red-700"
          }`}
        >
          {isPublished ? "Published" : "Unpublished"}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="max-w-xs sm:max-w-md w-full">
        <AlertDialogHeader>
          <AlertDialogTitle>
            Confirm {actionCapitalized} Article
          </AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to {action} this article?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={onTogglePublish}
            className={
              (!isPublished
                ? "bg-green-600 hover:bg-green-700"
                : "bg-red-600 hover:bg-red-700") +
              " w-full sm:w-auto"
            }
          >
            {actionCapitalized} Article
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
