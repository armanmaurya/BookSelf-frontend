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
import { PencilIcon } from "lucide-react";
import { EditCollectionBtn } from "@/components/blocks/buttons/EditCollectionBtn";

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
        retrieveItems {
          dateAdded
          id
          article {
            slug
            title
            views
            createdAt
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
                className="hover:border-primary transition-all"
              >
                <CardContent className="p-6 flex flex-col sm:flex-row gap-4">
                  {/* <div className="flex-shrink-0">
                    <Avatar className="h-24 w-full sm:w-24 rounded-md aspect-video">
                      <AvatarFallback className="rounded-md bg-muted text-lg font-medium">
                        {article.title.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </div> */}
                  <div className="space-y-2 flex-1">
                    <Link href={`/user/${username}/article/${article.slug}`}>
                      <h3 className="font-medium text-lg hover:underline">
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
