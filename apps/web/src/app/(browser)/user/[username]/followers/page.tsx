import { API_ENDPOINT } from "@/app/utils";
import { User } from "@/types/auth";
import { cookies } from "next/headers";
import React from "react";

const Page = async ({ params }: { params: Promise<{ username: string }> }) => {
  const { username } = await params;
  const cookieStore = cookies();
  const res = await fetch(
    `${API_ENDPOINT.toggleFollow.url}/${username}?type=followers`,
    {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Cookie: `${cookieStore.get("sessionid")?.name}=${
          cookieStore.get("sessionid")?.value
        }`,
      },
    }
  );
  const data: User[] = await res.json();
  

  return (
    <div>
      {data.map((user) => (
        <div>{user.username}</div>
      ))}
    </div>
  );
};

export default Page;
