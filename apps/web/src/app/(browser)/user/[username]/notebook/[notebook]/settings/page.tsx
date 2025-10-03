import React from "react";
import { createServerClient } from "@/lib/ServerClient";
import { gql } from "@apollo/client";
import { redirect } from "next/navigation";
import NotebookSettingsForm from "@/components/NotebookSettingsForm";
import { GraphQLData } from "@/types/graphql";

const NotebookSettingsPage = async ({
  params,
}: {
  params: { username: string; notebook: string };
}) => {
  const { notebook, username } = await params;
  
  const QUERY_NOTEBOOK = gql`
    query GetNotebook($slug: String!) {
      notebook(slug: $slug) {
        id
        name
        slug
        overview
        cover
        createdAt
        pagesCount
        user {
          firstName
          lastName
          username
          isSelf
        }
      }
    }
  `;

  let data: GraphQLData | null = null;

  try {
    const result = await createServerClient().query({
      query: QUERY_NOTEBOOK,
      variables: { slug: notebook },
    });
    data = result.data;
  } catch (error) {
    console.error("Error fetching notebook data:", error);
    return redirect("/not-found");
  }

  const notebookData = data?.notebook;

  if (!notebookData) {
    return redirect("/not-found");
  }

  // Check if user has access to settings (is owner)
  if (!notebookData.user.isSelf) {
    return redirect(`/user/${username}/notebook/${notebook}`);
  }

  return (
    <NotebookSettingsForm
      notebookData={notebookData}
      username={username}
      notebookSlug={notebook}
    />
  );
};

export default NotebookSettingsPage;