"use client";

import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { useArticle } from "@/hooks/useArticle";

interface RelatedArticle {
  id: number;
  slug: string;
  title: string;
  author: {
    username: string;
    firstName: string;
    lastName: string;
    profilePicture?: string;
  };
}

export const RelatedArticles = () => {
  const { article } = useArticle();

  return (
    <aside
      className="hidden lg:block w-72 flex-shrink-0"
      aria-labelledby="related-sidebar"
    >
      <div className="sticky top-8 space-y-6">
        {/* Related Articles */}
        <div>
          <h2
            id="related-articles"
            className="text-xl font-semibold mb-4"
          >
            Related Articles
          </h2>
          <div className="flex flex-col gap-3 max-h-[60vh] overflow-y-auto pr-2">
            {(!article.relatedArticles || article.relatedArticles.length === 0) && (
              <div className="text-muted-foreground text-sm">
                No related articles found.
              </div>
            )}
            {article.relatedArticles?.map((a: RelatedArticle) => (
              <Card
                key={a.id}
                className="p-4 hover:shadow-md transition-shadow"
              >
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
                  </article>
                </Link>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
};
