import React from "react";
import { cookies } from "next/headers";
import { Input } from "@/components/element/input";
import { Form } from "@/components/element/form";
import { Button } from "@/components/element/button";
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
  }

  if (res.ok) {
    const tempUser = await res.json();
    data.first_name = tempUser.first_name;
    data.last_name = tempUser.last_name;
  }
  
  return (
    <div className="">
      <UsernameForm data={data}/>
    </div>
  );
};

export default Page;
