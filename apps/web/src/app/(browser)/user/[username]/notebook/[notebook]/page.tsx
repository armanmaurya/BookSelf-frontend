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
  Settings,
  Settings2,
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
import { formatDate } from "@/lib/dateUtils";
import { BsGear } from "react-icons/bs";

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
          isSelf
        }
        indexPage {
          slug
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
        <div className="grid md:grid-cols-[310px_1fr] max-w-full">
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
          <div className="">
            {/* Title and Actions */}
            <div className="flex items-start justify-between gap-4 mb-6">
              <div className="space-y-3 flex-1">
                <h1 className="text-4xl font-bold text-foreground leading-tight">
                  {notebookData?.name || "A Slice of Life"}
                </h1>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>
                    Created{" "}
                    {notebookData?.createdAt
                      ? formatDate(notebookData.createdAt)
                      : "09/27/2025"}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon">
                  <Share2 className="h-4 w-4" />
                </Button>
                {notebookData?.user?.isSelf && (
                  <Button variant="ghost" size="icon">
                    <Link href={`/user/${username}/notebook/${notebook}/settings`}>
                      <BsGear className="h-4 w-4" />
                    </Link>
                  </Button>
                )}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {notebookData?.user?.isSelf && (
                      <>
                        <DropdownMenuItem asChild>
                          <Link href={`/user/${username}/notebook/${notebook}/settings`}>
                            <Settings className="h-4 w-4 mr-2" />
                            Settings
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                      </>
                    )}
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

            {/* Overview Section */}
            <div className="space-y-3 mb-6">
              <h2 className="text-lg font-semibold text-foreground">
                Overview
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                {notebookData?.overview ||
                  "Some things are there which are good for u and u don't care. This book delves into the seemingly mundane aspects of daily existence, uncovering the profound beauty and meaning hidden within ordinary moments."}
              </p>
            </div>

            {/* Author Section */}
            <div className="space-y-3 mb-6">
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

            {/* Details Section */}
            <div className="space-y-3 pt-4 border-t border-border mb-6">
              <h3 className="text-base font-semibold text-foreground">
                Details
              </h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Created:</span>
                  <span className="text-foreground">
                    {notebookData?.createdAt
                      ? formatDate(notebookData.createdAt)
                      : "09/27/2025"}
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className={`grid gap-3 ${notebookData?.user?.isSelf ? 'grid-cols-2' : 'grid-cols-1'}`}>
              {notebookData?.indexPage?.slug ? (
                <Button variant="default" className="w-full" asChild>
                  <Link
                    href={`/user/${username}/notebook/${notebook}/read/${notebookData.indexPage.slug}`}
                  >
                    <BookOpen className="h-4 w-4 mr-2" />
                    Open Notebook
                  </Link>
                </Button>
              ) : (
                <Button variant="default" className="w-full" disabled>
                  <BookOpen className="h-4 w-4 mr-2" />
                  No Pages Yet
                </Button>
              )}
              {notebookData?.user?.isSelf && (
                <Button variant="outline" className="w-full" asChild>
                  <Link href={`/user/${username}/notebook/${notebook}/edit`}>
                    <Edit3 className="h-4 w-4 mr-2" />
                    Edit Pages
                  </Link>
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotebookPage;
