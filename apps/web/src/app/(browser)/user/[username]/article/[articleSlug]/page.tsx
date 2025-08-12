import { API_ENDPOINT } from "@/app/utils";
import { Comments } from "@/components/blocks/Comments";
import { FollowButton } from "@/components/element/button/FollowButton";
import { ArticleMetaActions } from "@/components/element/ArticleMetaActions";
import { createServerClient } from "@/lib/ServerClient";
import { GraphQLData } from "@/types/graphql";
import { gql } from "@apollo/client";
import { RenderContent } from "@bookself/slate-editor";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Metadata } from "next";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import Image from "next/image";
import { TableOfContents } from "@/components/blocks/TableOfContents";
import { SyntaxHighlight } from "@/components/SyntaxHighlight";
// Import highlight.js CSS for syntax highlighting in article content
import "highlight.js/styles/github-dark.css";
import dynamic from "next/dynamic";
import { ArticleBodyWithMath } from "@/components/ArticleBodyWithMath";
import { ArticleProvider } from "@/context/article-context";
import { RelatedArticles } from "@/components/blocks/RelatedArticles";
import { AuthorInformation } from "@/components/blocks/AuthorInformation";

const QUERY = gql`
  query MyQuery($slug: String!) {
    article(slug: $slug) {
      content
      createdAt
      id
      isLiked
      likesCount
      slug
      title
      views
      savesCount
      thumbnail
      author {
        firstName
        lastName
        isFollowing
        isSelf
        followingCount
        followersCount
        username
        profilePicture
      }
      comments(number: 10) {
        content
        id
        createdAt
        isLiked
        likesCount
        isPinned
        repliesCount
        user {
          firstName
          lastName
          username
        }
      }
      commentsCount
      totalCommentsCount
      relatedArticles {
        id
        slug
        title
        author {
          username
          firstName
          lastName
          profilePicture
        }
      }
    }
  }
`;

