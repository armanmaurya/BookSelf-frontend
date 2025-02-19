import RNotification from "@/components/RNotification";
import { GoolgeAuth } from "@/components/auth";
import { LoginForm } from "@/components/blocks/form";
import { Divider } from "@/components/decoration";
import { Suspense } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function Login() {
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
    redirect("/");
  } else {
    console.log("Error", res);
  }

  return (
    <main className="h-full">
      <RNotification />
      <div className="flex flex-col items-center justify-center h-full">
        <div className="m-4">
          <Suspense>
            <GoolgeAuth redirect_path="/signin" />
          </Suspense>
        </div>
        <div className="w-80 my-3 rounded-full">
          <Divider />
        </div>
        <LoginForm />
      </div>
    </main>
  );
}
