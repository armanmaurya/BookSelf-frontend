import Link from "next/link";
import { cookies } from "next/headers";
import { IconBtn } from "./IconButton";

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
    return <IconBtn />;
  } else {
    return (
      <li className="flex space-x-3 justify-center items-center mr-2">
        <a
          className="border p-1.5 bg-sky-500 text-slate-50 rounded-2xl md:block h-10 hidden"
          href="/auth/signup"
        >
          Create
        </a>
        <Link className="text-sky-500" href="/auth/signin">
          Login
        </Link>
      </li>
    );
  }
};

export default ProfileIcon;
