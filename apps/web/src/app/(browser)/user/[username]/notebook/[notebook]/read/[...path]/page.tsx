import React from "react";
import { createServerClient } from "@/lib/ServerClient";
import { gql } from "@apollo/client";
import { GraphQLData } from "@/types/graphql";
import { redirect } from "next/navigation";
import { Metadata } from "next";
import { RenderContent } from "@bookself/slate-editor";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { 
  BookOpen, 
  Edit3, 
  Share2, 
  Calendar, 
  User, 
  Eye,
  FileText,
  Clock,
} from "lucide-react";
import Link from "next/link";
import { SyntaxHighlight } from "@/components/SyntaxHighlight";
import { ArticleBodyWithMath } from "@/components/ArticleBodyWithMath";
// Import highlight.js CSS for syntax highlighting
import "highlight.js/styles/github-dark.css";

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

const NOTEBOOK_QUERY = gql`
  query GetNotebook($slug: String!) {
    notebook(slug: $slug) {
      cover
      createdAt
      hasPages
      id
      name
      overview
      pagesCount
      slug
      user {
        firstName
        lastName
        profilePicture
        email
        username
      }
      indexPage {
        slug
      }
    }
  }
`;

interface PageProps {
  params: Promise<{ 
    username: string; 
    notebook: string; 
    path: string[] 
  }>;
}

