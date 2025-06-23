import Image from "next/image";
import React from "react";
import { FollowButton } from "../button/FollowButton";
import Link from "next/link";

export const FollowCard = ({
  firstName,
  lastName,
  username,
  isFollowing,
  profilePicture,
  showFollowButton
}: {
  showFollowButton?: boolean;
  firstName: string;
  lastName: string;
  username: string;
  isFollowing: boolean;
  profilePicture: string;
}) => {
  return (
    <div className="group dark:bg-neutral-800 bg-white rounded-lg flex justify-between p-4 items-center border border-gray-200 dark:border-neutral-700 hover:shadow-md transition-all duration-200 hover:border-gray-300 dark:hover:border-neutral-600">
      <Link
        href={`/user/${username}`}
        className="flex items-center space-x-3 overflow-hidden"
      >
        <div className="relative flex-shrink-0">
          <Image
            className="rounded-full object-cover"
            height={48}
            width={48}
            src={
              profilePicture ||
              "https://cdn-icons-png.flaticon.com/128/64/64572.png"
            }
            alt={`${username}'s profile`}
          />
          <div className="absolute inset-0 rounded-full border border-gray-200 dark:border-neutral-600 pointer-events-none" />
        </div>
        <div className="min-w-0">
          <p className="font-medium text-gray-900 dark:text-gray-100 truncate">
            {
              firstName && lastName
                ? `${firstName} ${lastName}`
                : username.charAt(0).toUpperCase() + username.slice(1)
            }
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
            @{username.toLowerCase()}
          </p>
        </div>
      </Link>
      {showFollowButton !== false && (
        <div className="flex-shrink-0 ml-2">
          <FollowButton
            initialIsFollowing={isFollowing}
            username={username}
            //   className="text-sm px-3 py-1.5"
          />
        </div>
      )}
    </div>
  );
};
