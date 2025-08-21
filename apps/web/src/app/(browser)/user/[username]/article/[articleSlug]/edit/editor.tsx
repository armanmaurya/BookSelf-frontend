"use client";
import { useCallback, useState, useEffect } from "react";
import Cookies from "js-cookie";
import { API_ENDPOINT } from "@/app/utils";
import { useUser } from "@/hooks/use-user";
import { gql } from "@apollo/client";
import client from "@/lib/apolloClient";
import nProgress from "nprogress";
import { useRouter } from "next/navigation";
import Tiptap from "@/components/TipTap";
import Link from "next/link";
import { FiSettings } from "react-icons/fi";
import { FaImage } from "react-icons/fa";

// shadcn components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

export const Editor = ({
  content,
  slug,
  title,
  status,
  imageUrl,
}: {
  title: string;
  content: string;
  slug: string;
  status: string;
  imageUrl: string;
}) => {
  const [articleSlug, setArticleSlug] = useState<string | null>(slug);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [saveStatus, setSaveStatus] = useState<"saved" | "saving" | "error">("saved");
  const [thumbnail, setThumbnail] = useState<string | null>(imageUrl || null);

  const { user } = useUser();
  const router = useRouter();
  const { toast } = useToast();

  const MUTATION = gql`
    mutation MyMutation($content: String, $title: String, $slug: String!) {
      updateArticle(title: $title, content: $content, slug: $slug) {
        slug
      }
    }
  `;

  const UpdateContent = useCallback(
    async (body: string) => {
      setSaveStatus("saving");
      try {
        const { data } = await client.mutate({
          mutation: MUTATION,
          variables: { content: body, title: null, slug: articleSlug },
        });
        if (data) {
          setSaveStatus("saved");
          setLastSaved(new Date());
        }
      } catch {
        setSaveStatus("error");
      }
    },
    [articleSlug, MUTATION]
  );

  const UpdateTitle = useCallback(
    async (title: string) => {
      setSaveStatus("saving");
      try {
        const { data } = await client.mutate({
          mutation: MUTATION,
          variables: { content: null, title: title, slug: articleSlug },
        });
        if (data) {
          const slug = data.updateArticle.slug;
          setArticleSlug(slug);
          setSaveStatus("saved");
          setLastSaved(new Date());
        }
      } catch {
        setSaveStatus("error");
      }
    },
    [articleSlug, MUTATION]
  );

  const PublishArticleMutation = gql`
    mutation MyMutation($slug: String!) {
      publishArticle(slug: $slug)
    }
  `;

  const PublishArticle = async () => {
    const { data } = await client.mutate({
      mutation: PublishArticleMutation,
      variables: { slug: articleSlug },
    });
    if (data.publishArticle != "") {
      nProgress.start();
      router.push(`/user/${user?.username}/article/${data.publishArticle}`);
    }
  };

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

  const handleThumbnailUpload = async (file: File) => {
    if (!articleSlug) return;
    const formData = new FormData();
    formData.append("image", file);

    try {
      nProgress.start();
      const res = await fetch(`${API_ENDPOINT.base.url}/article/${articleSlug}/thumbnail/`, {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      if (!res.ok) throw new Error("Upload failed");

      const data = await res.json();
      setThumbnail(data.image_url);

      toast({
        title: "Thumbnail Updated",
        description: "Your thumbnail was uploaded successfully.",
      });
    } catch {
      toast({
        title: "Upload Failed",
        description: "There was an error uploading the thumbnail.",
        variant: "destructive",
      });
    } finally {
      nProgress.done();
    }
  };

  const handleThumbnailDelete = async () => {
    if (!articleSlug) return;

    try {
      nProgress.start();
      const res = await fetch(`${API_ENDPOINT.base.url}/article/${articleSlug}/thumbnail/`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!res.ok) throw new Error("Delete failed");

      setThumbnail(null);

      toast({
        title: "Thumbnail Removed",
        description: "Your thumbnail was removed successfully.",
      });
    } catch {
      toast({
        title: "Delete Failed",
        description: "There was an error removing the thumbnail.",
        variant: "destructive",
      });
    } finally {
      nProgress.done();
    }
  };

  return (
    <div>
      {/* Toolbar */}
      <div className="mb-6">
        <div className="flex items-center justify-between p-4 bg-background/95 backdrop-blur-sm border border-border rounded-lg shadow-sm">
          <div className="flex items-center gap-4">
            {/* Upload Thumbnail */}
            <div className="relative">
              <Input
                id="thumbnailUpload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleThumbnailUpload(file);
                }}
              />
              <Button
                size="sm"
                onClick={() => document.getElementById("thumbnailUpload")?.click()}
                variant="outline"
                className="flex items-center gap-2 hover:bg-primary/10 transition-colors duration-200"
              >
                <FaImage className="w-4 h-4" />
                <span className="hidden sm:inline">Upload Thumbnail</span>
                <span className="sm:hidden">Thumbnail</span>
              </Button>
            </div>

            {/* Publish / Update */}
            <Button
              size="sm"
              className="bg-green-600 hover:bg-green-700 text-white shadow-md hover:shadow-lg transition-all duration-200"
              onClick={PublishArticle}
            >
              {status === "DR" ? "Publish" : "Update"}
            </Button>

            {/* Settings */}
            <Link href={`/user/${user?.username}/article/${articleSlug}/setting`}>
              <Button 
                size="sm" 
                variant="ghost"
                className="hover:bg-muted transition-colors duration-200"
              >
                <FiSettings className="w-4 h-4" />
              </Button>
            </Link>
          </div>

          <SaveIndicator />
        </div>
      </div>

      {/* Editor */}
      <Tiptap
        initialContent={content}
        initialTitle={title}
        initialSlug={slug}
        onTitleChange={UpdateTitle}
        onContentChange={UpdateContent}
        thumbnail={thumbnail}
        onThumbnailRemove={handleThumbnailDelete}
      />
    </div>
  );
};
