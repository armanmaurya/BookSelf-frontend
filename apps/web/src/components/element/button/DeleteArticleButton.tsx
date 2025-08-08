"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { gql } from "@apollo/client";
import client from "@/lib/apolloClient";
import { useRouter } from "next/navigation";
import nProgress from "nprogress";

export const DeleteArticleButton = ({ articleSlug }: { articleSlug: string }) => {
  const [confirmationText, setConfirmationText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const DELETE_MUTATION = gql`
    mutation MyMutation($slug: String!) {
      deleteArticle(slug: $slug)
    }
  `;

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const { data } = await client.mutate({
        mutation: DELETE_MUTATION,
        variables: { slug: articleSlug },
      });
      if (!data.deleteArticle) {
        throw new Error("Failed to delete article");
      }
      nProgress.start();
      router.replace(`/`);
      await new Promise((resolve) => setTimeout(resolve, 1000));
    } finally {
      setIsDeleting(false);
    }
  };

  const isConfirmed = confirmationText === "CONFIRM";

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive">Delete Article</Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="bg-white dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-neutral-900 dark:text-neutral-100">
            Are you absolutely sure?
          </AlertDialogTitle>
        </AlertDialogHeader>
        <div className="my-4 space-y-2">
          <p className="text-sm text-neutral-600 dark:text-neutral-300">
            To confirm, type <span className="font-bold">CONFIRM</span> in the box below:
          </p>
          <Input
            value={confirmationText}
            onChange={(e) => setConfirmationText(e.target.value)}
            placeholder="Type CONFIRM"
            className="mt-2"
          />
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel
            onClick={() => setConfirmationText("")}
            className="border-neutral-200 dark:border-neutral-700"
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={!isConfirmed || isDeleting}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isDeleting ? "Deleting..." : "Delete Article"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