const Page = async ({
  params,
}: {
  params: Promise<{ username: string; articleSlug: string }>;
}) => {
  // Extract username and articleSlug from params
  const { username, articleSlug } = await params;

  let data: GraphQLData | null = null;
  try {
    const result = await createServerClient().query({
      query: QUERY,
      variables: { slug: articleSlug },
    });
    data = result.data;
  } catch (error) {
    return redirect("/not-found");
  }

  const article = data?.article;

  // Check if article exists
  if (!article) {
    return redirect("/not-found");
  }

  // Check if article slug matches URL slug
  if (article.slug != articleSlug) {
    redirect(`${article.slug}`);
  }

  return (
    <>
      <ArticleProvider initialArticle={article}>
        {/* JSON-LD Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Article",
              headline: article.title,
              description: article.content
                .replace(/<[^>]*>/g, "")
                .substring(0, 160),
              url: `https://infobite.online/user/${username}/article/${articleSlug}`,
              datePublished: article.createdAt,
              dateModified: article.createdAt,
              ...(article.thumbnail && { image: article.thumbnail }),
              author: {
                "@type": "Person",
                name: `${article.author.firstName} ${article.author.lastName}`,
                url: `https://infobite.online/user/${article.author.username}`,
                image: article.author.profilePicture,
              },
              publisher: {
                "@type": "Organization",
                name: "Infobite",
                url: "https://infobite.online",
                logo: "https://infobite.online/logo.png",
              },
              mainEntityOfPage: {
                "@type": "WebPage",
                "@id": `https://infobite.online/user/${username}/article/${articleSlug}`,
              },
              interactionStatistic: [
                {
                  "@type": "InteractionCounter",
                  interactionType: "https://schema.org/LikeAction",
                  userInteractionCount: article.likesCount,
                },
                {
                  "@type": "InteractionCounter",
                  interactionType: "https://schema.org/ViewAction",
                  userInteractionCount: article.views,
                },
                {
                  "@type": "InteractionCounter",
                  interactionType: "https://schema.org/CommentAction",
                  userInteractionCount: article.totalCommentsCount,
                },
              ],
            }),
          }}
        />
        <div className="flex flex-col xl:flex-row max-w-[1500px] mx-auto px-3 lg:px-6 pt-6 gap-8">
          {/* Table of Contents Sidebar - Left */}
          <aside
            className="hidden xl:block flex-shrink-0"
            aria-labelledby="toc-sidebar"
          >
            <div className="sticky top-20">
              <TableOfContents />
            </div>
          </aside>
          {/* Main Content */}
          <article
            className="flex-1 min-w-0 xl:pl-8"
            itemScope
            itemType="https://schema.org/Article"
          >
            {/* Article Header */}
            <header className="border-none">
              <h1 className="text-3xl font-bold mb-2" itemProp="headline">
                {article.title}
              </h1>
              {/* Article Meta Information */}
              <ArticleMetaActions />
            </header>

            {/* Article Thumbnail */}
            {article.thumbnail && (
              <div className="my-6">
                <div className="relative w-full aspect-video rounded-lg overflow-hidden shadow-lg bg-muted">
                  <Image
                    src={article.thumbnail}
                    alt={`Thumbnail for ${article.title}`}
                    fill
                    className="object-cover transition-transform"
                    priority
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
                  />
                </div>
              </div>
            )}

            {/* Mobile Table of Contents */}
            <div className="xl:hidden mb-6">
              <TableOfContents />
            </div>

            {/* Main Article Content */}
            <main
              className="prose prose-strong:text-inherit dark:prose-invert max-w-none
            [&_pre]:bg-muted [&_pre]:border [&_pre]:rounded-md [&_pre]:p-4 [&_pre]:overflow-x-auto
            [&_pre_code]:bg-transparent [&_pre_code]:p-0 [&_pre_code]:text-sm [&_pre_code]:font-mono
            [&_.math-inline]:bg-muted/50 [&_.math-inline]:px-1 [&_.math-inline]:rounded
            [&_.math-display]:bg-muted/30 [&_.math-display]:p-3 [&_.math-display]:rounded-md [&_.math-display]:my-4 [&_.math-display]:text-center"
              role="main"
            >
              <SyntaxHighlight>
                <div
                  className="articleBody tiptap"
                  itemProp="articleBody"
                  dangerouslySetInnerHTML={{ __html: article.content }}
                />
                <ArticleBodyWithMath />
              </SyntaxHighlight>
            </main>

            <Separator className="my-8" />

            {/* Author Information */}
            <AuthorInformation />

            {/* Comments Section */}
            <section aria-labelledby="comments-section">
              <h2 id="comments-section" className="sr-only">
                Comments
              </h2>
              <Separator className="mb-4" />
              <Comments />
            </section>
          </article>

          {/* Related Articles Sidebar - Right */}
          <RelatedArticles />
        </div>
      </ArticleProvider>
    </>
  );
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ username: string; articleSlug: string }>;
}): Promise<Metadata> {
  const { articleSlug, username } = await params;

  try {
    const METADATA_QUERY = gql`
      query MetadataQuery($slug: String!) {
        article(slug: $slug) {
          title
          content
          createdAt
          views
          likesCount
          author {
            firstName
            lastName
            username
            profilePicture
          }
          totalCommentsCount
        }
      }
    `;

    const { data }: { data: GraphQLData } = await createServerClient().query({
      query: METADATA_QUERY,
      variables: { slug: articleSlug },
    });

    const article = data?.article;
    if (!article) {
      return {
        title: "Article Not Found - Infobite",
        description: "The requested article could not be found.",
      };
    }

    // Extract description from content (remove HTML tags and limit length)
    const description = article.content
      .replace(/<[^>]*>/g, "")
      .replace(/\s+/g, " ")
      .trim()
      .substring(0, 160);

    const authorName = `${article.author.firstName} ${article.author.lastName}`;
    const canonicalUrl = `https://infobite.online/user/${username}/article/${articleSlug}`;

    return {
      title: `${article.title} - Infobite`,
      description:
        description || `Read "${article.title}" by ${authorName} on Infobite.`,
      keywords: [
        article.title.toLowerCase(),
        authorName.toLowerCase(),
        "infobite",
        "article",
        "blog",
        "technology",
        "knowledge sharing",
      ],
      authors: [
        {
          name: authorName,
          url: `https://infobite.online/user/${article.author.username}`,
        },
      ],
      creator: authorName,
      publisher: "Infobite",
      formatDetection: {
        email: false,
        address: false,
        telephone: false,
      },
      metadataBase: new URL("https://infobite.online"),
      alternates: {
        canonical: canonicalUrl,
      },
      openGraph: {
        title: article.title,
        description: description,
        url: canonicalUrl,
        siteName: "Infobite",
        locale: "en_IN",
        type: "article",
        publishedTime: article.createdAt,
        modifiedTime: article.createdAt,
        authors: [authorName],
        section: "Technology",
        tags: ["technology", "article", "blog", "infobite"],
        images: article.author.profilePicture
          ? [
              {
                url: article.author.profilePicture,
                width: 1200,
                height: 630,
                alt: `Article by ${authorName}`,
              },
            ]
          : undefined,
      },
      twitter: {
        card: "summary_large_image",
        title: article.title,
        description: description,
        creator: `@${article.author.username}`,
        site: "@infobite",
        images: article.author.profilePicture
          ? [article.author.profilePicture]
          : undefined,
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
      verification: {
        google: "your-google-verification-code",
      },
      other: {
        "article:author": authorName,
        "article:published_time": article.createdAt,
        "article:modified_time": article.createdAt,
        "article:section": "Technology",
        "article:tag": "technology,article,blog,infobite",
        "og:article:author": `https://infobite.online/user/${article.author.username}`,
        "fb:app_id": "your-facebook-app-id",
      },
    };
  } catch (error) {
    console.error("Error generating metadata:", error);
    return {
      title: "Article - Infobite",
      description: "Discover amazing articles and insights on Infobite.",
    };
  }
}

export default Page;
