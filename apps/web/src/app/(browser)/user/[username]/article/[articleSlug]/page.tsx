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
import { TableOfContents } from "@/components/blocks/TableOfContents";

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

// Remove the commented out MORE_ARTICLES_QUERY since we're using relatedArticles now

const Page = async ({
  params,
}: {
  params: Promise<{ username: string; articleSlug: string }>;
}) => {
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
  if (!article) {
    return redirect("/not-found");
  }
  if (article.slug != articleSlug) {
    redirect(`${article.slug}`);
  }

  return (
    <>
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            "headline": article.title,
            "description": article.content.replace(/<[^>]*>/g, '').substring(0, 160),
            "url": `https://infobite.online/user/${username}/article/${articleSlug}`,
            "datePublished": article.createdAt,
            "dateModified": article.createdAt,
            "author": {
              "@type": "Person",
              "name": `${article.author.firstName} ${article.author.lastName}`,
              "url": `https://infobite.online/user/${article.author.username}`,
              "image": article.author.profilePicture
            },
            "publisher": {
              "@type": "Organization",
              "name": "Infobite",
              "url": "https://infobite.online",
              "logo": "https://infobite.online/logo.png"
            },
            "mainEntityOfPage": {
              "@type": "WebPage",
              "@id": `https://infobite.online/user/${username}/article/${articleSlug}`
            },
            "interactionStatistic": [
              {
                "@type": "InteractionCounter",
                "interactionType": "https://schema.org/LikeAction",
                "userInteractionCount": article.likesCount
              },
              {
                "@type": "InteractionCounter", 
                "interactionType": "https://schema.org/ViewAction",
                "userInteractionCount": article.views
              },
              {
                "@type": "InteractionCounter",
                "interactionType": "https://schema.org/CommentAction", 
                "userInteractionCount": article.totalCommentsCount
              }
            ]
          })
        }}
      />

      <div className="flex flex-col xl:flex-row max-w-[1500px] mx-auto px-3 lg:px-6 pt-6 gap-8">
        {/* Table of Contents Sidebar - Left */}
        <aside className="hidden xl:block flex-shrink-0" aria-labelledby="toc-sidebar">
          <div className="sticky top-20">
            <TableOfContents />
          </div>
        </aside>

        {/* Main Content */}
        <article className="flex-1 min-w-0 xl:pl-8" itemScope itemType="https://schema.org/Article">
          {/* Article Header */}
          <header className="border-none">
            <h1 className="text-3xl font-bold mb-2" itemProp="headline">{article.title}</h1>

            {/* Article Meta Information */}
            <ArticleMetaActions
              article={article}
              articleSlug={articleSlug}
              username={username}
              likeUrl={`${API_ENDPOINT.likeArticle.url}?slug=${articleSlug}`}
              likeMethod={API_ENDPOINT.likeArticle.method}
              fullUrl={`https://infobite.online/user/${username}/article/${articleSlug}`}
            />
          </header>

          {/* Mobile Table of Contents */}
          <div className="xl:hidden mb-6">
            <TableOfContents />
          </div>

          {/* Main Article Content */}
          <main className="prose dark:prose-invert max-w-none" role="main">
            <div 
              itemProp="articleBody"
              dangerouslySetInnerHTML={{ __html: article.content }}
            />
          </main>
          
          <Separator className="my-8" />
          
          {/* Author Information */}
          <section className="p-4 mb-8 border rounded-lg" aria-labelledby="author-info" itemScope itemType="https://schema.org/Person">
            <h2 id="author-info" className="sr-only">About the Author</h2>
            <div className="flex items-start gap-4">
              <Link href={`/user/${article.author.username}`} className="flex-shrink-0">
                <Avatar className="h-16 w-16">
                  <AvatarImage 
                    src={article.author.profilePicture} 
                    alt={`${article.author.firstName} ${article.author.lastName}`}
                    itemProp="image"
                  />
                  <AvatarFallback>
                    {article.author.username.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </Link>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2 mb-1">
                      <h3 className="text-lg font-semibold">
                        <Link
                          href={`/user/${article.author.username}`}
                          className="hover:underline"
                          itemProp="url"
                        >
                          <span itemProp="name">{article.author.firstName} {article.author.lastName}</span>
                        </Link>
                      </h3>
                      <p className="text-muted-foreground text-sm">
                        @<span itemProp="alternateName">{article.author.username}</span>
                      </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
                      <Link
                        href={`/user/${username}/followers`}
                        className="hover:text-primary transition-colors"
                      >
                        <span className="font-semibold">
                          {article.author.followersCount}
                        </span>{" "}
                        Followers
                      </Link>
                      <Link
                        href={`/user/${username}/following`}
                        className="hover:text-primary transition-colors"
                      >
                        <span className="font-semibold">
                          {article.author.followingCount}
                        </span>{" "}
                        Following
                      </Link>
                    </div>
                  </div>
                  {!article.author.isSelf && (
                    <div className="flex-shrink-0">
                      <FollowButton
                        initialIsFollowing={article.author.isFollowing}
                        username={username}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>
          
          {/* Comments Section */}
          <section aria-labelledby="comments-section">
            <h2 id="comments-section" className="sr-only">Comments</h2>
            <Separator className="mb-4" />
            <Comments
              totalCommentsCount={article.totalCommentsCount}
              commentsCount={article.commentsCount}
              initialComments={article.comments}
              articleSlug={articleSlug}
            />
          </section>
        </article>
        
        {/* Related Articles Sidebar - Right */}
        <aside className="hidden lg:block w-72 flex-shrink-0" aria-labelledby="related-sidebar">
          <div className="sticky top-8 space-y-6">
            {/* Related Articles */}
            <div>
              <h2 id="related-articles" className="text-xl font-semibold mb-4">Related Articles</h2>
              <div className="flex flex-col gap-3 max-h-[60vh] overflow-y-auto pr-2">
                {(!(article as any).relatedArticles || (article as any).relatedArticles.length === 0) && (
                  <div className="text-muted-foreground text-sm">
                    No related articles found.
                  </div>
                )}
                {(article as any).relatedArticles?.map((a: any) => (
                  <Card key={a.id} className="p-4 hover:shadow-md transition-shadow">
                    <Link
                      href={`/user/${a.author.username}/article/${a.slug}`}
                      className="block group"
                    >
                      <article className="space-y-3">
                        <h3 className="font-medium text-sm leading-tight line-clamp-2 group-hover:text-primary transition-colors">
                          {a.title}
                        </h3>
                        <div className="flex items-center gap-2">
                          <Avatar className="h-5 w-5">
                            <AvatarImage src={a.author.profilePicture} alt={`${a.author.firstName} ${a.author.lastName}`} />
                            <AvatarFallback className="text-xs">
                              {a.author.username.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-xs text-muted-foreground">
                            {a.author.firstName} {a.author.lastName}
                          </span>
                        </div>
                      </article>
                    </Link>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </aside>
      </div>
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
      .replace(/<[^>]*>/g, '')
      .replace(/\s+/g, ' ')
      .trim()
      .substring(0, 160);

    const authorName = `${article.author.firstName} ${article.author.lastName}`;
    const canonicalUrl = `https://infobite.online/user/${username}/article/${articleSlug}`;

    return {
      title: `${article.title} - Infobite`,
      description: description || `Read "${article.title}" by ${authorName} on Infobite.`,
      keywords: [
        article.title.toLowerCase(),
        authorName.toLowerCase(),
        'infobite',
        'article',
        'blog',
        'technology',
        'knowledge sharing'
      ],
      authors: [{ name: authorName, url: `https://infobite.online/user/${article.author.username}` }],
      creator: authorName,
      publisher: 'Infobite',
      formatDetection: {
        email: false,
        address: false,
        telephone: false,
      },
      metadataBase: new URL('https://infobite.online'),
      alternates: {
        canonical: canonicalUrl,
      },
      openGraph: {
        title: article.title,
        description: description,
        url: canonicalUrl,
        siteName: 'Infobite',
        locale: 'en_IN',
        type: 'article',
        publishedTime: article.createdAt,
        modifiedTime: article.createdAt,
        authors: [authorName],
        section: 'Technology',
        tags: ['technology', 'article', 'blog', 'infobite'],
        images: article.author.profilePicture ? [
          {
            url: article.author.profilePicture,
            width: 1200,
            height: 630,
            alt: `Article by ${authorName}`,
          }
        ] : undefined,
      },
      twitter: {
        card: 'summary_large_image',
        title: article.title,
        description: description,
        creator: `@${article.author.username}`,
        site: '@infobite',
        images: article.author.profilePicture ? [article.author.profilePicture] : undefined,
      },
      robots: {
        index: true,
        follow: true,
        googleBot: {
          index: true,
          follow: true,
          'max-video-preview': -1,
          'max-image-preview': 'large',
          'max-snippet': -1,
        },
      },
      verification: {
        google: 'your-google-verification-code',
      },
      other: {
        'article:author': authorName,
        'article:published_time': article.createdAt,
        'article:modified_time': article.createdAt,
        'article:section': 'Technology',
        'article:tag': 'technology,article,blog,infobite',
        'og:article:author': `https://infobite.online/user/${article.author.username}`,
        'fb:app_id': 'your-facebook-app-id',
      },
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: "Article - Infobite",
      description: "Discover amazing articles and insights on Infobite.",
    };
  }
}

export default Page;
