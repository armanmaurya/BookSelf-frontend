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
      <li className=" space-x-3 mr-2">
        <a
          className="border p-1.5 bg-sky-500 text-slate-50 rounded-2xl"
          href="/auth/signup"
        >
          Create Account
        </a>
        <Link className="text-sky-500" href="/auth/signin">
          Login
        </Link>
      </li>
    );
  }
};

export default ProfileIcon;
