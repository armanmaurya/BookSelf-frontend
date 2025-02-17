"use client";
import { IoMdHeart, IoMdHeartEmpty } from "react-icons/io";

import React, { useState } from "react";
import nProgress from "nprogress";
import { useRouter } from "next/navigation";

export const LikeButton = ({
  initialState,
  initialLikes,
  url,
  method
}: {
  initialState: boolean;
  initialLikes: number;
  url: string;
  method: string;
}) => {
  const [liked, setLiked] = useState(initialState);
  const [likes, setLikes] = useState(initialLikes);

  const router = useRouter();

  const toggleLike = async () => {
    const res = await fetch(url, {
        credentials: "include",
    });

    if (res.ok) {
      setLiked(!liked);
      setLikes(liked ? likes - 1 : likes + 1);
    } else if (res.status === 403) {
        nProgress.start();
        router.push("/signin");
    }
  }
  return (
    <span className="flex items-center space-x-1 cursor-pointer" onClick={toggleLike}>
      {liked ? (
        <IoMdHeart color="#808080" size={25} />
      ) : (
        <IoMdHeartEmpty color="#808080" size={25} />
      )}
      <span className="text-lg">{likes}</span>
    </span>
  );
};
