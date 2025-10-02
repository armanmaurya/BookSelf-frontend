"use client";
import { useCallback, useState, useEffect } from "react";
import { gql } from "@apollo/client";
import client from "@/lib/apolloClient";
import { useRouter } from "next/navigation";
import Tiptap from "@/components/TipTap";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Save, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export const NotebookEditor = ({
  content,
  title,
  notebookSlug,
  pagePath,
}: {
  title: string;
  content: string;
  notebookSlug: string;
  pagePath: string;
}) => {
  const [isEditorMounted, setIsEditorMounted] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [saveStatus, setSaveStatus] = useState<"saved" | "saving" | "error">("saved");

  const router = useRouter();
  const { toast } = useToast();

  const UPDATE_PAGE_MUTATION = gql`
    mutation UpdatePage($notebookSlug: String!, $pagePath: String!, $content: String, $title: String) {
      updatePage(notebookSlug: $notebookSlug, pagePath: $pagePath, content: $content, title: $title) {
        ... on PageType {
          id
          slug
          title
        }
      }
    }
  `;

  const UpdateContent = useCallback(
    async (body: string) => {
      setSaveStatus("saving");
      try {
        const { data } = await client.mutate({
          mutation: UPDATE_PAGE_MUTATION,
          variables: { 
            content: body, 
            title: null, 
            notebookSlug,
            pagePath 
          },
        });
        if (data) {
          setSaveStatus("saved");
          setLastSaved(new Date());
        }
      } catch (error) {
        console.error("Error updating content:", error);
        setSaveStatus("error");
        toast({
          title: "Error",
          description: "Failed to save content",
          variant: "destructive",
        });
      }
    },
    [notebookSlug, pagePath, UPDATE_PAGE_MUTATION, toast]
  );

  const UpdateTitle = useCallback(
    async (newTitle: string) => {
      setSaveStatus("saving");
      try {
        const { data } = await client.mutate({
          mutation: UPDATE_PAGE_MUTATION,
          variables: { 
            content: null, 
            title: newTitle, 
            notebookSlug,
            pagePath 
          },
        });
        if (data) {
          setSaveStatus("saved");
          setLastSaved(new Date());
        }
      } catch (error) {
        console.error("Error updating title:", error);
        setSaveStatus("error");
        toast({
          title: "Error",
          description: "Failed to save title",
          variant: "destructive",
        });
      }
    },
    [notebookSlug, pagePath, UPDATE_PAGE_MUTATION, toast]
  );

  const getTimeElapsed = () => {
    if (!lastSaved) return "";
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - lastSaved.getTime()) / (1000 * 60));
    if (diffInMinutes === 0) return "just now";
    if (diffInMinutes === 1) return "1 minute ago";
    if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;
    const hours = Math.floor(diffInMinutes / 60);
    return hours === 1 ? "1 hour ago" : `${hours} hours ago`;
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setLastSaved((prev) => (prev ? new Date(prev) : null));
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    setLastSaved(new Date());
    // Mark editor as mounted after a brief delay to allow TipTap to initialize
    const timer = setTimeout(() => {
      setIsEditorMounted(true);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const SaveIndicator = () => (
    <div className="flex items-center gap-2 text-sm text-muted-foreground">
      {saveStatus === "saving" && (
        <>
          <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
          <span>Saving...</span>
        </>
      )}
      {saveStatus === "saved" && (
        <>
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <span>Saved {getTimeElapsed()}</span>
        </>
      )}
      {saveStatus === "error" && (
        <>
          <div className="w-2 h-2 bg-red-500 rounded-full"></div>
          <span>Error saving</span>
        </>
      )}
    </div>
  );

  return (
    <div className="h-full flex flex-col relative">
      {/* Loading Overlay with smooth fade out */}
      <div
        className={cn(
          "absolute inset-0 z-50 flex items-center justify-center",
          "transition-opacity duration-500 ease-in-out",
          isEditorMounted ? "opacity-0 pointer-events-none" : "opacity-100"
        )}
      >
        <div 
          className={cn(
            "flex flex-col items-center gap-3",
            "transition-all duration-500 ease-in-out",
            isEditorMounted ? "scale-95 opacity-0" : "scale-100 opacity-100"
          )}
        >
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="text-sm text-muted-foreground">
            Loading editor...
          </span>
        </div>
      </div>

      {/* Editor Content with smooth fade in */}
      <div 
        className={cn(
          "h-full flex flex-col",
          "transition-opacity duration-500 ease-in-out delay-100",
          isEditorMounted ? "opacity-100" : "opacity-0"
        )}
      >
        {/* Toolbar */}
        <div className="flex items-center justify-between px-6 py-3 border-b">
          <div className="flex items-center gap-4">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => {
                UpdateContent(content);
                UpdateTitle(title);
              }}
              className="flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span className="hidden sm:inline">Save</span>
            </Button>
          </div>

          <SaveIndicator />
        </div>

        {/* Editor */}
        <div className="flex-1 overflow-y-auto">
          <Tiptap
            initialContent={content}
            initialTitle={title}
            onTitleChange={UpdateTitle}
            onContentChange={UpdateContent}
            thumbnail={null}
            onThumbnailRemove={() => {}}
          />
        </div>
      </div>
    </div>
  );
};
