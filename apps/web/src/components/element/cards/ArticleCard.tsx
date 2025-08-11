import { Article } from "@bookself/types";
import { formatDistanceToNow, parseISO } from "date-fns";
import Link from "next/link";
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
    <Card className="group p-0 flex flex-col transition-all hover:shadow-lg hover:shadow-primary/10 overflow-hidden relative border-0 shadow-sm bg-gradient-to-br from-background via-background to-muted/20">
      {/* Thumbnail Image - 16:9 aspect ratio */}
      <div className="relative w-full aspect-[16/9] bg-gradient-to-br from-primary/20 via-primary/10 to-muted/20 overflow-hidden">
        {/* Dummy thumbnail - will be replaced with actual image */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-100 via-slate-50 to-blue-50 dark:from-slate-800 dark:via-slate-700 dark:to-blue-900 flex items-center justify-center">
          <div className="text-center space-y-3">
            <div className="relative">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto">
                <FiBookmark className="h-8 w-8 text-primary/60" />
              </div>
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center">
                <div className="w-2 h-2 bg-primary rounded-full" />
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground font-medium">Article Thumbnail</p>
              <div className="flex items-center justify-center gap-1">
                <div className="w-2 h-0.5 bg-primary/30 rounded-full" />
                <div className="w-4 h-0.5 bg-primary/50 rounded-full" />
                <div className="w-2 h-0.5 bg-primary/30 rounded-full" />
              </div>
            </div>
          </div>
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
        
        {/* Status Badge */}
        {article.status === "draft" && (
          <Badge variant="secondary" className="absolute top-3 left-3 z-10 bg-orange-100 text-orange-700 hover:bg-orange-200">
            <span className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse mr-2" />
            Draft
          </Badge>
        )}

        {/* Three dot menu */}
        {article.isSelf && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-3 right-3 h-8 w-8 z-10 bg-background/80 hover:bg-background backdrop-blur-sm"
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
              <DropdownMenuItem className="">
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

      {/* Article Content */}
      <div className="flex flex-col flex-grow h-full p-6">
        <div className="mb-4 flex-grow">
          <Link
            href={`/user/${article.author.username}/article/${article.slug}`}
          >
            <h2 className="text-lg font-bold group-hover:text-primary transition-colors line-clamp-2 leading-tight mb-3">
              {article.title || "Untitled Article"}
            </h2>
          </Link>
          
          {/* Author info */}
          <div className="flex items-center mb-3">
            <Link
              href={`/user/${article.author.username}`}
              className="flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <Avatar className="h-6 w-6 mr-2 ring-2 ring-primary/10">
                <AvatarImage src={article.author.profilePicture} />
                <AvatarFallback className="text-xs bg-primary/10">
                  {article.author.username.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <span className="font-medium">{article.author.username}</span>
            </Link>
          </div>
        </div>

        {/* Meta Info */}
        <div className="mt-auto pt-3 border-t border-muted/30 flex items-center justify-between">
          <div className="flex items-center gap-4 text-muted-foreground text-sm">
            <div className="flex items-center gap-1.5 hover:text-primary transition-colors">
              <IoMdEye className="h-4 w-4" />
              <span className="font-medium">{article.views}</span>
            </div>
            <div className="flex items-center gap-1.5 hover:text-red-500 transition-colors">
              <AiOutlineLike className="h-4 w-4" />
              <span className="font-medium">{article.likesCount}</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-muted-foreground text-xs font-medium">{formattedDate}</div>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-primary transition-all duration-200"
            >
              <FiBookmark className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};
