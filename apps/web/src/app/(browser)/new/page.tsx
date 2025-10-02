"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { FileText, BookOpen, FolderPlus, Plus } from "lucide-react";
import Link from "next/link";
import { NewArticleButton } from "@/components/blocks/buttons/NewArticleBtn";
import { useUser } from "@/hooks/use-user";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { gql } from "@apollo/client";
import client from "@/lib/apolloClient";
import { toast } from "@/hooks/use-toast";

export default function NewPage() {
  const { user } = useUser();
  const router = useRouter();
  const [isCollectionCreateOpen, setIsCollectionCreateOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [collectionData, setCollectionData] = useState({
    name: "",
    isPublic: false,
  });

  const CREATE_COLLECTION_MUTATION = gql`
    mutation MyMutation($name: String!, $isPublic: Boolean!) {
      createCollection(name: $name, isPublic: $isPublic) {
        id
        name
      }
    }
  `;

  const handleNewNotebook = () => {
    if (!user?.username) {
      toast({
        title: "Authentication Required",
        description: "Please log in to create a notebook.",
        variant: "destructive",
      });
      return;
    }
    router.push(`/new/notebook`);
  };

  const handleCreateCollection = async () => {
    if (!user?.username) {
      toast({
        title: "Authentication Required", 
        description: "Please log in to create a collection.",
        variant: "destructive",
      });
      return;
    }
    
    if (isCreating || !collectionData.name.trim()) return;

    setIsCreating(true);

    try {
      const { data } = await client.mutate({
        mutation: CREATE_COLLECTION_MUTATION,
        variables: {
          name: collectionData.name,
          isPublic: collectionData.isPublic,
        },
      });
      toast({
        title: "Collection created!",
        description: `"${collectionData.name}" was added successfully.`,
        variant: "default",
      });
      setCollectionData({ name: "", isPublic: false }); // Reset form
      setIsCollectionCreateOpen(false);
      
      // Optionally redirect to the new collection
      if (data?.createCollection?.id && user?.username) {
        router.push(`/user/${user.username}/collection/${data.createCollection.id}`);
      }
    } catch (error) {
      console.error("Error creating collection", error);
      toast({
        title: "Error",
        description: "Failed to create collection. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tight mb-4">
            Create Something New
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Choose what you'd like to create. Whether it's a quick article, an organized notebook, or a curated collection.
          </p>
        </div>

        {/* Main Action Cards */}
        <div className="grid gap-6 md:grid-cols-3 mb-8">
          {/* Article Card */}
          <Card className="group hover:shadow-lg transition-all duration-200 hover:scale-[1.02] cursor-pointer border-2 hover:border-primary/20">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto mb-4 p-4 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors duration-200">
                <FileText className="h-8 w-8 text-primary" />
              </div>
              <CardTitle className="text-xl">Article</CardTitle>
              <CardDescription className="text-base">
                Write and share your thoughts, tutorials, or stories with the community.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="w-full [&>button]:w-full [&>button]:bg-primary [&>button]:text-primary-foreground [&>button]:hover:bg-primary/90">
                <NewArticleButton>
                  <Plus className="h-4 w-4" />
                  <span>Create Article</span>
                </NewArticleButton>
              </div>
            </CardContent>
          </Card>

          {/* Notebook Card */}
          <Card className="group hover:shadow-lg transition-all duration-200 hover:scale-[1.02] cursor-pointer border-2 hover:border-primary/20">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto mb-4 p-4 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors duration-200">
                <BookOpen className="h-8 w-8 text-primary" />
              </div>
              <CardTitle className="text-xl">Notebook</CardTitle>
              <CardDescription className="text-base">
                Create an organized space for multiple related articles and notes.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <Button 
                onClick={handleNewNotebook}
                className="w-full"
              >
                <Plus className="h-4 w-4" />
                <span>Create Notebook</span>
              </Button>
            </CardContent>
          </Card>

          {/* Collection Card */}
          <Card className="group hover:shadow-lg transition-all duration-200 hover:scale-[1.02] cursor-pointer border-2 hover:border-primary/20">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto mb-4 p-4 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors duration-200">
                <FolderPlus className="h-8 w-8 text-primary" />
              </div>
              <CardTitle className="text-xl">Collection</CardTitle>
              <CardDescription className="text-base">
                Curate and organize articles from yourself and others into themed collections.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <Button 
                onClick={() => {
                  if (!user?.username) {
                    toast({
                      title: "Authentication Required",
                      description: "Please log in to create a collection.",
                      variant: "destructive",
                    });
                    return;
                  }
                  setIsCollectionCreateOpen(true);
                }}
                className="w-full"
              >
                <Plus className="h-4 w-4" />
                <span>Create Collection</span>
              </Button>
            </CardContent>
          </Card>
        </div>

        <Separator className="my-8" />

        {/* Additional Information */}
        <div className="gap-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Getting Started</h3>
            <ul className="space-y-2 text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="block w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0"></span>
                <span><strong>Articles</strong> are perfect for individual pieces of content like blog posts, tutorials, or stories.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="block w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0"></span>
                <span><strong>Notebooks</strong> help you organize related content into structured, multi-page documents.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="block w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0"></span>
                <span><strong>Collections</strong> let you curate and bookmark articles from across the platform.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Collection Creation Dialog */}
      <Dialog
        open={isCollectionCreateOpen}
        onOpenChange={setIsCollectionCreateOpen}
      >
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>New Collection</DialogTitle>
            <DialogDescription>
              Create a new collection to organize and curate articles.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="collection-name">Name</Label>
              <Input
                id="collection-name"
                value={collectionData.name}
                onChange={(e) =>
                  setCollectionData({ ...collectionData, name: e.target.value })
                }
                placeholder="Enter collection name"
                disabled={isCreating}
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="public-collection"
                checked={collectionData.isPublic}
                onCheckedChange={(checked) =>
                  setCollectionData({ ...collectionData, isPublic: checked })
                }
                disabled={isCreating}
              />
              <Label htmlFor="public-collection">Public Collection</Label>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsCollectionCreateOpen(false)}
              disabled={isCreating}
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateCollection}
              disabled={!collectionData.name.trim() || isCreating}
              className="min-w-[80px]"
            >
              {isCreating ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
              ) : (
                "Create"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
