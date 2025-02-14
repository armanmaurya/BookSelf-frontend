import { cookies } from "next/headers";
import { ProfileIcon } from "./ProfileIcon";
import { API_ENDPOINT } from "@/app/utils";

export const ProfileIconContainer = async () => {
    const cookieStore = cookies();

    const res = await fetch(`${API_ENDPOINT.googleAuth.url}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Cookie: `${cookieStore.get("sessionid")?.name}=${cookieStore.get("sessionid")?.value
            }`,
        },
    })

    if (res.ok) {
        const data = await res.json();
        return <ProfileIcon username={data.username}/>
    }


  return (
    <div>
        ProfileIcon
    </div>
  )
}
