"use client";

import { API_ENDPOINT } from "@/app/utils";
import { useAuth } from "@/context/AuthContext";
import { useState } from "react";
import Cookies from "js-cookie";

export const FollowButton = ({
  initialIsFollowing,
  username,
}: {
  initialIsFollowing: boolean
  username: string
}) => {
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing);

  async function toggleFollow() {

    const csrf = Cookies.get("csrftoken");

    const res = await fetch(`${API_ENDPOINT.toggleFollow.url}/${username}`, {
      method: "GET",
      credentials: "include",
    })
    
    if (!res.ok) return;
    setIsFollowing(!isFollowing);
  }
  return (
    <button onClick={toggleFollow} className={`border border-gray-300 rounded-md px-4 py-2 ${isFollowing ? 'bg-gray-600 text-white' : 'bg-blue-500 text-black'}`}>
      {
        isFollowing ? "Following" : "Follow"
      }
    </button>
  )
}
