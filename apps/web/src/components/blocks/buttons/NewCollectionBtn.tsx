import React, { useState } from "react";
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
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

interface NewCollectionBtnProps {
  onCreate: (name: string, isPublic: boolean) => void;
}

export const NewCollectionBtn = ({ onCreate }: NewCollectionBtnProps) => {
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

  const handleCreate = async () => {
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
        description: `\"${collectionData.name}\" was added successfully.`,
        variant: "default",
      });
      onCreate(collectionData.name, collectionData.isPublic);
      setCollectionData({ name: "", isPublic: false }); // Reset form
      setIsCollectionCreateOpen(false);
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
    <>
      <Button
        onClick={() => setIsCollectionCreateOpen(true)}
        className="mt-2"
        size="sm"
      >
        + New Collection
      </Button>

      <Dialog
        open={isCollectionCreateOpen}
        onOpenChange={setIsCollectionCreateOpen}
      >
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>New Collection</DialogTitle>
            <DialogDescription>
              Create a new collection to save this article.
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
              onClick={handleCreate}
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
    </>
  );
};
