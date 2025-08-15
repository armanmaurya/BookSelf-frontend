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
    <Card className="group p-0 transition-all hover:shadow-lg hover:shadow-orange-500/10 overflow-hidden relative border-0 shadow-sm bg-gradient-to-br from-orange-50/50 via-background to-orange-50/20 dark:from-orange-950/10 dark:to-orange-950/5">
      {/* Thumbnail Image - 16:9 aspect ratio */}
      <div className="relative w-full aspect-[16/9] bg-gradient-to-br from-orange-100/50 via-orange-50/30 to-orange-100/20 dark:from-orange-950/20 dark:to-orange-950/10 overflow-hidden">
        {draftArticle.imageUrl ? (
          // Actual thumbnail image
          <>
            <Image
              src={draftArticle.imageUrl}
              alt={`Thumbnail for ${draftArticle.title}`}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
            {/* Subtle overlay for better text contrast */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent" />
          </>
        ) : (
          // Fallback placeholder when no image
          <div className="absolute inset-0 bg-gradient-to-br from-orange-100 via-orange-50 to-yellow-50 dark:from-orange-900 dark:via-orange-800 dark:to-yellow-900 flex items-center justify-center">
            <div className="text-center space-y-3">
              <div className="relative">
                <div className="w-16 h-16 bg-orange-200/50 dark:bg-orange-800/50 rounded-2xl flex items-center justify-center mx-auto">
                  <FiEdit2 className="h-8 w-8 text-orange-600 dark:text-orange-400" />
                </div>
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-orange-300/60 dark:bg-orange-700/60 rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" />
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-orange-700 dark:text-orange-300 font-medium">Draft Preview</p>
                <div className="flex items-center justify-center gap-1">
                  <div className="w-1 h-1 bg-orange-400 rounded-full animate-pulse" />
                  <div className="w-1 h-1 bg-orange-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }} />
                  <div className="w-1 h-1 bg-orange-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }} />
                </div>
              </div>
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
          </div>
        )}
        
        {/* Draft Badge */}
        <Badge variant="secondary" className="absolute top-3 left-3 z-10 bg-orange-100 text-orange-700 hover:bg-orange-200 dark:bg-orange-950 dark:text-orange-300">
          <span className="w-2 h-2 bg-orange-500 rounded-full animate-pulse mr-2" />
          Draft
        </Badge>

        {/* Action Menu */}
        <div className="absolute top-3 right-3 flex items-center gap-1">
          <Button 
            asChild
            variant="ghost" 
            size="icon"
            className="h-8 w-8 bg-background/80 hover:bg-background hover:text-primary backdrop-blur-sm"
          >
            <Link href={href} title="Edit draft">
              <FiEdit2 className="h-4 w-4" />
            </Link>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 opacity-0 group-hover:opacity-100 focus:opacity-100 bg-background/80 hover:bg-background backdrop-blur-sm"
              >
                <BsThreeDotsVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleShare}>
                <FiShare2 className="mr-2 h-4 w-4" />
                <span>Share</span>
              </DropdownMenuItem>
              <DropdownMenuItem 
                className="focus:text-destructive"
              >
                <Link className="flex" href={`/user/${draftArticle.article.author.username}/article/${draftArticle.article.slug}/setting`}>
                  <FiSettings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="space-y-3">
          <Link href={href}>
            <h3 className="text-lg font-semibold group-hover:text-primary transition-colors line-clamp-2 leading-tight">
              {draftArticle.title || "Untitled Draft"}
            </h3>
          </Link>

          {/* Footer with metadata */}
          <div className="flex items-center justify-between pt-3 border-t border-orange-200/30 dark:border-orange-950/30">
            <div className="flex items-center text-sm text-muted-foreground">
              <FiClock className="mr-2 h-4 w-4 text-orange-500" />
              <span className="font-medium">Last edited {formattedDate}</span>
            </div>
            
            <Button
              asChild
              size="sm"
              variant="outline"
              className="h-8 px-3 text-xs border-orange-200 hover:bg-orange-50 hover:border-orange-300 dark:border-orange-800 dark:hover:bg-orange-950/20"
            >
              <Link href={href}>
                <FiEdit2 className="h-3 w-3 mr-1" />
                Continue Writing
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};