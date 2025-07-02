"use client";
import { Button } from "@/components/ui/button";
import { PencilIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useState } from "react";
import { gql } from "@apollo/client";
import client from "@/lib/apolloClient";
import { useRouter } from "next/navigation";

interface EditCollectionBtnProps {
  id: string;
  initialName: string;
  initialDescription: string;
  initialIsPublic: boolean;
}

export const EditCollectionBtn = ({
  id,
  initialName,
  initialDescription,
  initialIsPublic,
}: EditCollectionBtnProps) => {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(initialName);
  const [description, setDescription] = useState(initialDescription);
  const [isPublic, setIsPublic] = useState(initialIsPublic);
  const [isSaving, setIsSaving] = useState(false);

  const router = useRouter();

  const UPDATE_COLLECTION_MUTATION = gql`
    mutation UpdateCollection(
      $id: Int!
      $name: String!
      $description: String!
      $isPublic: Boolean!
    ) {
      updateCollection(
        id: $id
        name: $name
        description: $description
        isPublic: $isPublic
      ) {
        id
      }
    }
  `;

  const handleUpdate = async () => {
    try {
      await client.mutate({
        mutation: UPDATE_COLLECTION_MUTATION,
        variables: {
          id: parseInt(id),
          name,
          description,
          isPublic,
        },
      });
    } catch (error) {
      console.error("Error updating collection:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await handleUpdate();
    setIsSaving(true);
    router.refresh(); // Refresh the page to reflect changes

    try {
      setOpen(false);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="text-muted-foreground hover:text-primary"
        >
          <PencilIcon className="h-4 w-4 mr-1" />
          Edit
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Collection</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="isPublic"
              checked={isPublic}
              onCheckedChange={setIsPublic}
            />
            <Label htmlFor="isPublic">Public Collection</Label>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isSaving}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSaving}>
              {isSaving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
