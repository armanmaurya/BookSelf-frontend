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
    <Card className="group p-6 flex flex-col h-44 transition-all hover:shadow-md overflow-hidden relative">
      {/* Status Badge */}
      {article.status === "draft" && (
        <Badge variant="secondary" className="absolute top-3 left-3 z-10">
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
              className="absolute top-3 right-3 h-8 w-8 z-10"
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

      {/* Article Content */}
      <div className="flex flex-col flex-grow h-full">
        <div className="mb-3">
          <Link
            href={`/user/${article.author.username}/article/${article.slug}`}
          >
            <h2 className="text-xl font-bold group-hover:text-primary transition-colors line-clamp-2 leading-tight">
              {article.title || "Untitled Article"}
            </h2>
          </Link>
          <div className="flex items-center mt-2">
            <Link
              href={`/user/${article.author.username}`}
              className="flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <Avatar className="h-5 w-5 mr-2">
                <AvatarImage src={article.author.profilePicture} />
                <AvatarFallback>
                  {article.author.username.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              {article.author.username}
            </Link>
          </div>
        </div>

        {/* Meta Info */}
        <div className="mt-auto pt-3 border-t flex items-center justify-between">
          <div className="flex items-center gap-4 text-muted-foreground text-sm">
            <div className="flex items-center gap-1.5">
              <IoMdEye className="h-4 w-4" />
              <span>{article.views}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <AiOutlineLike className="h-4 w-4" />
              <span>{article.likesCount}</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-muted-foreground text-xs">{formattedDate}</div>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-primary"
            >
              <FiBookmark className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};
