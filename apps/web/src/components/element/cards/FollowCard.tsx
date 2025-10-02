import Image from "next/image";
import React from "react";
import { FollowButton } from "../button/FollowButton";
import Link from "next/link";
import { cn } from "@/lib/utils";

export interface FollowCardProps {
  showFollowButton?: boolean;
  firstName: string;
  lastName: string;
  username: string;
  isFollowing: boolean;
  profilePicture: string;
  followingCount?: number;
  className?: string;
}

export const FollowCard = ({
  firstName,
  lastName,
  username,
  isFollowing,
  profilePicture,
  showFollowButton,
  followingCount,
  className
}: FollowCardProps) => {
  const displayName = firstName && lastName
    ? `${firstName} ${lastName}`
    : username.charAt(0).toUpperCase() + username.slice(1);

  return (
    <div
      className={cn(
        "group relative flex items-center gap-4 rounded-xl border border-border bg-card px-4 py-3",
        "transition-all duration-200 hover:shadow-md hover:border-border/80",
        "focus-within:ring-2 focus-within:ring-primary/50 focus-within:ring-offset-2",
        className
      )}
    >
      {/* Profile Image */}
      <Link
        href={`/user/${username}`}
        className="relative flex-shrink-0"
        aria-label={`Open profile of ${displayName}`}
      >
        <div className="relative h-12 w-12 rounded-full bg-gradient-to-br from-primary/60 to-primary/30 p-[2px]">
          <div className="relative h-full w-full rounded-full bg-background overflow-hidden">
            <Image
              className="object-cover"
              fill
              src={
                profilePicture ||
                "https://cdn-icons-png.flaticon.com/128/64/64572.png"
              }
              alt={`${username}'s profile`}
            />
          </div>
        </div>
      </Link>

      {/* User Info */}
      <div className="flex flex-1 items-center justify-between min-w-0">
        <div className="flex flex-col min-w-0 flex-1">
          <Link
            href={`/user/${username}`}
            className="flex flex-col min-w-0 hover:opacity-80 transition-opacity"
          >
            <p className="font-semibold text-sm text-foreground truncate">
              {displayName}
            </p>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs text-muted-foreground truncate">
                @{username.toLowerCase()}
              </span>
            </div>
          </Link>
        </div>

        {/* Follow Button */}
        {showFollowButton !== false && (
          <div className="flex-shrink-0 ml-3">
            <FollowButton
              initialIsFollowing={isFollowing}
              username={username}
            />
          </div>
        )}
      </div>
    </div>
  );
};