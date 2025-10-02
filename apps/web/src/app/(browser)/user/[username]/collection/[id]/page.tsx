import { createServerClient } from "@/lib/ServerClient";
import { gql } from "@apollo/client";
import { format } from "date-fns";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PencilIcon, MoreHorizontal, MoreVertical } from "lucide-react";
import { EditCollectionBtn } from "@/components/blocks/buttons/EditCollectionBtn";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { FaDumpster } from "react-icons/fa";
import { RemoveArticleFromCollectionBtn } from "@/components/blocks/buttons/RemoveArticleFromCollectionBtn";
import { ShareButton } from "@/components/blocks/buttons/ShareButton";
import { IoShareOutline } from "react-icons/io5";
import Image from "next/image";
import { FiBookmark } from "react-icons/fi";

interface CollectionItem {
  id: string;
  dateAdded: string;
  article: {
    slug: string;
    title: string;
    views: number;
    createdAt: string;
    author: {
      username: string;
      profilePicture?: string;
    };
    thumbnail?: string;
  };
}

interface CollectionData {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  isPublic: boolean;
  retrieveItems: CollectionItem[];
  isSelf: boolean;
  itemsCount: number;
}

const Page = async ({
  params: { username, id },
}: {
  params: { username: string; id: string };
}) => {
  const COLLECTION_QUERY = gql`
    query GetCollectionDetails($id: Int!) {
      collection(id: $id) {
        id
        name
        description
        createdAt
        updatedAt
        isPublic
        isSelf
        itemsCount
        retrieveItems {
          dateAdded
          id
          article {
            slug
            title
            views
            createdAt
            thumbnail
            author {
              username
              profilePicture
            }
          }
        }
      }
    }
  `;

  const { data } = await createServerClient().query<{
    collection: CollectionData;
  }>({
    query: COLLECTION_QUERY,
    variables: { id: parseInt(id) },
  });

  const collection = data.collection;
  const articles = collection.retrieveItems.map((item) => item.article);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 flex flex-col lg:flex-row gap-8">
      {/* Fixed Left Sidebar - Collection Card */}
      <div className="w-full lg:w-80 flex-shrink-0 lg:sticky lg:top-8 h-fit">
        <Card className="h-fit">
          <CardHeader>
            <div className="flex justify-between items-start gap-2">
              <div className="flex-1">
                <div className="flex justify-between items-start gap-2">
                  <CardTitle className="text-2xl">{collection.name}</CardTitle>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <Badge
                    variant={collection.isPublic ? "default" : "secondary"}
                  >
                    {collection.isPublic ? "Public" : "Private"}
                  </Badge>
                  <EditCollectionBtn
                    id={collection.id}
                    initialName={collection.name}
                    initialDescription={collection.description}
                    initialIsPublic={collection.isPublic}
                  />
                  <ShareButton>
                    <IoShareOutline className="h-4 w-4" />
                  </ShareButton>
                </div>
                <p className="text-muted-foreground text-sm mt-2">
                  {collection.description || "No description"}
                </p>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Created:</span>
                <span>
                  {format(new Date(collection.createdAt), "MMM d, yyyy")}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Updated:</span>
                <span>
                  {format(new Date(collection.updatedAt), "MMM d, yyyy")}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Articles:</span>
                <span>{articles.length}</span>
              </div>
            </div>
          </CardContent>

          <Separator className="my-2" />

          <CardFooter className="flex items-center gap-3 pt-4">
            <Avatar className="h-8 w-8">
              {articles[0]?.author.profilePicture ? (
                <AvatarImage src={articles[0].author.profilePicture} />
              ) : (
                <AvatarFallback>
                  {articles[0]?.author.username.charAt(0).toUpperCase() || "U"}
                </AvatarFallback>
              )}
            </Avatar>
            <div className="text-sm">
              <Link
                href={`/user/${username}`}
                className="font-medium hover:underline"
              >
                @{username}
              </Link>
              <p className="text-muted-foreground text-xs">
                {articles.length}{" "}
                {articles.length === 1 ? "article" : "articles"}
              </p>
            </div>
          </CardFooter>
        </Card>
      </div>

      {/* Scrollable Right Content - Articles */}
      <div className="flex-1">
        <div className="space-y-4">
          {articles.length > 0 ? (
            articles.map((article, index) => (
              <Card
                key={`${article.slug}-${index}`}
                className="hover:border-primary transition-all overflow-hidden"
              >
                <CardContent className="p-0 flex flex-col sm:flex-row gap-0 relative">
                  {/* Thumbnail Section - Always 16:9 */}
                  <div className="sm:w-48 flex-shrink-0">
                    <Link href={`/user/${username}/article/${article.slug}`}>
                      <div className="relative w-full aspect-[16/9] sm:aspect-auto sm:h-full bg-gradient-to-br from-primary/20 via-primary/10 to-muted/20 overflow-hidden">
                        {article.thumbnail ? (
                          // Actual thumbnail image
                          <>
                            <Image
                              src={article.thumbnail}
                              alt={`Thumbnail for ${article.title}`}
                              fill
                              className="object-cover"
                              sizes="(max-width: 640px) 100vw, 192px"
                            />
                            {/* Subtle overlay for better text contrast */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
                          </>
                        ) : (
                          // Fallback placeholder when no thumbnail
                          <div className="absolute inset-0 bg-gradient-to-br from-slate-100 via-slate-50 to-blue-50 dark:from-slate-800 dark:via-slate-700 dark:to-blue-900 flex items-center justify-center">
                            <div className="text-center space-y-3">
                              <div className="relative">
                                <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto">
                                  <FiBookmark className="h-6 w-6 text-primary/60" />
                                </div>
                                <div className="absolute -top-1 -right-1 w-5 h-5 bg-primary/20 rounded-full flex items-center justify-center">
                                  <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                                </div>
                              </div>
                              <div className="space-y-1">
                                <p className="text-xs text-muted-foreground font-medium">
                                  No Thumbnail
                                </p>
                                <div className="flex items-center justify-center gap-1">
                                  <div className="w-1.5 h-0.5 bg-primary/30 rounded-full" />
                                  <div className="w-3 h-0.5 bg-primary/50 rounded-full" />
                                  <div className="w-1.5 h-0.5 bg-primary/30 rounded-full" />
                                </div>
                              </div>
                            </div>
                            <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent" />
                          </div>
                        )}
                      </div>
                    </Link>
                  </div>

                  {/* Article Content Section */}
                  <div className="flex-1 p-6 space-y-2 relative">
                    <div className="absolute top-4 right-4 z-10">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 p-0"
                          >
                            <MoreVertical className="h-5 w-5" />
                            <span className="sr-only">Open menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-40">
                          {collection.isSelf && (
                            <>
                              <DropdownMenuItem className="cursor-pointer">
                                <Link
                                  href={`/user/${username}/article/${article.slug}/edit`}
                                >
                                  Edit
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="cursor-pointer">
                                <RemoveArticleFromCollectionBtn
                                  collectionId={parseInt(collection.id)}
                                  articleSlug={article.slug}
                                >
                                  Remove
                                </RemoveArticleFromCollectionBtn>
                              </DropdownMenuItem>
                            </>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    <Link href={`/user/${username}/article/${article.slug}`}>
                      <h3 className="font-medium text-lg hover:underline pr-8">
                        {article.title}
                      </h3>
                    </Link>

                    <div className="flex items-center gap-3 text-sm text-muted-foreground pt-2">
                      <Link
                        href={`/user/${article.author.username}`}
                        className="flex items-center gap-2 hover:underline"
                      >
                        <Avatar className="h-6 w-6">
                          {article.author.profilePicture ? (
                            <AvatarImage src={article.author.profilePicture} />
                          ) : (
                            <AvatarFallback>
                              {article.author.username.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          )}
                        </Avatar>
                        @{article.author.username}
                      </Link>
                      <span>•</span>
                      <span>
                        {format(new Date(article.createdAt), "MMM d, yyyy")}
                      </span>
                      <span>•</span>
                      <span>{article.views} views</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No articles in this collection yet
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Page;