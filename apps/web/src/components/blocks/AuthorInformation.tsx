"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { FollowButton } from "@/components/element/button/FollowButton";
import Link from "next/link";
import { useArticle } from "@/hooks/useArticle";

export const AuthorInformation = () => {
  const { article } = useArticle();

  return (
    <section
      className="p-4 mb-8 border rounded-lg"
      aria-labelledby="author-info"
      itemScope
      itemType="https://schema.org/Person"
    >
      <h2 id="author-info" className="sr-only">
        About the Author
      </h2>
      <div className="flex items-start gap-4">
        <Link
          href={`/user/${article.author.username}`}
          className="flex-shrink-0"
        >
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
                    <span itemProp="name">
                      {article.author.firstName} {article.author.lastName}
                    </span>
                  </Link>
                </h3>
                <p className="text-muted-foreground text-sm">
                  @
                  <span itemProp="alternateName">
                    {article.author.username}
                  </span>
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
                <Link
                  href={`/user/${article.author.username}/followers`}
                  className="hover:text-primary transition-colors"
                >
                  <span className="font-semibold">
                    {article.author.followersCount}
                  </span>{" "}
                  Followers
                </Link>
                <Link
                  href={`/user/${article.author.username}/following`}
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
                  username={article.author.username}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
