import { DraftArticle } from "@/types/article";
import { formatDistanceToNow, parseISO } from "date-fns";
import Link from "next/link";
import Image from "next/image";
import { FiEdit2, FiClock, FiTrash2, FiShare2, FiSettings } from "react-icons/fi";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { BsThreeDotsVertical } from "react-icons/bs";

export const DraftArticleCard = ({
  draftArticle,
  href,
}: {
  draftArticle: DraftArticle;
  href: string;
}) => {
  const formattedDate = formatDistanceToNow(parseISO(draftArticle.updatedAt), {
    addSuffix: true,
  });

  const handleDelete = () => {
    // Add your delete logic here
    console.log("Deleting draft:", draftArticle.article.slug);
  };

  const handleShare = () => {
    // Add your share logic here
    console.log("Sharing draft:", draftArticle.article.slug);
  };

  return (
    <Card className="group overflow-hidden relative border-orange-200/50 shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer bg-gradient-to-br from-orange-50/30 to-background dark:from-orange-950/10 dark:border-orange-800/30">
      <Link href={href}>
        <div className="relative w-full aspect-[16/9] overflow-hidden">
          {draftArticle.imageUrl ? (
            <Image
              src={draftArticle.imageUrl}
              alt={`Thumbnail for ${draftArticle.title}`}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-orange-100 via-orange-50 to-yellow-50 dark:from-orange-900 dark:via-orange-800 dark:to-yellow-900 flex items-center justify-center">
              <div className="relative">
                <div className="w-20 h-20 bg-orange-200/50 dark:bg-orange-800/50 rounded-3xl flex items-center justify-center">
                  <FiEdit2 className="h-10 w-10 text-orange-600/60 dark:text-orange-400/60" />
                </div>
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-orange-300/60 dark:bg-orange-700/60 rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" />
                </div>
              </div>
            </div>
          )}

          {/* Gradient overlay for text contrast */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

          {/* Content overlay */}
          <div className="absolute inset-0 p-4 flex flex-col justify-between text-white">
            {/* Top section with draft badge and menu */}
            <div className="flex justify-between items-start">
              <Badge className="bg-orange-500/90 text-white hover:bg-orange-600/90 backdrop-blur-sm">
                <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse mr-1.5" />
                Draft
              </Badge>

              <DropdownMenu>
                <DropdownMenuTrigger asChild onClick={(e) => e.preventDefault()}>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-white hover:bg-white/20 backdrop-blur-sm"
                  >
                    <BsThreeDotsVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={handleShare}>
                    <FiShare2 className="mr-2 h-4 w-4" />
                    <span>Share</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="focus:text-destructive">
                    <Link 
                      className="flex" 
                      href={`/user/${draftArticle.article.author.username}/article/${draftArticle.article.slug}/setting`}
                    >
                      <FiSettings className="mr-2 h-4 w-4" />
                      <span>Settings</span>
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Bottom section with content */}
            <div className="space-y-3">
              <h3 className="text-xl font-bold text-white line-clamp-2 leading-tight">
                {draftArticle.title || "Untitled Draft"}
              </h3>
              
              {/* Meta info */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-1 text-sm text-white/80">
                  <FiClock className="h-4 w-4 text-orange-300" />
                  <span>Edited {formattedDate}</span>
                </div>
                
                <Button
                  size="sm"
                  variant="outline"
                  className="h-7 px-3 text-xs border-white/30 text-white hover:bg-white/20 hover:border-white/50 backdrop-blur-sm"
                  onClick={(e) => e.stopPropagation()}
                >
                  <FiEdit2 className="h-3 w-3 mr-1" />
                  Edit
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </Card>
  );
};