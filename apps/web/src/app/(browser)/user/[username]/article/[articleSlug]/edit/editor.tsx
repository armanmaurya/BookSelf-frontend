"use client";
import { WSGIEditor } from "@bookself/slate-editor";
// import { Article } from "@/app/types";
import Cookies from "js-cookie";
import { useCallback, useState, useEffect } from "react";
import { API_ENDPOINT } from "@/app/utils";
import { Store } from "react-notifications-component";
import { useAuth } from "@/context/AuthContext";
import { gql } from "@apollo/client";
import client from "@/lib/apolloClient";
import { FaImage, FaCog } from "react-icons/fa";
import nProgress from "nprogress";
import { useRouter } from "next/navigation";
import { AddArticleCover } from "@/components/element/AddArticleCover";
import Image from "next/image";
import Tiptap from "@/components/TipTap";
import Link from "next/link";
import { FiSettings } from "react-icons/fi";

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
  const [saveStatus, setSaveStatus] = useState<"saved" | "saving" | "error">(
    "saved"
  );
  const [currentTime, setCurrentTime] = useState("");
  const { user } = useAuth();
  const router = useRouter();

  const MUTATION = gql`
    mutation MyMutation($content: String, $title: String, $slug: String!) {
      updateArticle(title: $title, content: $content, slug: $slug) {
        slug
      }
    }
  `;
  const UpdateContent = useCallback(
    async (body: string) => {
      console.log("Saving content:", body);
      setSaveStatus("saving");

      try {
        const { data } = await client.mutate({
          mutation: MUTATION,
          variables: { content: body, title: null, slug: articleSlug },
        });
        if (data) {
          console.log("Content saved successfully");
          setSaveStatus("saved");
          setLastSaved(new Date());
        }
      } catch (error) {
        console.log("Error saving content:", error);
        setSaveStatus("error");
      }
    },
    [articleSlug, MUTATION]
  );

  const UpdateTitle = useCallback(
    async (title: string) => {
      console.log("Saving title:", title);
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
          console.log("Title saved successfully");
        }
      } catch (error) {
        console.log("Error saving title:", error);
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
    // console.log(data);
    if (data.publishArticle != "") {
      nProgress.start();
      router.push(`/user/${user?.username}/article/${data.publishArticle}`);
    }
  };

  // Function to get time elapsed since last save
  const getTimeElapsed = () => {
    if (!lastSaved) return "";

    const now = new Date();
    const diffInMs = now.getTime() - lastSaved.getTime();
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));

    if (diffInMinutes === 0) {
      return "just now";
    } else if (diffInMinutes === 1) {
      return "1 minute ago";
    } else if (diffInMinutes < 60) {
      return `${diffInMinutes} minutes ago`;
    } else {
      const hours = Math.floor(diffInMinutes / 60);
      if (hours === 1) {
        return "1 hour ago";
      } else {
        return `${hours} hours ago`;
      }
    }
  };

  // Update time display every minute
  useEffect(() => {
    const interval = setInterval(() => {
      // Force re-render to update time display without changing lastSaved
      const now = new Date();
      // This will trigger a re-render without causing infinite loops
      setLastSaved((prev) => (prev ? new Date(prev) : null));
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []); // Empty dependency array

  // Initialize last saved time
  useEffect(() => {
    setLastSaved(new Date());
  }, []);

  const SaveIndicator = () => {
    return (
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
  };

  // console.log("content", content);
  return (
    <div className="">
      <div className="">
        <div className="mb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* <AddArticleCover articleSlug={articleSlug} /> */}
              <div
                className="bg-green-600 rounded-full flex items-center justify-center m-1 text-xs p-1 cursor-pointer"
                onClick={PublishArticle}
              >
                {status === "DR" ? "Publish" : "Update"}
              </div>
              <Link
                href={`/user/${user?.username}/article/${articleSlug}/setting`}
              >
                <FiSettings className="text-white" />
              </Link>
            </div>
            <SaveIndicator />
          </div>
        </div>
        <Tiptap
          initialContent={content}
          initialTitle={title}
          onTitleChange={UpdateTitle}
          onContentChange={UpdateContent}
        />
      </div>
    </div>
  );
};
