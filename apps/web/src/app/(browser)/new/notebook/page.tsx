"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Upload,
  X,
  BookOpen,
  FileText,
  Image as ImageIcon,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import { gql } from "@apollo/client";
import client from "@/lib/apolloClient";
import { useRouter } from "next/navigation";
import { useUser } from "@/hooks/use-user";

const Page = () => {
  const [formData, setFormData] = useState({
    name: "",
    overview: "",
    cover: null as File | null,
  });
  const { user } = useUser();
  const router = useRouter();
  const [coverPreview, setCoverPreview] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const CREATE_NOTEBOOK_MUTATION = gql`
    mutation CreateNotebook($name: String!, $overview: String!) {
      createNotebook(name: $name, overview: $overview) {
        ... on NotebookType {
          id
          name
          cover
          createdAt
          hasPages
          slug
          pagesCount
          overview
        }
        ... on NotebookAuthenticationError {
          __typename
        }
      }
    }
  `;

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({ ...prev, cover: file }));

      // Create preview URL
      const reader = new FileReader();
      reader.onload = (e) => {
        setCoverPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeCover = () => {
    setFormData((prev) => ({ ...prev, cover: null }));
    setCoverPreview("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const response = await client.mutate({
      mutation: CREATE_NOTEBOOK_MUTATION,
      variables: {
        name: formData.name,
        overview: formData.overview,
      },
    });
    setIsSubmitting(false);
    if (response.data?.createNotebook) {
        console.log("Notebook created:", response.data.createNotebook);
        if (user?.username) {
          router.push(`/user/${user.username}/notebook/${response.data.createNotebook.slug}`);
        }
    }

    // route to notebook page
  };

  const isFormValid = formData.name.trim() && formData.overview.trim();

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-primary/10 rounded-lg">
              <BookOpen className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                Create New Notebook
              </h1>
              <p className="text-muted-foreground">
                Design your personal knowledge sanctuary
              </p>
            </div>
          </div>
          <Separator />
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Form */}
            <div className="lg:col-span-2 space-y-8">
              {/* Notebook Details Section */}
              <div className="space-y-4">
                <div className="flex items-center space-x-2 mb-6">
                  <FileText className="h-5 w-5 text-primary" />
                  <h2 className="text-xl font-semibold text-foreground">
                    Notebook Details
                  </h2>
                </div>

                <div className="space-y-6">
                  {/* Name Field */}
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-sm font-medium">
                      Notebook Name *
                    </Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Enter a meaningful name for your notebook..."
                      className="w-full"
                      required
                    />
                    <p className="text-xs text-muted-foreground">
                      Choose a name that clearly describes the notebook's topic
                      or purpose
                    </p>
                  </div>

                  {/* Overview Field */}
                  <div className="space-y-2">
                    <Label htmlFor="overview" className="text-sm font-medium">
                      Overview *
                    </Label>
                    <Textarea
                      id="overview"
                      name="overview"
                      value={formData.overview}
                      onChange={handleInputChange}
                      placeholder="Describe what this notebook will contain, its goals, and how you plan to use it..."
                      className="min-h-[120px] resize-none"
                      required
                    />
                    <p className="text-xs text-muted-foreground">
                      Provide a clear overview to help you and others understand
                      the notebook's scope
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Cover Upload Sidebar */}
            <div className="space-y-6">
              {/* Cover Upload Section */}
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <ImageIcon className="h-5 w-5 text-primary" />
                  <h2 className="text-lg font-semibold text-foreground">
                    Cover Image
                  </h2>
                </div>
                <p className="text-sm text-muted-foreground">
                  Add a visual identity to your notebook
                </p>

                <div className="space-y-4">
                  {!coverPreview ? (
                    <div className="relative">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleCoverChange}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        id="cover-upload"
                      />
                      <Label
                        htmlFor="cover-upload"
                        className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-border rounded-lg cursor-pointer bg-muted/30 hover:bg-muted/50 transition-colors"
                      >
                        <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                        <span className="text-sm font-medium text-foreground">
                          Upload Cover
                        </span>
                        <span className="text-xs text-muted-foreground mt-1">
                          PNG, JPG up to 5MB
                        </span>
                      </Label>
                    </div>
                  ) : (
                    <div className="relative">
                      <div className="relative w-full h-32 rounded-lg overflow-hidden">
                        <Image
                          src={coverPreview}
                          alt="Cover preview"
                          fill
                          className="object-cover"
                        />
                      </div>
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
                        onClick={removeCover}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              {/* Preview Section */}
              <div className="bg-muted/20 rounded-lg p-4 border border-border/40">
                <h3 className="text-sm font-medium mb-3">Preview</h3>
                <div className="space-y-3">
                  <div className="w-full h-20 bg-background rounded-md flex items-center justify-center border">
                    {coverPreview ? (
                      <div className="relative w-full h-full rounded-md overflow-hidden">
                        <Image
                          src={coverPreview}
                          alt="Preview"
                          fill
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <ImageIcon className="h-8 w-8 text-muted-foreground" />
                    )}
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm truncate">
                      {formData.name || "Untitled Notebook"}
                    </h4>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                      {formData.overview || "No description provided"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Submit Section */}
          <div className="flex justify-between items-center pt-6 border-t border-border">
            <div className="text-sm text-muted-foreground">
              <span className="text-destructive">*</span> Required fields
            </div>
            <div className="flex space-x-3">
              <Button type="button" variant="outline">
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={!isFormValid || isSubmitting}
                className="min-w-[120px]"
              >
                {isSubmitting ? "Creating..." : "Create Notebook"}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Page;
