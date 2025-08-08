import { DraftArticle } from "@bookself/types";
import { formatDistanceToNow, parseISO } from "date-fns";
import Link from "next/link";
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
    <Card className="group p-6 transition-all hover:shadow-md">
      <div className="flex justify-between items-start gap-4">
        <div className="flex-1">
          <Link href={href}>
            <h3 className="text-lg font-medium group-hover:text-primary transition-colors line-clamp-2">
              {draftArticle.title || "Untitled Draft"}
            </h3>
          </Link>
          
          <div className="flex items-center mt-2 text-sm text-muted-foreground">
            <FiClock className="mr-2 h-4 w-4" />
            <span>Last edited {formattedDate}</span>
          </div>
        </div>
        
        <div className="flex items-center gap-1">
          <Button 
            asChild
            variant="ghost" 
            size="icon"
            className="h-8 w-8"
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
                className="h-8 w-8 opacity-0 group-hover:opacity-100 focus:opacity-100"
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
      
      <Badge variant="secondary" className="mt-3">
        Draft
      </Badge>
    </Card>
  );
};