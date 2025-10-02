import React from "react";
import { PanelsLayout } from "./PanelsLayout";
import { createServerClient } from "@/lib/ServerClient";
import { gql } from "@apollo/client";
import { PageResponse } from "@bookself/types";

const PAGE_QUERY = gql`
  query MyQuery($notebookSlug: String!, $parentId: Int) {
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

const EditLayout = async ({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ username: string; notebook: string }>;
}) => {
  const { username, notebook } = await params;
  console.log("EditLayout params:", { username, notebook });

  let initialPages: PageResponse[] = [];

  try {
    const client = createServerClient();

    // Recursive function to fetch pages and their children
    const fetchPagesWithChildren = async (
      parentId: number | null
    ): Promise<PageResponse[]> => {
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
        has_children: page.hasChildren,
      })) as PageResponse[];

      // Recursively fetch children for each page that has children
      const pagesWithChildren = await Promise.all(
        pages.map(async (page) => {
          if (page.has_children) {
            const children = await fetchPagesWithChildren(page.id);
            return { ...page, children };
          }
          return { ...page, children: [] };
        })
      );

      return pagesWithChildren;
    };

    // Fetch all pages starting from root
    initialPages = await fetchPagesWithChildren(null);

    console.log("Loaded page hierarchy:", JSON.stringify(initialPages, null, 2));
  } catch (error) {
    console.error("Failed to load page hierarchy:", error);
  }

  // Pass the full hierarchy to PanelsLayout
  console.log("Initial Pages with Children:", initialPages);
  return (
    <div className="h-[calc(100vh-3.5rem)]">
      <PanelsLayout
        username={username}
        notebook={notebook}
        initialPages={initialPages}
      >
        {children}
      </PanelsLayout>
    </div>
  );
};

export default EditLayout;
