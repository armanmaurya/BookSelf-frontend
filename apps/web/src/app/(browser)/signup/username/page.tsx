import React from "react";
import { cookies } from "next/headers";
import { Input } from "@/components/element/input";
import { Form } from "@/components/element/form";
import { Button } from "@/components/element/button";

const Page = async () => {
  const cookieStore = cookies();

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/account/tempuser`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Cookie: `${cookieStore.get("tempUser_id")?.name}=${
          cookieStore.get("tempUser_id")?.value
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

  // Function to handle form submission for Registering a new user
  async function handleSubmit(formData: FormData) {
    "use server";

    const rawFormData = {
      first_name: formData.get("first_name"),
      last_name: formData.get("last_name"),
      username: formData.get("username"),
    };
  }
  return (
    <div className="">
      <Form
        className="justify-center items-center"
        action={handleSubmit}
      >
        <Input defaultValue={data.first_name} name="first_name" type="text" placeholder="First Name" />
        <Input defaultValue={data.last_name} name="last_name" type="text" placeholder="Last Name" />
        <Input name="username" type="text" placeholder="Username" />
        <Button type="submit">Submit</Button>
      </Form>
    </div>
  );
};

export default Page;
