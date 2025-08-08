"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LikeButton } from "@/components/element/button/LikeButton";
import { SaveArticleButton } from "@/components/element/button/SaveArticleButton";
import { CopyArticleButton } from "@/components/element/button/CopyArticleButton";
import { DownloadPDFButton } from "@/components/element/button/DownloadPDFButton";
import { IoMdEye } from "react-icons/io";
import { FiEdit2, FiMoreHorizontal } from "react-icons/fi";
import { Copy, Download, Bookmark } from "lucide-react";
import Link from "next/link";
import { useArticle } from "@/hooks/useArticle";
import { API_ENDPOINT } from "@/app/utils";

export const ArticleMetaActions = () => {
  const { article } = useArticle();

  const likeUrl = `${API_ENDPOINT.likeArticle.url}?slug=${article.slug}`;
  const likeMethod = API_ENDPOINT.likeArticle.method;
  const fullUrl = `https://infobite.online/user/${article.author.username}/article/${article.slug}`;

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="flex items-center gap-4 text-muted-foreground mb-6">
      {/* Always visible items */}
      <div className="flex items-center gap-2">
        <LikeButton
          initialState={article.isLiked}
          initialLikes={article.likesCount}
          url={likeUrl}
          method={likeMethod}
        />
      </div>

      <div className="flex items-center gap-2">
        <IoMdEye className="text-lg" aria-label="Views" />
        <span itemProp="interactionCount">{article.views} views</span>
      </div>

      <time dateTime={article.createdAt} itemProp="datePublished" className="text-sm hidden sm:block">
        {new Date(article.createdAt).toLocaleDateString('en-IN', {
          year: 'numeric',
          month: 'long', 
          day: 'numeric'
        })}
      </time>

      {/* Mobile: Show abbreviated date */}
      <time dateTime={article.createdAt} itemProp="datePublished" className="text-sm sm:hidden">
        {new Date(article.createdAt).toLocaleDateString('en-IN', {
          month: 'short', 
          day: 'numeric'
        })}
      </time>

      {/* Edit button - always visible for author */}
      {article.author.isSelf && (
        <Link 
          href={`${article.slug}/edit`} 
          className="flex items-center justify-center gap-1 hover:text-primary transition-colors mx-1"
          aria-label="Edit article"
        >
          <FiEdit2 className="text-lg" size={16}/>
          <span className="hidden sm:inline">Edit</span>
        </Link>
      )}

      {/* Desktop: Show all actions */}
      <div className="hidden lg:flex items-center">
        <div className="flex items-center">
          <SaveArticleButton articleSlug={article.slug} isSaved={false} />
          <span>{article.savesCount}</span>
        </div>

        <CopyArticleButton 
          title={article.title}
          content={article.content}
          author={article.author}
          url={fullUrl}
        />

        {/* <DownloadPDFButton 
          title={article.title}
          // content={article.content}
          author={article.author}
          createdAt={article.createdAt}
          url={fullUrl}
        /> */}
      </div>

      {/* Mobile/Tablet: Three-dot menu */}
      <div className="lg:hidden">
        <DropdownMenu open={isMenuOpen} onOpenChange={setIsMenuOpen}>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center gap-1 hover:bg-accent transition-colors"
              aria-label="More actions"
            >
              <FiMoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem asChild>
              <div className="flex items-center justify-between w-full px-2 py-1">
                <div className="flex items-center gap-2">
                  <Bookmark className="h-4 w-4" />
                  <span>Save</span>
                </div>
                <div className="flex items-center gap-1">
                  <SaveArticleButton articleSlug={article.slug} isSaved={false} />
                  <span className="text-sm">{article.savesCount}</span>
                </div>
              </div>
            </DropdownMenuItem>
            
            <DropdownMenuItem asChild>
              <div className="w-full">
                <CopyArticleButton 
                  title={article.title}
                  content={article.content}
                  author={article.author}
                  url={fullUrl}
                />
              </div>
            </DropdownMenuItem>
            
            <DropdownMenuItem asChild>
              <div className="w-full">
                {/* <DownloadPDFButton 
                  title={article.title}
                  // content={article.content}
                  author={article.author}
                  createdAt={article.createdAt}
                  url={fullUrl}
                /> */}
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};
