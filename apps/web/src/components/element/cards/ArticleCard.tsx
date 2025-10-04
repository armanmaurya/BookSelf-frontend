import { Article } from "@/types/article";
import { formatDistanceToNow, parseISO } from "date-fns";
import Link from "next/link";
import Image from "next/image";
import { IoMdEye } from "react-icons/io";
import { AiOutlineLike } from "react-icons/ai";
import { FiBookmark } from "react-icons/fi";
import { BsThreeDotsVertical } from "react-icons/bs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export const ArticleCard = ({ article }: { article: Article }) => {
  const formattedDate = formatDistanceToNow(parseISO(article.createdAt), {
    addSuffix: true,
  });
  
  return (
    <Card className="group overflow-hidden relative border-0 shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer">
      <Link href={`/user/${article.author.username}/article/${article.slug}`}>
        <div className="relative w-full aspect-[16/9] overflow-hidden">
          {article.thumbnail ? (
            <Image
              src={article.thumbnail}
              alt={`Thumbnail for ${article.title}`}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-slate-100 via-slate-50 to-blue-50 dark:from-slate-800 dark:via-slate-700 dark:to-blue-900 flex items-center justify-center">
              <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center">
                <FiBookmark className="h-10 w-10 text-primary/40" />
              </div>
            </div>
          )}

          {/* Gradient overlay for text contrast */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/20" />

          {/* Content overlay */}
          <div className="absolute inset-0 p-4 flex flex-col justify-between text-white">
            {/* Top section with menu */}
            <div className="flex justify-end">
              {article.isSelf && (
                <DropdownMenu>
                  <DropdownMenuTrigger
                    asChild
                  >
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-white hover:bg-white/20 backdrop-blur-sm"
                    >
                      <BsThreeDotsVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <Link
                        href={`/user/${article.author.username}/article/${article.slug}/edit`}
                      >
                        Edit
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Link
                        href={`/user/${article.author.username}/article/${article.slug}/setting`}
                      >
                        Settings
                      </Link>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>

            {/* Bottom section with content */}
            <div className="space-y-3">
              <h2 className="font-bold text-lg leading-tight line-clamp-2 drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)]">
                {article.title || "Untitled Article"}
              </h2>

              {/* Author and metadata */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Avatar className="h-8 w-8 ring-2 ring-white/20">
                    <AvatarImage src={article.author.profilePicture} />
                    <AvatarFallback className="text-xs bg-white/20 text-white">
                      {article.author.username.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-medium text-white/90">
                    {article.author.username}
                  </span>
                </div>
                <div className="text-sm text-white/80 absolute left -4 top-4">{formattedDate}</div>

                {/* Stats */}
                <div className="flex items-center space-x-4 text-sm text-white/80">
                  <div className="flex items-center space-x-1">
                    <IoMdEye className="h-4 w-4" />
                    <span>{article.views}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <AiOutlineLike className="h-4 w-4" />
                    <span>{article.likesCount}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </Card>
  );
};
