"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
  Eye,
  EyeOff,
  Calendar,
  User,
  BookOpen,
  Download,
  Copy,
  MoreHorizontal,
} from "lucide-react";
import Image from "next/image";
import { createServerClient } from "@/lib/ServerClient";
import { gql } from "@apollo/client";
import client from "@/lib/apolloClient";
import { API_ENDPOINT } from "@/app/utils";
import Cookies from "js-cookie";
import { formatDate } from "@/lib/dateUtils";

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

interface NotebookSettingsProps {
  notebookData: NotebookData;
  username: string;
  notebookSlug: string;
}

export default function NotebookSettings({ 
  notebookData, 
  username, 
  notebookSlug 
}: NotebookSettingsProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [name, setName] = useState(notebookData.name);
  const [overview, setOverview] = useState(notebookData.overview);
  const [thumbnail, setThumbnail] = useState<string | null>(notebookData.cover);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [isPrivate, setIsPrivate] = useState(false); // This would need to come from API
  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  const [isExporting, setIsExporting] = useState(false);
  
  const { toast } = useToast();
  const router = useRouter();

  // Check if user can edit (is owner)
  const canEdit = notebookData.user.isSelf;

  const UPDATE_NOTEBOOK_MUTATION = gql`
    mutation UpdateNotebook($slug: String!, $name: String, $overview: String, $cover: String) {
      updateNotebook(slug: $slug, name: $name, overview: $overview, cover: $cover) {
        id
        name
        slug
        overview
        cover
      }
    }
  `;

  const DELETE_NOTEBOOK_MUTATION = gql`
    mutation DeleteNotebook($slug: String!) {
      deleteNotebook(slug: $slug)
    }
  `;

  const handleSave = async () => {
    if (!canEdit) {
      toast({
        title: "Permission denied",
        description: "You don't have permission to edit this notebook.",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);
    try {
      let coverUrl = thumbnail;

      // Upload thumbnail if a new file is selected
      if (thumbnailFile) {
        const formData = new FormData();
        formData.append("image", thumbnailFile);
        
        const csrf = Cookies.get("csrftoken");
        const uploadRes = await fetch(API_ENDPOINT.uploadProfilePicture.url, {
          method: "POST",
          body: formData,
          headers: {
            "X-CSRFToken": `${csrf}`,
          },
          credentials: "include",
        });

        if (uploadRes.ok) {
          const uploadData = await uploadRes.json();
          coverUrl = uploadData.url;
        } else {
          throw new Error("Failed to upload thumbnail");
        }
      }

      const { data, errors } = await client.mutate({
        mutation: UPDATE_NOTEBOOK_MUTATION,
        variables: {
          slug: notebookSlug,
          name: name.trim(),
          overview: overview.trim(),
          cover: coverUrl,
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
        router.push(`/user/${username}/notebook/${data.updateNotebook.slug}/settings`);
      }
    } catch (error: any) {
      console.error("Error updating notebook:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to update notebook. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleThumbnailUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast({
          title: "File too large",
          description: "Please select an image smaller than 5MB.",
          variant: "destructive",
        });
        return;
      }

      if (!file.type.startsWith("image/")) {
        toast({
          title: "Invalid file type",
          description: "Please select an image file.",
          variant: "destructive",
        });
        return;
      }

      setThumbnailFile(file);
      
      // Create preview URL
      const reader = new FileReader();
      reader.onload = (e) => {
        setThumbnail(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveThumbnail = () => {
    setThumbnail(null);
    setThumbnailFile(null);
  };

  const handleDeleteNotebook = async () => {
    if (deleteConfirmText !== notebookData.name) {
      toast({
        title: "Confirmation failed",
        description: "Please type the notebook name exactly to confirm deletion.",
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
      console.error("Error deleting notebook:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to delete notebook. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleExportNotebook = async () => {
    setIsExporting(true);
    try {
      // This would need to be implemented on the backend
      const response = await fetch(`${API_ENDPOINT.notebook.url}/${username}/${notebookSlug}/export`, {
        method: "GET",
        credentials: "include",
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${notebookData.name}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);

        toast({
          title: "Export successful",
          description: "Your notebook has been exported as PDF.",
        });
      } else {
        throw new Error("Export failed");
      }
    } catch (error) {
      toast({
        title: "Export failed",
        description: "Unable to export notebook. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  const copyShareLink = () => {
    const shareUrl = `${window.location.origin}/user/${username}/notebook/${notebookSlug}`;
    navigator.clipboard.writeText(shareUrl);
    toast({
      title: "Link copied",
      description: "Notebook share link has been copied to clipboard.",
    });
  };

  return (
    <div className="container max-w-4xl mx-auto py-8 px-4">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="p-2 bg-primary/10 rounded-lg">
          <Settings className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h1 className="text-3xl font-bold">Notebook Settings</h1>
          <p className="text-muted-foreground">
            Manage your notebook preferences and settings
          </p>
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
              Update your notebook's name, description, and thumbnail
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Notebook Name */}
            <div className="space-y-2">
              <Label htmlFor="name">Notebook Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter notebook name"
                disabled={!canEdit}
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
              <Label>Thumbnail</Label>
              <div className="flex items-start gap-4">
                {/* Thumbnail Preview */}
                <div className="relative">
                  {thumbnail ? (
                    <div className="relative w-32 h-48 rounded-lg overflow-hidden border-2 border-border">
                      <Image
                        src={thumbnail}
                        alt="Notebook thumbnail"
                        fill
                        className="object-cover"
                      />
                      {canEdit && (
                        <Button
                          variant="destructive"
                          size="sm"
                          className="absolute top-2 right-2 h-6 w-6 p-0"
                          onClick={handleRemoveThumbnail}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                  ) : (
                    <div className="w-32 h-48 rounded-lg border-2 border-dashed border-border bg-muted/50 flex items-center justify-center">
                      <ImageIcon className="h-8 w-8 text-muted-foreground" />
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
                        onChange={handleThumbnailUpload}
                        className="hidden"
                        id="thumbnail-upload"
                      />
                      <Label htmlFor="thumbnail-upload" asChild>
                        <Button variant="outline" className="cursor-pointer">
                          <Upload className="h-4 w-4 mr-2" />
                          {thumbnail ? "Change" : "Upload"} Thumbnail
                        </Button>
                      </Label>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Recommended: 400×600px, max 5MB
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Save Button */}
            {canEdit && (
              <div className="flex justify-end pt-4">
                <Button onClick={handleSave} disabled={isSaving}>
                  {isSaving ? (
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
                    <span>{notebookData.user.firstName} {notebookData.user.lastName}</span>
                    <Badge variant="secondary">@{notebookData.user.username}</Badge>
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
                <div>
                  <Label className="text-sm font-medium">Notebook ID</Label>
                  <div className="flex items-center gap-2 mt-1">
                    <code className="px-2 py-1 bg-muted rounded text-sm">{notebookData.slug}</code>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MoreHorizontal className="h-5 w-5" />
              Actions
            </CardTitle>
            <CardDescription>
              Quick actions for your notebook
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Button
                variant="outline"
                onClick={handleExportNotebook}
                disabled={isExporting}
                className="justify-start"
              >
                {isExporting ? (
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent mr-2" />
                ) : (
                  <Download className="h-4 w-4 mr-2" />
                )}
                Export as PDF
              </Button>
              
              <Button
                variant="outline"
                onClick={copyShareLink}
                className="justify-start"
              >
                <Copy className="h-4 w-4 mr-2" />
                Copy Share Link
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Danger Zone */}
        {canEdit && (
          <Card className="border-destructive/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-destructive">
                <AlertTriangle className="h-5 w-5" />
                Danger Zone
              </CardTitle>
              <CardDescription>
                Irreversible and destructive actions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 border border-destructive/20 rounded-lg bg-destructive/5">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-semibold text-destructive">Delete Notebook</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        Permanently delete this notebook and all its pages. This action cannot be undone.
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
                              This action cannot be undone. This will permanently delete the notebook
                              <strong> "{notebookData.name}" </strong>
                              and all of its pages.
                            </p>
                            <div className="space-y-2">
                              <Label htmlFor="confirm-delete">
                                Type <strong>{notebookData.name}</strong> to confirm:
                              </Label>
                              <Input
                                id="confirm-delete"
                                value={deleteConfirmText}
                                onChange={(e) => setDeleteConfirmText(e.target.value)}
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
                            disabled={deleteConfirmText !== notebookData.name || isDeleting}
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
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}