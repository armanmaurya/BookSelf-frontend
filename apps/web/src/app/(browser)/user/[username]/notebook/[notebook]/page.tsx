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
    <div className="">
      <div className="w-full px-4 py-8">
        <div className="grid md:grid-cols-[320px_1fr] gap-8 max-w-full">
          {/* Left Side - Cover Image */}
          {notebookData?.cover ? (
            <div className="relative w-full max-w-[280px] aspect-[2/3] rounded-lg overflow-hidden shadow-md">
              <Image
                src={notebookData.cover}
                alt={notebookData.name || "Notebook cover"}
                fill
                className="object-cover"
                priority
              />
            </div>
          ) : (
            <div className="w-full max-w-[280px] aspect-[2/3] rounded-lg border-2 border-dashed border-border bg-muted/50 flex items-center justify-center">
              <BookOpen className="h-16 w-16 text-muted-foreground" />
            </div>
          )}

          {/* Right Side - Content */}
          <div className="p-8 space-y-6">
            {/* Badge and Actions Header */}
            <div className="flex items-start justify-between">
              <Badge
                variant="secondary"
                className="text-xs font-medium uppercase tracking-wide"
              >
                Novel
              </Badge>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon">
                  <Share2 className="h-4 w-4" />
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
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

            {/* Title and Metadata */}
            <div className="space-y-3">
              <h1 className="text-4xl font-bold text-foreground leading-tight">
                {notebookData?.name || "A Slice of Life"}
              </h1>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>
                  By {notebookData?.user?.firstName || "Arman"}{" "}
                  {notebookData?.user?.lastName || "Maurya"}
                </span>
                <span>•</span>
                <span>
                  Created{" "}
                  {notebookData?.createdAt
                    ? new Date(notebookData.createdAt).toLocaleDateString(
                        "en-US",
                        { year: "numeric", month: "numeric", day: "numeric" }
                      )
                    : "27/9/2025"}
                </span>
              </div>
            </div>

            {/* Overview Section */}
            <div className="space-y-3">
              <h2 className="text-lg font-semibold text-foreground">
                Overview
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                {notebookData?.overview ||
                  "Some things are there which are good for u and u don't care. This book delves into the seemingly mundane aspects of daily existence, uncovering the profound beauty and meaning hidden within ordinary moments."}
              </p>
            </div>

            {/* Information and Author Grid */}
            <div className="grid sm:grid-cols-2 gap-6">
              {/* Information */}
              <div className="space-y-3">
                <h3 className="text-base font-semibold text-foreground">
                  Information
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">Pages</span>
                    <span className="font-medium text-foreground">
                      {notebookData?.pagesCount || 11}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">Has Content</span>
                    <span className="font-medium text-green-600">
                      {notebookData?.hasPages ? "Yes" : "Yes"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Author */}
              <div className="space-y-3">
                <h3 className="text-base font-semibold text-foreground">
                  Author
                </h3>
                <div className="flex items-center gap-3">
                  {notebookData?.user?.profilePicture ? (
                    <Image
                      src={notebookData.user.profilePicture}
                      alt={`${notebookData.user.firstName} ${notebookData.user.lastName}`}
                      width={48}
                      height={48}
                      className="rounded-full"
                    />
                  ) : (
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                      <User className="h-6 w-6 text-primary" />
                    </div>
                  )}
                  <div>
                    <p className="font-medium text-foreground">
                      {notebookData?.user?.firstName || "Arman"}{" "}
                      {notebookData?.user?.lastName || "Maurya"}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      @{notebookData?.user?.username || "armanmaurya"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Details Section */}
            <div className="space-y-3 pt-4 border-t border-border">
              <h3 className="text-base font-semibold text-foreground">
                Details
              </h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Created:</span>
                  <span className="text-foreground">
                    {notebookData?.createdAt
                      ? new Date(notebookData.createdAt).toLocaleDateString(
                          "en-US",
                          { year: "numeric", month: "numeric", day: "numeric" }
                        )
                      : "27/9/2025"}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Slug:</span>
                  <span className="text-foreground font-mono text-xs">
                    {notebookData?.slug || "a-slice-of-life-2"}
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-3 pt-4">
              <Button variant="default" className="w-full" asChild>
                <Link href={`/user/${username}/notebook/${notebook}/read`}>
                  <BookOpen className="h-4 w-4 mr-2" />
                  Open Notebook
                </Link>
              </Button>
              <Button variant="outline" className="w-full" asChild>
                <Link href={`/user/${username}/notebook/${notebook}/edit`}>
                  <Edit3 className="h-4 w-4 mr-2" />
                  Edit
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotebookPage;
