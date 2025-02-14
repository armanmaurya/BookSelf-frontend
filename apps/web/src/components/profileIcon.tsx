import Link from "next/link";
import { cookies } from "next/headers";
import { IconBtn } from "./IconButton";
import { YourProfileButton } from "./element/button/YourProfileButton";

const ProfileIcon = async () => {
  const cookieStore = cookies();

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/example/`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Cookie: `${cookieStore.get("sessionid")?.name}=${
        cookieStore.get("sessionid")?.value
      }`,
    },
  });
  if (res.ok) {
    console.log("Success", res);
    return <IconBtn>
      Hi
    </IconBtn>;
  } else {
    return (
      <li className="flex justify-center items-center rounded-xl overflow-hidden bg-sky-600">
        <a
          className="bg-sky-500 text-slate-50 md:block hidden rounded-r-md h-full p-2 shadow-[4px_4px_10px_rgba(0,0,0,0.4)]"
          href="/signup"
        >
          Create
        </a>
        <Link className="h-full p-2 text-slate-200" href="/signin">
          Login
        </Link>
      </li>
    );
  }
};

export default ProfileIcon;
