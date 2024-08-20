import RNotification from "@/components/RNotification";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function Articlelayout({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode;
}) {
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

    redirect("/");
  } else {
    console.log("Error", res);
  }
  return (
    <main className="h-full">
      <RNotification />
      <div className="flex flex-col items-center justify-center h-full">
        {children}
      </div>
    </main>
  );
}
