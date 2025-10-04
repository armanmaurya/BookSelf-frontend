import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FaBook } from "react-icons/fa";

interface NotebookCardProps {
  notebook: {
    id: string;
    name: string;
    overview?: string;
    cover?: string;
    pagesCount?: number;
    hasPages: boolean;
    slug: string;
    createdAt: string;
    user: {
      firstName?: string;
      username: string;
      lastName?: string;
      isSelf?: boolean;
      id: string;
      profilePicture?: string;
    };
  };
  index?: number;
}

export const NotebookCard = ({ notebook, index = 0 }: NotebookCardProps) => {
  return (
    <div>
      <Link href={`/user/${notebook.user.username}/notebook/${notebook.slug}`}>
        <Card className="group hover:shadow-lg transition-all duration-300 h-full cursor-pointer overflow-hidden">
          {/* Cover Image - 9:16 aspect ratio (portrait like book cover) */}
          <div className="relative w-full aspect-[9/16] overflow-hidden">
            {notebook.cover ? (
              <img
                src={notebook.cover}
                alt={notebook.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-primary/10 to-primary/20 flex items-center justify-center">
                <FaBook className="h-16 w-16 text-primary/60" />
              </div>
            )}
            {/* Gradient overlay for better text contrast */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-black/10" />

            {/* Content overlay */}
            <div className="absolute inset-0 p-4 flex flex-col justify-end text-white">
              <div className="space-y-2">
                <h3 className="font-bold text-lg leading-tight line-clamp-2 drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)]">
                  {notebook.name}
                </h3>
                
                {notebook.overview && (
                  <p className="text-sm text-white/80 line-clamp-2 drop-shadow-[0_1px_1px_rgba(0,0,0,0.55)]">
                    {notebook.overview}
                  </p>
                )}

                {/* Meta information */}
                <div className="flex items-center justify-between pt-2 text-[13px]">
                  <div className="flex items-center gap-2">
                    <Badge 
                      variant={notebook.hasPages ? "default" : "secondary"}
                      className="text-xs bg-white/25 text-white border-white/40 backdrop-blur-sm"
                    >
                      {notebook.pagesCount || 0} pages
                    </Badge>
                    {!notebook.hasPages && (
                      <Badge variant="outline" className="text-xs border-white/40 text-white/80 backdrop-blur-sm">
                        Empty
                      </Badge>
                    )}
                  </div>
                  
                  <span className="text-xs text-white/80 drop-shadow-[0_1px_1px_rgba(0,0,0,0.5)]">
                    {new Date(notebook.createdAt).toLocaleDateString()}
                  </span>
                </div>

                {/* Author info (for home page) */}
                {!notebook.user.isSelf && (
                  <div className="flex items-center gap-2 pt-1">
                    {notebook.user.profilePicture && (
                      <img
                        src={notebook.user.profilePicture}
                        alt={notebook.user.username}
                        className="h-5 w-5 rounded-full border border-white/40"
                      />
                    )}
                    <span className="text-xs text-white/90 drop-shadow-[0_1px_1px_rgba(0,0,0,0.5)]">
                      by @{notebook.user.username}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </Card>
      </Link>
    </div>
  );
};
