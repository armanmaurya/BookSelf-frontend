"use client";
// import { SaveArticle } from "@/components/blocks/SaveArticle";
import { useAuth } from "@/hooks/use-user";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import nProgress, { set } from "nprogress";
import React, { useState, useEffect, useRef } from "react";
import { FaRegBookmark } from "react-icons/fa";
import client from "@/lib/apolloClient";
import { gql } from "@apollo/client";
import { AddArticleToCollection } from "./AddArticleToCollection";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import { Loader2 } from "lucide-react";
import { NewCollectionBtn } from "@/components/blocks/buttons/NewCollectionBtn";
import { CollectionType } from "@/types/Collection";

export const SaveArticleButton = ({
  articleSlug,
}: {
  articleSlug: string;
  isSaved: boolean;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAuth();
  const router = useRouter();

  const handleOpen = () => {
    if (!user) {
      router.push("/signin");
      nProgress.start();
      return;
    }
    setIsOpen(true);
  };
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <Button
        variant="ghost"
        size="icon"
        onClick={handleOpen}
        className="rounded-full"
        aria-label={user ? "Save article" : "Sign in to save"}
      >
        <FaRegBookmark className="w-5 h-5" />
      </Button>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Save to Collection</DialogTitle>
          <DialogDescription>
            Choose a collection or create a new one to save this article.
          </DialogDescription>
        </DialogHeader>
        <SaveArticle setShow={setIsOpen} articleSlug={articleSlug} />
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="secondary">Close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export const SaveArticle = ({
  articleSlug,
  setShow,
}: {
  setShow: (show: boolean) => void;
  articleSlug: string;
}) => {
  const [collections, setCollections] = useState<CollectionType[]>([]);
  const [loading, setLoading] = useState(true);
  const [isArticleCreateOpen, setIsArticleCreateOpen] = useState(false);
  const { user } = useAuth();
  const contentRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState<number | undefined>(undefined);

  const GET_USER_COLLECTIONS = gql`
    query MyQuery($username: String!, $articleSlug: String!) {
      user(username: $username) {
        collections(number: 10) {
          id
          name
          isAdded(articleSlug: $articleSlug)
        }
      }
    }
  `;

  const fetchCollections = async () => {
    setLoading(true);
    try {
      const { data } = await client.query({
        query: GET_USER_COLLECTIONS,
        variables: {
          username: user?.username,
          articleSlug: articleSlug,
        },
        fetchPolicy: "network-only",
      });
      // Add a small delay for better perceived UI feedback
      if (data) {
        setCollections(data.user.collections);
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error("Error fetching collections", error);
    }
  };

  useEffect(() => {
    fetchCollections();
  }, []);

  useEffect(() => {
    if (contentRef.current) {
      setHeight(contentRef.current.scrollHeight);
    }
  }, [loading, isArticleCreateOpen, collections.length]);

  return (
    <div>
      <div className="w-full">
        <div className="space-y-2 flex flex-col">
          <motion.div
            ref={contentRef}
            animate={{ height: height ?? "auto" }}
            initial={false}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            style={{ overflow: "hidden" }}
          >
            {loading ? (
              <div className="flex justify-center items-center">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              </div>
            ) : (
              collections.map((collection) => (
                <AddArticleToCollection
                  key={collection.id}
                  onToggle={(status) => {
                    setCollections(
                      collections.map((c) => {
                        if (c.id === collection.id) {
                          return { ...c, isAdded: status };
                        }
                        return c;
                      })
                    );
                  }}
                  collection={collection}
                  articleSlug={articleSlug}
                />
              ))
            )}
          </motion.div>
          <NewCollectionBtn
            onCreate={() => {
              // Refetch the collections after creating a new one
              fetchCollections();
            }}
          />
        </div>
      </div>
    </div>
  );
};
