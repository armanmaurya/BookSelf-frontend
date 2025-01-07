"use client"

import { usePathname } from "next/navigation"
import { RenderNavBar } from "./RenderSideNavBar"
import { API_ENDPOINT } from "@/app/utils";

export const NoteBookNavBar = () => {
  const path = usePathname();
  console.log("url", path);
  const pathArray = path.split("/");
  const username = pathArray[2];
  const notebook = pathArray[4];
  const activepath = pathArray.slice(5, pathArray.length);
  const notebookurl = `/notebook/${username}/edit/${notebook}`;

  return (
    <RenderNavBar root={true} notebookurl={notebookurl} username={username} notebook={notebook} activepath={activepath}/>
  )
}