const NotebookPageReader = async ({ params }: PageProps) => {
  const { username, notebook: notebookSlug, path } = await params;
  
  // If no path provided, redirect to notebook overview
  if (!path || path.length === 0) {
    redirect(`/user/${username}/notebook/${notebookSlug}`);
  }

  const pagePath = path.join("/");

  let pageData = null;
  let notebookData = null;

  try {
    // Fetch page data
    const pageResult = await createServerClient().query({
      query: PAGE_QUERY,
      variables: { 
        notebookSlug, 
        pagePath 
      },
    });
    pageData = pageResult.data?.page;

    // Fetch notebook data for context
    const notebookResult = await createServerClient().query({
      query: NOTEBOOK_QUERY,
      variables: { slug: notebookSlug },
    });
    notebookData = notebookResult.data?.notebook;

  } catch (error) {
    console.error("Error fetching page data:", error);
    return redirect("/not-found");
  }

  if (!pageData || !notebookData) {
    return redirect("/not-found");
  }

  const isOwner = notebookData.user.username === username;

  return (
    <>
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: pageData.title,
            description: pageData.content
              ?.replace(/<[^>]*>/g, "")
              ?.substring(0, 160) || "Read this page from a notebook on Infobite.",
            url: `https://infobite.online/user/${username}/notebook/${notebookSlug}/read/${pagePath}`,
            author: {
              "@type": "Person",
              name: `${notebookData.user.firstName} ${notebookData.user.lastName}`,
              url: `https://infobite.online/user/${notebookData.user.username}`,
              image: notebookData.user.profilePicture,
            },
            publisher: {
              "@type": "Organization",
              name: "Infobite",
              url: "https://infobite.online",
            },
            isPartOf: {
              "@type": "Book",
              name: notebookData.name,
              url: `https://infobite.online/user/${username}/notebook/${notebookSlug}`,
            },
          }),
        }}
      />

      <article className="min-h-screen p-6" itemScope itemType="https://schema.org/Article">
        {/* Page Header */}
        <header className="border-none mb-8">
          {/* Breadcrumb */}
          <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-4">
            <Link 
              href={`/user/${username}/notebook/${notebookSlug}`}
              className="hover:text-foreground transition-colors"
            >
              {notebookData.name}
            </Link>
            <span>/</span>
            <span className="text-foreground font-medium">{pageData.title}</span>
          </nav>

          <div className="flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <h1 className="text-3xl font-bold" itemProp="headline">
                {pageData.title}
              </h1>
              
              {isOwner && (
                <div className="flex items-center gap-2">
                  <Link href={`/user/${username}/notebook/${notebookSlug}/edit/${pagePath}`}>
                    <Button variant="outline" size="sm" className="gap-2">
                      <Edit3 className="h-4 w-4" />
                      Edit Page
                    </Button>
                  </Link>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Share2 className="h-4 w-4" />
                    Share
                  </Button>
                </div>
              )}
            </div>

            {/* Meta Information */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              
              {notebookData.createdAt && (
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <time dateTime={notebookData.createdAt}>
                    Created {new Date(notebookData.createdAt).toLocaleDateString()}
                  </time>
                </div>
              )}
            </div>
          </div>
        </header>

        <Separator className="mb-8" />

        {/* Page Content */}
        <main
          className="prose prose-strong:text-inherit dark:prose-invert max-w-none
            [&_pre]:bg-muted [&_pre]:border [&_pre]:rounded-md [&_pre]:p-4 [&_pre]:overflow-x-auto
            [&_pre_code]:bg-transparent [&_pre_code]:p-0 [&_pre_code]:text-sm [&_pre_code]:font-mono
            [&_.math-inline]:bg-muted/50 [&_.math-inline]:px-1 [&_.math-inline]:rounded
            [&_.math-display]:bg-muted/30 [&_.math-display]:p-3 [&_.math-display]:rounded-md [&_.math-display]:my-4 [&_.math-display]:text-center"
          role="main"
          itemProp="articleBody"
        >
          <SyntaxHighlight>
            {pageData.content ? (
              <div
                className="tiptap"
                dangerouslySetInnerHTML={{ __html: pageData.content }}
              />
            ) : (
              <div className="text-center py-12">
                <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-muted-foreground mb-2">
                  This page is empty
                </h3>
                <p className="text-muted-foreground mb-4">
                  No content has been added to this page yet.
                </p>
                {isOwner && (
                  <Link href={`/user/${username}/notebook/${notebookSlug}/edit/${pagePath}`}>
                    <Button className="gap-2">
                      <Edit3 className="h-4 w-4" />
                      Start Writing
                    </Button>
                  </Link>
                )}
              </div>
            )}
            <ArticleBodyWithMath />
          </SyntaxHighlight>
        </main>

        <Separator className="my-8" />

        {/* Notebook Information Footer */}
        <footer className="mt-12">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                {notebookData.cover && (
                  <div className="relative w-16 h-20 rounded-md overflow-hidden flex-shrink-0">
                    <img
                      src={notebookData.cover}
                      alt={notebookData.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-2">
                    Part of: {notebookData.name}
                  </h3>
                  {notebookData.overview && (
                    <p className="text-muted-foreground mb-3">
                      {notebookData.overview}
                    </p>
                  )}
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>{notebookData.pagesCount} pages</span>
                    <span>•</span>
                    <span>
                      Created {new Date(notebookData.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="mt-4">
                    <Link href={`/user/${username}/notebook/${notebookSlug}`}>
                      <Button variant="outline" size="sm">
                        View Full Notebook
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </footer>
      </article>
    </>
  );
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { username, notebook: notebookSlug, path } = await params;
  
  if (!path || path.length === 0) {
    return {
      title: "Notebook - Infobite",
      description: "Read notebooks and organize content on Infobite.",
    };
  }

  const pagePath = path.join("/");

  try {
    const { data }: { data: GraphQLData } = await createServerClient().query({
      query: PAGE_QUERY,
      variables: { 
        notebookSlug, 
        pagePath 
      },
    });

    const page = data?.page;
    if (!page) {
      return {
        title: "Page Not Found - Infobite",
        description: "The requested notebook page could not be found.",
      };
    }

    // Also fetch notebook data for metadata
    const notebookResult = await createServerClient().query({
      query: NOTEBOOK_QUERY,
      variables: { slug: notebookSlug },
    });
    const notebook = notebookResult.data?.notebook;

    const description = page.content
      ?.replace(/<[^>]*>/g, "")
      ?.replace(/\s+/g, " ")
      ?.trim()
      ?.substring(0, 160) || `Read "${page.title}" from a notebook on Infobite.`;

    const authorName = notebook ? `${notebook.user.firstName} ${notebook.user.lastName}` : "Infobite Author";
    const canonicalUrl = `https://infobite.online/user/${username}/notebook/${notebookSlug}/read/${pagePath}`;

    return {
      title: `${page.title} - ${notebook?.name || 'Notebook'} - Infobite`,
      description,
      keywords: [
        page.title.toLowerCase(),
        notebook?.name.toLowerCase() || "notebook",
        authorName.toLowerCase(),
        "infobite",
        "notebook",
        "knowledge sharing",
      ],
      authors: [
        {
          name: authorName,
          url: `https://infobite.online/user/${notebook?.user.username || username}`,
        },
      ],
      creator: authorName,
      publisher: "Infobite",
      metadataBase: new URL("https://infobite.online"),
      alternates: {
        canonical: canonicalUrl,
      },
      openGraph: {
        title: `${page.title} - ${notebook?.name || 'Notebook'}`,
        description,
        url: canonicalUrl,
        siteName: "Infobite",
        locale: "en_IN",
        type: "article",
        authors: [authorName],
        section: "Notebook",
        tags: ["notebook", "knowledge", "infobite"],
        images: notebook?.cover
          ? [
              {
                url: notebook.cover,
                width: 1200,
                height: 630,
                alt: `${notebook.name} by ${authorName}`,
              },
            ]
          : undefined,
      },
      twitter: {
        card: "summary_large_image",
        title: `${page.title} - ${notebook?.name || 'Notebook'}`,
        description,
        creator: `@${notebook?.user.username || username}`,
        site: "@infobite",
        images: notebook?.cover ? [notebook.cover] : undefined,
      },
      robots: {
        index: true,
        follow: true,
        googleBot: {
          index: true,
          follow: true,
          "max-video-preview": -1,
          "max-image-preview": "large",
          "max-snippet": -1,
        },
      },
    };
  } catch (error) {
    console.error("Error generating metadata:", error);
    return {
      title: "Notebook Page - Infobite",
      description: "Discover amazing notebooks and insights on Infobite.",
    };
  }
}

export default NotebookPageReader;
