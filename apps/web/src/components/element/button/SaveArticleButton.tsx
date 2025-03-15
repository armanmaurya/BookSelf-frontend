"use client";
import { SaveArticle } from "@/components/blocks/SaveArticle";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import nProgress from "nprogress";
import React, { useState } from "react";
import { FaRegBookmark } from "react-icons/fa";

export const SaveArticleButton = ({ articleSlug }: {
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
    };
    
    setIsOpen(true);
  }
  return (
    <div onClick={handleOpen}>
      <button><FaRegBookmark /></button>
      {
        isOpen && (
          <SaveArticle setShow={setIsOpen} articleSlug={articleSlug} />
        )
      }
    </div>
  );
};
