"use client";

import { usePathname } from "next/navigation";
import { NavTree } from "./RenderSideNavBar";
import { API_ENDPOINT } from "@/app/utils";
import { AnimatePresence } from "framer-motion";
import {
  ContextMenu,
  ContextMenuItem,
  MenuProvider,
  useContextMenu,
} from "@bookself/context-menu";
import { PageResponse } from "@bookself/types";
import { useState } from "react";
// import { NewPageBtn } from "@/components/blocks/NewPageBtn";
import { Modal } from "@bookself/react-modal";
import { NewPageBtn } from "@/components/blocks/NewPageBtn";
import { Store } from "react-notifications-component";

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
  const createPage = async (path: string, title: string) => {

    console.log(path, title);
    const res = await fetch(
      `${API_ENDPOINT.notebook.url}/${username}/${notebook}/${path}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: `${title}`,
        }),
      }
    );
    const data: PageResponse = await res.json();
    if (res.ok) {
      console.log("Page created", data);
    }
  };
  return (
    <div>
      <NavTree
        root={true}
        notebookurl={notebookurl}
        username={username}
        notebook={notebook}
        activepath={activepath}
      />
      <div>
        <Modal
          onRequestClose={() => {
            setIsCreateModelOpen(false);
          }}
          isOpen={isCreateModelOpen}
          className="h-1/2 w-1/2 absolute bg-neutral-900 rounded-lg shadow-md top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
        >
          <NewPageBtn onCreate={(title) => {
            createPage(menu.data.path, title);
            setIsCreateModelOpen(false);
            menu.data.setIsChanged((prev: boolean) => !prev);
          }}/>
        </Modal>
        <ContextMenu>
          <ContextMenuItem
            onClick={() => {
              setIsCreateModelOpen(true);
            }}
          >
            New Page
          </ContextMenuItem>
        </ContextMenu>
      </div>
    </div>
  );
};
