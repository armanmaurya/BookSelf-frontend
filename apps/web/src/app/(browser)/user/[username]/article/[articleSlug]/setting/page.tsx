"use client";
import React, { useState } from "react";
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
import { Input } from "@/components/ui/input";

const ArticleSettingPage = ({
  params: { username, articleSlug },
}: {
  params: { username: string; articleSlug: string };
}) => {
  const [confirmationText, setConfirmationText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      console.log("Deleting article:", articleSlug);
      // Typically you would call an API here
      // await deleteArticle(articleSlug);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
    } finally {
      setIsDeleting(false);
    }
  };

  const isConfirmed = confirmationText === "CONFIRM";

  return (
    <div className="space-y-6 max-w-xl mx-auto px-4 sm:px-6 rounded-md shadow-sm bg-white dark:bg-neutral-800 p-4 border border-neutral-200 dark:border-neutral-700">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-neutral-100 mb-2">
        Article Settings
      </h1>
      <section className="border border-destructive rounded-lg p-6 space-y-4 bg-neutral-50 dark:bg-neutral-700/30">
        <h2 className="text-lg font-semibold text-destructive">
          Delete Article
        </h2>
        <p className="text-sm text-muted-foreground dark:text-neutral-300">
          Once you delete this article, there is no going back. Please be
          certain.
        </p>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive">Delete Article</Button>
          </AlertDialogTrigger>
          <AlertDialogContent className="bg-white dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-neutral-900 dark:text-neutral-100">
                Are you absolutely sure?
              </AlertDialogTitle>
              <AlertDialogDescription className="text-neutral-600 dark:text-neutral-300">
                This action cannot be undone. This will permanently delete the "
                {articleSlug}" article and remove all associated data.
              </AlertDialogDescription>
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
      </section>
    </div>
  );
};

export default ArticleSettingPage;