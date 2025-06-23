
import { API_ENDPOINT } from "@/app/utils";
import { RichTextEditor } from "@/components/blocks/RichTextEditor";
// import { EditButton } from "@/components/element/button/EditButton";
import { notFound } from "next/navigation";
import React from "react";


type PageResponse = {
  title: string;
  content: string;
};

const Page = async ({
  params,
}: {
  params: Promise<{ username: string; notebook: string; path: string[] }>;
}) => {
  const { username, notebook, path } = await params;
  let res;
  if (path) {
    res = await fetch(
      `${API_ENDPOINT.notebook.url}/${username}/${notebook}/${path.join("/")}`, {
        cache: "no-store",
      }
    );
  } else {
    res = await fetch(`${API_ENDPOINT.notebook.url}/${username}/${notebook}`, { cache: "no-store" });
  }

  // console.log("res", )
  let data: PageResponse;
  if (res.ok) {
    data = await res.json();
  } else {
    return notFound();
  }



  console.log("data", data);
  return (
    <div>

      {/* <RichTextEditor username={username} notebook={notebook} path={path} initialValue={data.content} title={data.title} />
      <EditButton href={
        `/${username}/notebook/${notebook}/read/${path ? path.join("/") : ""}`
      }>
        Read
      </EditButton> */}
    </div>
    
    
  );
};

export default Page;
