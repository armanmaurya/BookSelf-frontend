"use client";

import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import Image from "next/image";
import { useArticle } from "@/hooks/useArticle";
import { AiOutlineLike } from "react-icons/ai";
import { FiBookmark, FiMessageCircle } from "react-icons/fi";
import Script from "next/script";

export const RelatedArticles = () => {
  const { article } = useArticle();
  
  // Insert ad after the 2nd article (index 1)
  const adPosition = 2;

  const renderArticleCard = (a: any) => (
    <Card
      key={a.id}
      className="p-0 hover:shadow-md transition-shadow overflow-hidden"
    >
      <Link
        href={`/user/${a.author.username}/article/${a.slug}`}
        className="block group"
      >
        <article className="space-y-0">
          {/* Thumbnail */}
          {a.thumbnail ? (
            <div className="relative w-full aspect-video">
              <Image
                src={a.thumbnail}
                alt={`Thumbnail for ${a.title}`}
                fill
                className="object-cover transition-transform duration-200 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, 300px"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            </div>
          ) : (
            <div className="w-full aspect-video bg-gradient-to-br from-primary/10 to-muted/20 flex items-center justify-center">
              <FiBookmark className="h-6 w-6 text-muted-foreground" />
            </div>
          )}
          
          {/* Content */}
          <div className="p-3 space-y-3">
            <h3 className="font-medium text-sm leading-tight line-clamp-2 group-hover:text-primary transition-colors">
              {a.title}
            </h3>
            
            {/* Author */}
            <div className="flex items-center gap-2">
              <Avatar className="h-5 w-5">
                <AvatarImage
                  src={a.author.profilePicture}
                  alt={`${a.author.firstName} ${a.author.lastName}`}
                />
                <AvatarFallback className="text-xs">
                  {a.author.username.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <span className="text-xs text-muted-foreground">
                {a.author.firstName} {a.author.lastName}
              </span>
            </div>
            
            {/* Stats */}
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  <AiOutlineLike className="h-3 w-3" />
                  <span>{a.likesCount}</span>
                </div>
                <div className="flex items-center gap-1">
                  <FiMessageCircle className="h-3 w-3" />
                  <span>{a.totalCommentsCount}</span>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <FiBookmark className="h-3 w-3" />
                <span>{a.savesCount}</span>
              </div>
            </div>
          </div>
        </article>
      </Link>
    </Card>
  );

  return (
    <aside
      className="hidden lg:block w-72 flex-shrink-0"
      aria-labelledby="related-sidebar"
    >
      <div className="space-y-6">
        {/* Related Articles */}
        <div>
          <h2
            id="related-articles"
            className="text-xl font-semibold mb-4"
          >
            Related Articles
          </h2>
          <div className="flex flex-col gap-3 pr-2">
            {(!article.relatedArticles || article.relatedArticles.length === 0) && (
              <div className="text-muted-foreground text-sm">
                No related articles found.
              </div>
            )}
            {article.relatedArticles?.map((a, index) => (
              <>
                {renderArticleCard(a)}
                {/* Insert ad after the 2nd article */}
                {index === adPosition - 1 && article.relatedArticles.length > adPosition && (
                  <div key={`ad-${index}`} className="my-2">
                    <ins
                      className="adsbygoogle"
                      style={{ display: "block" }}
                      data-ad-client="ca-pub-2256001565970115"
                      data-ad-slot="YOUR_AD_SLOT_ID_3"
                      data-ad-format="auto"
                      data-full-width-responsive="true"
                    />
                    <Script id="adsense-init-related" strategy="afterInteractive">
                      {`(adsbygoogle = window.adsbygoogle || []).push({});`}
                    </Script>
                  </div>
                )}
              </>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
};
