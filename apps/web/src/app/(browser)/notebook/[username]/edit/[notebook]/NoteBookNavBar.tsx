"use client"

import { usePathname } from "next/navigation"
import { RenderNavBar } from "./RenderSideNavBar"
import { API_ENDPOINT } from "@/app/utils";
import { AnimatePresence } from "framer-motion";
import { ContextMenu, ContextMenuItem, MenuProvider, useContextMenu } from "@bookself/context-menu";
import { PageResponse } from "@bookself/types";
import { useState } from "react";
import { Modal } from "@/components/Modal";

export const NoteBookNavBar = () => {
  const path = usePathname();
  console.log("url", path);
  const pathArray = path.split("/");
  const username = pathArray[2];
  const notebook = pathArray[4];
  const activepath = pathArray.slice(5, pathArray.length);
  const notebookurl = `/notebook/${username}/edit/${notebook}`;

  const [isCreateModelOpen, setIsCreateModelOpen] = useState(false);

  const menu = useContextMenu<any>();
  const createPage = async (path: string) => {
    const res = await fetch(`${API_ENDPOINT.notebook.url}/${username}/${notebook}/${path}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        title: "New Page",
        content: ""
      })
    });
    const data: PageResponse = await res.json();
  }
  return (
    <div>
      < RenderNavBar root={true} notebookurl={notebookurl} username={username} notebook={notebook} activepath={activepath} />
      <div>
        {
          isCreateModelOpen && (
            <Modal onClose={() => {
              setIsCreateModelOpen(false);
            }}>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white">
                <input type="text" />
                <button onClick={() => {
                  // createPage("new-page");
                }}>Create</button>
              </div>
            </Modal>
          )
        }
        <ContextMenu>
          <ContextMenuItem onClick={() => {
            setIsCreateModelOpen(true);
          }}>
            New Page
          </ContextMenuItem>
        </ContextMenu>
      </div>
    </div>

  )
}