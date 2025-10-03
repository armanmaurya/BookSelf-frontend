import React from "react";
import { ReadingPanelsLayout } from "./ReadingPanelsLayout";
import { createServerClient } from "@/lib/ServerClient";
import { gql } from "@apollo/client";

const PAGE_QUERY = gql`
  query GetPages($notebookSlug: String!, $parentId: Int) {
    pages(notebookSlug: $notebookSlug, parentId: $parentId) {
      hasChildren
      id
      index
      path
      slug
      title
      children {
        id
        title
        slug
        path
        hasChildren
      }
    }
  }
`;

const NOTEBOOK_QUERY = gql`
  query GetNotebook($slug: String!) {
    notebook(slug: $slug) {
      id
      name
      slug
    }
  }
`;

interface PageItem {
  id: number;
  title: string;
  slug: string;
  path: string;
  hasChildren: boolean;
  children?: PageItem[];
}

const ReadLayout = async ({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { username: string; notebook: string };
}) => {
  const { username, notebook } = params;

  let initialPages: PageItem[] = [];
  let notebookName = "";

  try {
    const client = createServerClient();

    // Recursive function to fetch pages and their children (full tree)
    const fetchPagesWithChildren = async (
      parentId: number | null
    ): Promise<PageItem[]> => {
      const { data } = await client.query({
        query: PAGE_QUERY,
        variables: {
          notebookSlug: notebook,
          parentId: parentId,
        },
      });

      const pages = ((data?.pages ?? []) as any[]).map((page: any) => ({
        ...page,
        id: typeof page.id === "string" ? parseInt(page.id, 10) : page.id,
        hasChildren: page.hasChildren,
      })) as PageItem[];

      // Recursively fetch children for each page that has children
      const pagesWithChildren = await Promise.all(
        pages.map(async (page) => {
          if (page.hasChildren) {
            const children = await fetchPagesWithChildren(page.id);
            return { ...page, children };
          }
          return { ...page, children: [] };
        })
      );

      return pagesWithChildren;
    };

    // Fetch all pages starting from root (full tree)
    initialPages = await fetchPagesWithChildren(null);

    // Fetch notebook info
    const notebookResult = await client.query({
      query: NOTEBOOK_QUERY,
      variables: { slug: notebook },
    });

    notebookName = notebookResult.data?.notebook?.name || "";

  } catch (error) {
    console.error("Error fetching full page tree:", error);
  }

  return (
    <ReadingPanelsLayout
      username={username}
      notebook={notebook}
      initialPages={initialPages}
      notebookName={notebookName}
    >
      {children}
    </ReadingPanelsLayout>
  );
};

export default ReadLayout;