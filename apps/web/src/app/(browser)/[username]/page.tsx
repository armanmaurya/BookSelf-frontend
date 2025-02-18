import React from "react";
import { API_ENDPOINT } from "@/app/utils";
import { cookies } from "next/headers";
import { User } from "@/types/auth";
import { FollowButton } from "@/components/element/button/FollowButton";

const ProfilePage = async ({
  params,
}: {
  params: Promise<{ username: string }>;
}) => {
  const cookieStore = cookies();
  const { username } = await params;

  const res = await fetch(`${API_ENDPOINT.base.url}/account/profile/${username}`, {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Cookie: `${cookieStore.get("sessionid")?.name}=${cookieStore.get("sessionid")?.value
        }`,
    },
  });

  const data: User = await res.json();
  console.log(data);

  return (
    <div>
      <div>{data.username}</div>
      <div className="flex space-x-2">
        <div className="flex space-x-1">
          <div>{data.followers}</div>
          <div>Followers</div>
        </div>
        <div className="flex space-x-1">
          <div>{data.following}</div>
          <div>Following</div>
        </div>
      </div>
      {data.is_following != undefined && (
        <FollowButton username={username} initialIsFollowing={data.is_following} />
      )}
    </div>
  );
};

export default ProfilePage;
