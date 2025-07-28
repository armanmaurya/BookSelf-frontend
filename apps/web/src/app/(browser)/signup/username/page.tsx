import React from "react";
import { cookies } from "next/headers";
import { UsernameForm } from "./form";

const Page = async () => {
  const cookieStore = cookies();

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/account/tempuser`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Cookie: `${cookieStore.get("sessionid")?.name}=${
          cookieStore.get("sessionid")?.value
        }`,
      },
    }
  );

  const data = {
    first_name: "",
    last_name: "",
  };

  if (res.ok) {
    const tempUser = await res.json();
    data.first_name = tempUser.first_name;
    data.last_name = tempUser.last_name;
  }

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-foreground">
            Complete Your Registration
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Please choose a username to continue
          </p>
        </div>

        <UsernameForm data={data} />

        <div className="mt-6 text-center text-sm text-muted-foreground">
          <p>
            Need help?{" "}
            <a
              href="#"
              className="font-medium text-primary hover:text-primary/80 transition-colors"
            >
              Contact support
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Page;
