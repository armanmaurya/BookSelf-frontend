"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { BookOpen, FileText, Image as ImageIcon } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { gql } from "@apollo/client";
import client from "@/lib/apolloClient";
import { useRouter } from "next/navigation";
import { useUser } from "@/hooks/use-user";

const Page = () => {
  const [formData, setFormData] = useState({
    name: "",
    overview: "",
  });
  const { user } = useUser();
  const router = useRouter();
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
    <div className="min-h-screen bg-gradient-to-b from-primary/5 via-background to-background">
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
                      Choose a name that clearly describes the notebook&apos;s topic
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
                      the notebook&apos;s scope
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <ImageIcon className="h-5 w-5 text-primary" />
                <h2 className="text-lg font-semibold text-foreground">
                  Cover Image
                </h2>
              </div>
              <p className="text-sm text-muted-foreground">
                Notebook covers can be added from settings after creation.
              </p>
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
