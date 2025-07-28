"use client";

import { API_ENDPOINT } from "@/app/utils";
import { useAuth } from "@/context/AuthContext";
import { useState } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import nProgress from "nprogress";

export const FollowButton = ({
  initialIsFollowing,
  username,
}: {
  initialIsFollowing: boolean;
  username: string;
}) => {
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  async function toggleFollow() {
    if (!user) {
      nProgress.start();
      router.push("/signin");
      return;
    }

    if (isLoading) return;

    setIsLoading(true);

    try {
      const csrf = Cookies.get("csrftoken");

      const res = await fetch(`${API_ENDPOINT.toggleFollow.url}/${username}/`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": csrf!,
        },
      });

      if (!res.ok) {
        throw new Error("Failed to update follow status");
      }

      setIsFollowing(!isFollowing);
      
      toast({
        title: "Success!",
        description: isFollowing 
          ? `You have unfollowed @${username}` 
          : `You are now following @${username}`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }
  return (
    <Button
      onClick={toggleFollow}
      variant={isFollowing ? "outline" : "default"}
      size="sm"
      disabled={isLoading}
      className="min-w-[80px]"
    >
      {isLoading ? (
        <div className="flex items-center">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
          {isFollowing ? "Unfollowing..." : "Following..."}
        </div>
      ) : (
        isFollowing ? "Following" : "Follow"
      )}
    </Button>
  );
};
