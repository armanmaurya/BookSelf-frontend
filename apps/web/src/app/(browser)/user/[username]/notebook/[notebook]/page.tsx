import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  BookOpen,
  Edit3,
  Share2,
  MoreVertical,
  Calendar,
  User,
  Eye,
  Lock,
  FileText,
  Clock,
  Star,
  Download,
  Copy,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import Image from "next/image";
import { createServerClient } from "@/lib/ServerClient";
import { gql } from "@apollo/client";
import { GraphQLData } from "@/types/graphql";
import { redirect } from "next/navigation";
import Link from "next/link";

const NotebookPage = async ({
  params,
}: {
  params: { username: string; notebook: string };
}) => {
  const { notebook, username } = await params;
  const QUERY_NOTEBOOK = gql`
    query GetNotebook($slug: String!) {
      notebook(slug: $slug) {
        cover
        createdAt
        hasPages
        id
        name
        overview
        pagesCount
        slug
        user {
          firstName
          lastName
          profilePicture
          email
          username
        }
      }
    }
  `;

  let data: GraphQLData | null = null;

  try {
    const result = await createServerClient().query({
      query: QUERY_NOTEBOOK,
      variables: { slug: notebook },
    });
    data = result.data;
  } catch (error) {
    console.error("Error fetching notebook data:", error);
    return redirect("/not-found");
  }

  const notebookData = data?.notebook;

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Improved Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6 mb-8">
          <div className="flex items-start space-x-4">
            <div className="p-3 bg-primary/10 rounded-xl">
              <BookOpen className="h-6 w-6 text-primary" />
            </div>
            <div className="space-y-2">
              <h1 className="text-3xl font-bold text-foreground">
                {notebookData?.name}
              </h1>
              <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                <div className="flex items-center space-x-2">
                  <User className="h-4 w-4" />
                  <span>
                    by {notebookData?.user?.firstName} {notebookData?.user?.lastName}
                  </span>
                </div>
                <div className="w-1 h-1 bg-muted-foreground rounded-full"></div>
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4" />
                  <span>Created {notebookData?.createdAt ? new Date(notebookData.createdAt).toLocaleDateString() : 'Unknown'}</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex items-center space-x-3">
            <Button className="bg-primary hover:bg-primary/90">
              <Edit3 className="h-4 w-4 mr-2" />
              Open Notebook
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <Download className="h-4 w-4 mr-2" />
                  Download PDF
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Copy className="h-4 w-4 mr-2" />
                  Copy Share Link
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <FileText className="h-4 w-4 mr-2" />
                  View Raw Content
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Cover Image */}
            {notebookData?.cover && (
              <div className="relative w-full h-80 rounded-xl overflow-hidden border">
                <Image
                  src={notebookData.cover}
                  alt={notebookData.name}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            )}

            {/* Overview */}
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold text-foreground">
                Overview
              </h2>
              <div className="prose prose-lg dark:prose-invert max-w-none">
                <p className="text-muted-foreground leading-relaxed text-base">
                  {notebookData?.overview}
                </p>
              </div>
            </div>

            {/* Quick Actions - Simplified */}
            <div className="bg-muted/30 rounded-lg p-6 border">
              <h3 className="text-lg font-medium text-foreground mb-4">
                Quick Actions
              </h3>
              <div className="grid sm:grid-cols-2 gap-3">
                <Link href={`/user/${username}/notebook/${notebook}/edit`} className="justify-start h-11">
                  <Edit3 className="h-4 w-4 mr-3" />
                  Edit
                </Link>
                <Button variant="outline" className="justify-start h-11">
                  <Download className="h-4 w-4 mr-3" />
                  Download PDF
                </Button>
                <Button variant="outline" className="justify-start h-11">
                  <Copy className="h-4 w-4 mr-3" />
                  Copy Share Link
                </Button>
                <Button variant="outline" className="justify-start h-11">
                  <FileText className="h-4 w-4 mr-3" />
                  View Raw Content
                </Button>
              </div>
            </div>
          </div>

          {/* Sidebar - Rest of your existing sidebar content remains the same */}
          <div className="space-y-6">
            {/* Stats */}
            <div className="bg-card border border-border rounded-lg p-6">
              <h3 className="text-lg font-medium text-card-foreground mb-4">
                Information
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Pages</span>
                  </div>
                  <span className="font-medium">
                    {notebookData?.pagesCount || 0}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <BookOpen className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Has Content</span>
                  </div>
                  <span className="font-medium">
                    {notebookData?.hasPages ? 'Yes' : 'No'}
                  </span>
                </div>
              </div>
            </div>

            {/* Author Info */}
            <div className="bg-card border border-border rounded-lg p-6">
              <h3 className="text-lg font-medium text-card-foreground mb-4">
                Author
              </h3>
              <div className="flex items-center space-x-3">
                {notebookData?.user.profilePicture ? (
                  <Image
                    src={notebookData.user.profilePicture}
                    alt={`${notebookData.user.firstName} ${notebookData.user.lastName}`}
                    width={40}
                    height={40}
                    className="rounded-full"
                  />
                ) : (
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <User className="h-5 w-5 text-primary" />
                  </div>
                )}
                <div>
                  <p className="font-medium text-card-foreground">
                    {notebookData?.user.firstName} {notebookData?.user.lastName}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    @{notebookData?.user.username}
                  </p>
                </div>
              </div>
              <Button variant="outline" size="sm" className="w-full mt-4">
                View Profile
              </Button>
            </div>

            {/* Metadata */}
            <div className="bg-card border border-border rounded-lg p-6">
              <h3 className="text-lg font-medium text-card-foreground mb-4">
                Details
              </h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-2 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Created:</span>
                  <span className="text-card-foreground">
                    {notebookData?.createdAt ? new Date(notebookData.createdAt).toLocaleDateString() : 'Unknown'}
                  </span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Slug:</span>
                  <span className="text-card-foreground font-mono text-xs">
                    {notebookData?.slug}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotebookPage;