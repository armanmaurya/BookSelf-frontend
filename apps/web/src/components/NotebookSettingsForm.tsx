"use client";

import React, { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import {
  Save,
  Upload,
  X,
  Trash2,
  AlertTriangle,
  ImageIcon,
  Settings,
  FileText,
  Calendar,
  User,
  BookOpen,
  Download,
  Copy,
  ExternalLink,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import client from "@/lib/apolloClient";
import { gql } from "@apollo/client";
import { formatDate } from "@/lib/dateUtils";

const normalizeImageUrl = (url: string | null | undefined) => {
  if (!url) return null;
  if (/^https?:\/\//i.test(url) || url.startsWith("data:")) {
    return url;
  }

  const baseUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!baseUrl) return url;

  const sanitizedBase = baseUrl.replace(/\/$/, "");
  const sanitizedPath = url.replace(/^\//, "");

  return `${sanitizedBase}/${sanitizedPath}`;
};

const withCacheBuster = (url: string) => {
  try {
    const parsed = new URL(url);
    parsed.searchParams.set("cb", Date.now().toString());
    return parsed.toString();
  } catch (error) {
    const separator = url.includes("?") ? "&" : "?";
    return `${url}${separator}cb=${Date.now()}`;
  }
};

interface NotebookData {
  id: string;
  name: string;
  slug: string;
  overview: string;
  cover: string | null;
  createdAt: string;
  pagesCount: number;
  user: {
    firstName: string;
    lastName: string;
    username: string;
    isSelf: boolean;
  };
}

interface NotebookSettingsFormProps {
  notebookData: NotebookData;
  username: string;
  notebookSlug: string;
}

export default function NotebookSettingsForm({
  notebookData,
  username,
  notebookSlug,
}: NotebookSettingsFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [name, setName] = useState(notebookData.name);
  const [overview, setOverview] = useState(notebookData.overview);
  const [thumbnail, setThumbnail] = useState<string | null>(
    normalizeImageUrl(notebookData.cover)
  );
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const UPDATE_NOTEBOOK_MUTATION = gql`
    mutation UpdateNotebook(
      $slug: String!
      $name: String!
      $overview: String
    ) {
      updateNotebook(
        slug: $slug
        name: $name
        overview: $overview
      ) {
        ... on NotebookType {
          id
          name
          slug
          overview
        }
      }
    }
  `;

  const DELETE_NOTEBOOK_MUTATION = gql`
    mutation DeleteNotebook($slug: String!) {
      deleteNotebook(slug: $slug)
    }
  `;

  const { toast } = useToast();
  const router = useRouter();

  const canEdit = notebookData.user.isSelf;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canEdit) return;

    setIsSubmitting(true);
    try {
      // Upload thumbnail if a new file is selected
      if (thumbnailFile) {
        await handleThumbnailUpload(thumbnailFile);
      }

      // Update notebook using GraphQL
      const { data, errors } = await client.mutate({
        mutation: UPDATE_NOTEBOOK_MUTATION,
        variables: {
          slug: notebookSlug,
          name: name.trim(),
          overview: overview.trim(),
        },
      });

      if (errors && errors.length > 0) {
        throw new Error(errors[0].message);
      }

      toast({
        title: "Notebook updated",
        description: "Your notebook settings have been saved successfully.",
      });

      // If the slug changed, redirect to new URL
      if (data?.updateNotebook?.slug !== notebookSlug) {
        router.push(
          `/user/${username}/notebook/${data.updateNotebook.slug}/settings`
        );
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update notebook.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleThumbnailUpload = async (file: File) => {
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please select an image smaller than 5MB.",
        variant: "destructive",
      });
      return;
    }

    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/notebook/cover/${notebookSlug}/`,
        {
          method: "POST",
          credentials: "include",
          body: formData,
        }
      );

      if (!res.ok) throw new Error("Upload failed");

      const data = await res.json();
      const normalizedUrl = normalizeImageUrl(
        data.image_url ?? data.imageUrl ?? null
      );
      if (normalizedUrl) {
        setThumbnail(withCacheBuster(normalizedUrl));
      }
      setThumbnailFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      toast({
        title: "Cover Updated",
        description: "Your notebook cover was uploaded successfully.",
      });
    } catch (error) {
      toast({
        title: "Upload Failed",
        description: "There was an error uploading the cover.",
        variant: "destructive",
      });
      throw error; // Re-throw to handle in parent
    }
  };

  const handleThumbnailDelete = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/notebook/cover/${notebookSlug}/`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!res.ok) throw new Error("Delete failed");

      setThumbnail(null);
      setThumbnailFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      toast({
        title: "Cover Removed",
        description: "Your notebook cover was removed successfully.",
      });
    } catch (error) {
      toast({
        title: "Delete Failed",
        description: "There was an error removing the cover.",
        variant: "destructive",
      });
    }
  };

  const handleThumbnailChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      setThumbnailFile(file);

      const reader = new FileReader();
      reader.onload = (e) => {
        setThumbnail(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
    event.target.value = "";
  };

  const handleDeleteNotebook = async () => {
    if (deleteConfirmText !== notebookData.name) {
      toast({
        title: "Confirmation failed",
        description:
          "Please type the notebook name exactly to confirm deletion.",
        variant: "destructive",
      });
      return;
    }

    setIsDeleting(true);
    try {
      const { errors } = await client.mutate({
        mutation: DELETE_NOTEBOOK_MUTATION,
        variables: { slug: notebookSlug },
      });

      if (errors && errors.length > 0) {
        throw new Error(errors[0].message);
      }

      toast({
        title: "Notebook deleted",
        description: "Your notebook has been permanently deleted.",
      });

      router.push(`/user/${username}/notebook`);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete notebook.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const copyShareLink = () => {
    const shareUrl = `${window.location.origin}/user/${username}/notebook/${notebookSlug}`;
    navigator.clipboard.writeText(shareUrl);
    toast({
      title: "Link copied",
      description: "Notebook share link copied to clipboard.",
    });
  };

  return (
    <div className="container max-w-4xl mx-auto py-8 px-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Settings className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Notebook Settings</h1>
            <p className="text-muted-foreground">Manage {notebookData.name}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" asChild>
            <Link href={`/user/${username}/notebook/${notebookSlug}`}>
              <ExternalLink className="h-4 w-4 mr-2" />
              View Notebook
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-8">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Basic Information
            </CardTitle>
            <CardDescription>
              Update your notebook's basic details
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Notebook Name */}
              <div className="space-y-2">
                <Label htmlFor="name">Notebook Name *</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter notebook name"
                  disabled={!canEdit}
                  required
                  maxLength={100}
                />
                <p className="text-xs text-muted-foreground">
                  {name.length}/100 characters
                </p>
              </div>

              {/* Overview */}
              <div className="space-y-2">
                <Label htmlFor="overview">Overview</Label>
                <Textarea
                  id="overview"
                  value={overview}
                  onChange={(e) => setOverview(e.target.value)}
                  placeholder="Describe what your notebook is about..."
                  rows={4}
                  disabled={!canEdit}
                  maxLength={500}
                />
                <p className="text-xs text-muted-foreground">
                  {overview.length}/500 characters
                </p>
              </div>

              {/* Thumbnail */}
              <div className="space-y-4">
                <Label>Cover Image</Label>
                <div className="flex items-start gap-4">
                  {/* Thumbnail Preview */}
                  <div className="relative">
                    {thumbnail ? (
                      <div className="relative w-24 h-32 rounded-lg overflow-hidden border-2 border-border">
                        <Image
                          key={thumbnail}
                          src={thumbnail}
                          alt="Cover image"
                          fill
                          className="object-cover"
                        />
                        {canEdit && (
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                type="button"
                                variant="destructive"
                                size="sm"
                                className="absolute top-1 right-1 h-6 w-6 p-0"
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle className="flex items-center gap-2">
                                  <Trash2 className="h-5 w-5 text-destructive" />
                                  Remove Cover Image
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to remove the cover image? This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={handleThumbnailDelete}
                                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                >
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Remove Cover
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        )}
                      </div>
                    ) : (
                      <div className="w-24 h-32 rounded-lg border-2 border-dashed border-border bg-muted/50 flex items-center justify-center">
                        <ImageIcon className="h-6 w-6 text-muted-foreground" />
                      </div>
                    )}
                  </div>

                  {/* Upload Controls */}
                  {canEdit && (
                    <div className="space-y-2">
                      <div>
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={handleThumbnailChange}
                          ref={fileInputRef}
                          className="hidden"
                          id="thumbnail-upload"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="cursor-pointer"
                          onClick={() => fileInputRef.current?.click()}
                        >
                          <Upload className="h-4 w-4 mr-2" />
                          {thumbnail ? "Change" : "Upload"}
                        </Button>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Max 5MB, JPG/PNG
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Save Button */}
              {canEdit && (
                <div className="flex justify-end pt-4 border-t">
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent mr-2" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Save Changes
                      </>
                    )}
                  </Button>
                </div>
              )}
            </form>
          </CardContent>
        </Card>

        {/* Notebook Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Notebook Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-medium">Author</Label>
                  <div className="flex items-center gap-2 mt-1">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span>
                      {notebookData.user.firstName} {notebookData.user.lastName}
                    </span>
                    <Badge variant="secondary" className="text-xs">
                      @{notebookData.user.username}
                    </Badge>
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium">Created</Label>
                  <div className="flex items-center gap-2 mt-1">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>{formatDate(notebookData.createdAt)}</span>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-medium">Pages</Label>
                  <div className="flex items-center gap-2 mt-1">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <span>{notebookData.pagesCount} pages</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common actions for your notebook</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Button
                variant="outline"
                onClick={copyShareLink}
                className="justify-start"
              >
                <Copy className="h-4 w-4 mr-2" />
                Copy Share Link
              </Button>

              <Button variant="outline" className="justify-start" asChild>
                <Link href={`/user/${username}/notebook/${notebookSlug}/edit`}>
                  <FileText className="h-4 w-4 mr-2" />
                  Edit Pages
                </Link>
              </Button>

              <Button variant="outline" className="justify-start" disabled>
                <Download className="h-4 w-4 mr-2" />
                Export PDF
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Danger Zone */}
        {canEdit && (
          <Card className="border-destructive/20 bg-destructive/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-destructive">
                <AlertTriangle className="h-5 w-5" />
                Danger Zone
              </CardTitle>
              <CardDescription>
                Irreversible actions for this notebook
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between p-4 border border-destructive/20 rounded-lg bg-background">
                <div>
                  <h4 className="font-semibold text-destructive">
                    Delete Notebook
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Permanently delete this notebook and all its pages.
                  </p>
                </div>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" size="sm">
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle className="flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5 text-destructive" />
                        Delete Notebook
                      </AlertDialogTitle>
                      <AlertDialogDescription className="space-y-3">
                        <p>
                          This will permanently delete{" "}
                          <strong>"{notebookData.name}"</strong> and all its
                          pages. This action cannot be undone.
                        </p>
                        <div className="space-y-2">
                          <Label htmlFor="confirm-delete">
                            Type <strong>{notebookData.name}</strong> to
                            confirm:
                          </Label>
                          <Input
                            id="confirm-delete"
                            value={deleteConfirmText}
                            onChange={(e) =>
                              setDeleteConfirmText(e.target.value)
                            }
                            placeholder="Enter notebook name"
                          />
                        </div>
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel
                        onClick={() => setDeleteConfirmText("")}
                      >
                        Cancel
                      </AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleDeleteNotebook}
                        disabled={
                          deleteConfirmText !== notebookData.name || isDeleting
                        }
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        {isDeleting ? (
                          <>
                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent mr-2" />
                            Deleting...
                          </>
                        ) : (
                          <>
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete Notebook
                          </>
                        )}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
