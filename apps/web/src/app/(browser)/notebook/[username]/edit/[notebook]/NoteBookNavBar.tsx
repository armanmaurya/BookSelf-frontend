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
import { act, useState } from "react";
// import { NewPageBtn } from "@/components/blocks/NewPageBtn";
import { Modal } from "@bookself/react-modal";
import { NewPageBtn } from "@/components/blocks/NewPageBtn";
import { useFetch } from "@bookself/react-hooks";
export const NoteBookNavBar = () => {
  const path = usePathname();
  console.log("url", path);
  const pathArray = path.split("/");
  const username = pathArray[2];
  const notebook = pathArray[4];
  const activepath = pathArray.slice(5, pathArray.length);
  const notebookurl = `/notebook/${username}/edit/${notebook}`;

  const { data, error, loading, refetch } = useFetch<PageResponse[]>(
    `${API_ENDPOINT.notebook.url}/${username}/${notebook}?children`
  );

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
      menu.data.call();
    }
  };

  const handleDelete = async (path: string) => {
    console.log("Delete", path);
    const res = await fetch(
      `${API_ENDPOINT.notebook.url}/${username}/${notebook}/${path}`,
      {
        method: "DELETE",
      }
    );
    if (res.ok) {
      console.log("Deleted", path);
      menu.data.parentRefetch();
    }
  }

  // console.log("data", data);

  return (
    <div className="h-full">
      <div className="mx-2 h-full overflow-scroll" onContextMenu={(e) => {
        e.preventDefault();
        menu.setClicked(true);
        menu.setPoint({ x: e.clientX, y: e.clientY });
        menu.setData({ call: refetch, path: "" });
      }}>
        {
          data && data.map((item) => {
            return (
              <NavTree item={item} activepath={activepath}
                username={username}
                notebook={notebook}
                path={[item.slug]}
                root={true}
                notebookurl={notebookurl}
                key={item.id}
                parentRefetch={refetch}
              />
            )
          })
        }
      </div>
      <div>
        <Modal
          onRequestClose={() => {
            setIsCreateModelOpen(false);
          }}
          isOpen={isCreateModelOpen}
          className="h-1/2 w-1/2 absolute bg-neutral-900 rounded-lg shadow-md top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
        >
          <NewPageBtn
            onCreate={(title) => {
              createPage(menu.data.path, title);
              setIsCreateModelOpen(false);
              // menu.data.setIsChanged((prev: boolean) => !prev);
            }}
          />
        </Modal>
        <ContextMenu>
          <ContextMenuItem
            onClick={() => {
              setIsCreateModelOpen(true);
            }}
          >
            New Page
          </ContextMenuItem>
          <ContextMenuItem
            onClick={() => {
              handleDelete(menu.data.path);
            }}
          >
            Delete
          </ContextMenuItem>
        </ContextMenu>
      </div>
    </div>
  );
};
