import React from "react";
import { Button } from "@/components/ui/button";
import { DeleteArticleButton } from "@/components/element/button/DeleteArticleButton";
import { gql } from "@apollo/client";
import { createServerClient } from "@/lib/ServerClient";
import { TogglePublishArticleButton } from "@/components/element/button/TogglePublishArticleButton";

const ArticleSettingPage = async ({
  params: { username, articleSlug },
}: {
  params: { username: string; articleSlug: string };
}) => {
  const ARTICLE_QUERY = gql`
    query GetArticleStatus($slug: String!) {
      article(slug: $slug) {
        status
      }
    }
  `;
  const { data } = await createServerClient().query({
    query: ARTICLE_QUERY,
    variables: { slug: articleSlug },
  });

  const status = data?.article?.status;
  const isPublished = status === "PU";

  return (
    <div className="space-y-6 max-w-3xl mx-auto px-4 sm:px-6 rounded-md shadow-sm bg-white dark:bg-neutral-800 p-4 border border-neutral-200 dark:border-neutral-700">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-neutral-100 mb-2">
        Article Settings
      </h1>
      <section className="border rounded-lg p-6 bg-neutral-50 dark:bg-neutral-700/30 mb-6 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-neutral-800 dark:text-neutral-100">
          Published Status
        </h2>
        <TogglePublishArticleButton isPublished={isPublished} slug={articleSlug} />
      </section>
      <section className="border border-destructive rounded-lg p-6 space-y-4 bg-neutral-50 dark:bg-neutral-700/30">
        <h2 className="text-lg font-semibold text-destructive">
          Delete Article
        </h2>
        <p className="text-sm text-muted-foreground dark:text-neutral-300">
          Once you delete this article, there is no going back. Please be
          certain.
        </p>
        <DeleteArticleButton articleSlug={articleSlug} />
      </section>
    </div>
  );
};

export default ArticleSettingPage;
