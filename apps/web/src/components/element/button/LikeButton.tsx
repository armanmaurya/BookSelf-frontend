"use client";
import { IoMdHeart, IoMdHeartEmpty } from "react-icons/io";
import { motion, AnimatePresence } from "framer-motion";
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
    <motion.span 
      className="flex items-center space-x-1 cursor-pointer select-none" 
      onClick={toggleLike}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
    >
      <motion.div
        key={liked ? "liked" : "unliked"}
        initial={{ scale: 0.8, rotate: -10 }}
        animate={{ scale: 1, rotate: 0 }}
        exit={{ scale: 0.8, rotate: 10 }}
        transition={{ 
          type: "spring", 
          stiffness: 500, 
          damping: 15,
          duration: 0.3
        }}
        whileHover={{ 
          scale: 1.1,
          transition: { duration: 0.2 }
        }}
      >
        <AnimatePresence mode="wait">
          {liked ? (
            <motion.div
              key="heart-filled"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ 
                scale: 1, 
                rotate: 0,
                color: "#ef4444" // red-500 color for liked state
              }}
              exit={{ scale: 0, rotate: 180 }}
              transition={{ 
                type: "spring", 
                stiffness: 600, 
                damping: 20,
                duration: 0.4
              }}
            >
              <IoMdHeart size={25} color="#ef4444" />
            </motion.div>
          ) : (
            <motion.div
              key="heart-empty"
              initial={{ scale: 0, rotate: 180 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: -180 }}
              transition={{ 
                type: "spring", 
                stiffness: 600, 
                damping: 20,
                duration: 0.4
              }}
            >
              <IoMdHeartEmpty size={25} color="#808080" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
      <motion.span 
        className="text-lg font-medium"
        key={likes}
        initial={{ scale: 1.2, opacity: 0.7 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ 
          type: "spring", 
          stiffness: 400, 
          damping: 20,
          duration: 0.3
        }}
      >
        {likes}
      </motion.span>
    </motion.span>
  );
};
