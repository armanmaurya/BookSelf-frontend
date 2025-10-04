import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  FileText,
  Plus,
  BookOpen,
  Edit3,
} from "lucide-react";
import { createServerClient } from "@/lib/ServerClient";
import { gql } from "@apollo/client";
import { NotebookEditor } from "./NotebookEditor";

const EditPage = async ({
  params,
}: {
  params: Promise<{ username: string; notebook: string; path: string[] }>;
}) => {
  const { username, notebook: notebookSlug, path } = await params;

  // Check if notebook has pages
  const QUERY_NOTEBOOK = gql`
    query GetNotebook($slug: String!) {
      notebook(slug: $slug) {
        id
        name
        hasPages
        pagesCount
      }
    }
  `;

  let notebookData = null;

  try {
    const result = await createServerClient().query({
      query: QUERY_NOTEBOOK,
      variables: { slug: notebookSlug },
    });
    notebookData = result.data?.notebook;
  } catch (error) {
    console.error("Error fetching notebook data:", error);
  }

  // If notebook has no pages, show empty state
  if (!notebookData?.hasPages) {
    return (
      <div className="h-full flex items-center justify-center p-8">
        <Card className="w-full max-w-lg">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <BookOpen className="h-8 w-8 text-primary" />
            </div>
            <h2 className="text-xl font-semibold mb-2">
              Start Your First Page
            </h2>
            <p className="text-muted-foreground mb-6">
              This notebook is empty. Create your first page to begin writing
              your content.
            </p>
            <div className="space-y-3">
              <Button className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Create First Page
              </Button>
              <Button variant="outline" className="w-full">
                <FileText className="h-4 w-4 mr-2" />
                Import from Template
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // If we have a path, fetch and show the editor for that specific page
  if (path && path.length > 0) {
    const PAGE_QUERY = gql`
      query GetPage($notebookSlug: String!, $pagePath: String!) {
        page(notebookSlug: $notebookSlug, pagePath: $pagePath) {
          id
          title
          content
          path
          slug
        }
      }
    `;

    let pageData = null;

    try {
      const result = await createServerClient().query({
        query: PAGE_QUERY,
        variables: { 
          notebookSlug, 
          pagePath: path.join("/") 
        },
      });
      pageData = result.data?.page;
    } catch (error) {
      console.error("Error fetching page data:", error);
    }

    if (!pageData) {
      return (
        <div className="h-full flex items-center justify-center p-8">
          <Card className="w-full max-w-lg">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="h-8 w-8 text-destructive" />
              </div>
              <h2 className="text-xl font-semibold mb-2">Page Not Found</h2>
              <p className="text-muted-foreground mb-6">
                The page you&apos;re looking for doesn&apos;t exist or you don&apos;t have access to it.
              </p>
            </CardContent>
          </Card>
        </div>
      );
    }

    return (
      <NotebookEditor
        content={pageData.content || ""}
        title={pageData.title}
        notebookSlug={notebookSlug}
        pagePath={path.join("/")}
      />
    );
  }

  // Default state - no specific page selected
  return (
    <div className="h-full flex items-center justify-center p-8">
      <Card className="w-full max-w-lg">
        <CardContent className="p-8 text-center">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Edit3 className="h-8 w-8 text-primary" />
          </div>
          <h2 className="text-xl font-semibold mb-2">Select a Page to Edit</h2>
          <p className="text-muted-foreground mb-6">
            Choose a page from the navigation panel to start editing, or create
            a new page.
          </p>
          <Button className="w-full">
            <Plus className="h-4 w-4 mr-2" />
            Create New Page
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default EditPage;
