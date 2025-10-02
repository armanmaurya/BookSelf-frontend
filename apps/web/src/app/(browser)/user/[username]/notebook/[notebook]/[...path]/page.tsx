import { API_ENDPOINT } from "@/app/utils";
// import { EditButton } from '@/components/element/button/EditButton';
// import { NoContent } from '@/components/blocks/noContent';
// import { RenderContent } from '@bookself/slate-editor/renderer';
import { PageResponse } from "@bookself/types";
import { redirect } from "next/navigation";
import React from "react";

const page = async ({
  params,
}: {
  params: Promise<{ username: string; notebook: string; path: string[] }>;
}) => {
  const { username, notebook, path } = await params;

  // if (!path) {
  //   const getIndexPage = await fetch(
  //     `${API_ENDPOINT.notebook.url}/${username}/${notebook}?index`,
  //     {
  //       cache: "no-store",
  //     }
  //   );
  //   const data: PageResponse = await getIndexPage.json();
  //   redirect(`/${username}/notebook/${notebook}/${data.slug}`);
  // }

  // console.log(
  //   "path",
  //   `${API_ENDPOINT.notebook.url}/${username}/${notebook}/${path.join("/")}`
  // );

  // const res = await fetch(
  //   `${API_ENDPOINT.notebook.url}/${username}/${notebook}/${path.join("/")}`,
  //   {
  //     cache: "no-store",
  //   }
  // );

  // if (!res.ok) {
  //   redirect(`/${username}/notebook/${notebook}`);
  // }

  // const data: PageResponse = await res.json();
  // console.log("data", data.content);
  // console.log("runned");

  return (
    <div className="h-full">
      Read Page
    </div>
  );
};

export default page;
