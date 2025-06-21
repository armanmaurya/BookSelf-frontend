"use client";
import { useState } from "react";
import client from "@/lib/apolloClient";
import { gql } from "@apollo/client";
import { useRouter } from "next/navigation";
import nProgress from "nprogress";
import { FaImage } from "react-icons/fa";
import Cookies from "js-cookie";

export const AddArticleCover = ({
  articleSlug,
}: {
  articleSlug: string | null;
}) => {
  const [uploading, setUploading] = useState(false);

  // const MUTATION = gql`
  //   mutation MyMutation($slug: String!, $image: Upload!) {
  //     updateArticle(slug: $slug, image: $image) {
  //       slug
  //     }
  //   }
  // `;

  const updateCover = async (file: File) => {
    const csrf = Cookies.get("csrftoken");
    setUploading(true);
    nProgress.start();
    try {
      const formData = new FormData();
      formData.append("image", file);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/article/${articleSlug}/`, {
          method: "PATCH",
          body: formData,
          headers: {
            "X-CSRFToken": csrf || "",
          },
          credentials: "include",
        }

      )
    } catch (error) {
      console.error("Error uploading file:", error);
    } finally {
      setUploading(false);
    }
  };

  const router = useRouter();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      console.log("Selected file:", file);
      updateCover(file);

      nProgress.start();
      router.refresh();
    }
  };

  return (
    <label className="flex items-center p-1 rounded-md space-x-2 hover:bg-gray-100 hover:bg-opacity-5 cursor-pointer">
      <FaImage />
      <span>{uploading ? "Uploading..." : "Add Cover"}</span>
      <input
        type="file"
        accept="image/*" // Accept all image file types
        className="hidden" // Hide the input element
        onChange={handleFileChange} // Handle file selection
      />
    </label>
  );
};
