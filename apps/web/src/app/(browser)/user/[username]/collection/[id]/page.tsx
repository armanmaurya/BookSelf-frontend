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
import { ArticleCard } from "@/components/element/cards/ArticleCard";
import { Article } from "@/types/article";

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
      isSelf: boolean;
    };
    thumbnail?: string;
    likesCount: number;
    status: string;
    isSelf: boolean;
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
            likesCount
            status
            isSelf
            author {
              username
              profilePicture
              isSelf
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
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Collection Header */}
      <div className="mb-8">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div>
                <h1 className="text-2xl lg:text-3xl font-bold">
                  {collection.name}
                </h1>
                <div className="flex items-center gap-2 mt-1">
                  <Badge
                    variant={collection.isPublic ? "default" : "secondary"}
                    className="text-xs"
                  >
                    {collection.isPublic ? "Public" : "Private"}
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    {articles.length} {articles.length === 1 ? "article" : "articles"}
                  </span>
                </div>
              </div>
            </div>
            
            {collection.description && (
              <p className="text-muted-foreground max-w-2xl">
                {collection.description}
              </p>
            )}
          </div>
          
          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            <EditCollectionBtn
              id={collection.id}
              initialName={collection.name}
              initialDescription={collection.description}
              initialIsPublic={collection.isPublic}
            />
            <ShareButton>
              <IoShareOutline className="h-4 w-4" />
              <span>Share</span>
            </ShareButton>
          </div>
        </div>
        
        {/* Collection Metadata */}
        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mt-4">
          <div className="flex items-center gap-2">
            <Avatar className="h-5 w-5">
              {articles[0]?.author.profilePicture ? (
                <AvatarImage src={articles[0].author.profilePicture} />
              ) : (
                <AvatarFallback className="text-xs">
                  {articles[0]?.author.username.charAt(0).toUpperCase() || "U"}
                </AvatarFallback>
              )}
            </Avatar>
            <Link
              href={`/user/${username}`}
              className="hover:text-foreground transition-colors"
            >
              @{username}
            </Link>
          </div>
          <span>•</span>
          <span>Created {format(new Date(collection.createdAt), "MMM d, yyyy")}</span>
          <span>•</span>
          <span>Updated {format(new Date(collection.updatedAt), "MMM d, yyyy")}</span>
        </div>
      </div>
      {/* Articles Grid */}
      <div>
        {articles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((article, index) => (
              <div key={`${article.slug}-${index}`}>
                <ArticleCard article={article as Article} />
              </div>
            ))}
          </div>
        ) : (
          <Card className="border-dashed border-2">
            <CardContent className="flex flex-col items-center justify-center py-16 px-6 text-center">
              <div className="rounded-full bg-muted p-4 mb-4">
                <FiBookmark className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">
                No articles in this collection yet
              </h3>
              <p className="text-muted-foreground max-w-md">
                {collection.isSelf 
                  ? "Start adding articles to this collection to organize your content."
                  : "This collection is empty. Check back later for new articles."
                }
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Page;