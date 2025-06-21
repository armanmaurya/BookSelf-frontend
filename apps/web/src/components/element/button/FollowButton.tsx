"use client";

import { API_ENDPOINT } from "@/app/utils";
import { useAuth } from "@/context/AuthContext";
import { useState } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import nProgress from "nprogress";

export const FollowButton = ({
  initialIsFollowing,
  username,
}: {
  initialIsFollowing: boolean;
  username: string;
}) => {
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
  const { user } = useAuth();
  const router = useRouter();

  async function toggleFollow() {
    if (!user) {
      nProgress.start();
      router.push("/signin");
    }

    const csrf = Cookies.get("csrftoken");

    const res = await fetch(`${API_ENDPOINT.toggleFollow.url}/${username}/`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": csrf!,
      },
    });

    if (!res.ok) return;
    setIsFollowing(!isFollowing);
  }
  return (
    <button
      onClick={toggleFollow}
      className={`border border-gray-300 rounded-md p-1 transition-transform duration-200 active:scale-90 ${
        isFollowing ? "bg-gray-600 text-white" : "bg-blue-500 text-black"
      }`}
    >
      {isFollowing ? "Following" : "Follow"}
    </button>
  );
};
