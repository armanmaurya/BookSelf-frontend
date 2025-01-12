// "use client";
// import { API_ENDPOINT } from "@/app/utils";
// import { PageResponse } from "@bookself/types";
// import Link from "next/link";
// import { useCallback, useEffect, useState } from "react";
import { IoIosArrowBack } from "react-icons/io";
// import { motion, AnimationControls, AnimatePresence } from "framer-motion";
// import { useContextMenu } from "@bookself/context-menu";

import { API_ENDPOINT } from "@/app/utils";
import { useFetch } from "@bookself/react-hooks";
import { PageResponse } from "@bookself/types";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useContextMenu } from "@bookself/context-menu";

export const NavTree = ({
  username,
  notebook,
  path = [],
  root,
  activepath,
  notebookurl,
  item,
  parentRefetch
}: {
  item: PageResponse;
  username: string;
  notebook: string;
  path?: string[];
  root: boolean;
  activepath: string[];
  notebookurl: string;
  parentRefetch?: () => void;
}) => {
  const [isExpaned, setIsExpanded] = useState(false);
  const { data, error, loading, refetch } = useFetch<PageResponse[]>(`${API_ENDPOINT.notebook.url}/${username}/${notebook}/${path.join("/")}?children`);
  const currentSlug = activepath[0];

  const menu = useContextMenu<any>();

  useEffect(() => {
    if (item.slug === currentSlug) {
      setIsExpanded(true);
    }
  }, [item.slug, currentSlug]);

  const handleChange = () => {
    console.log("Add new page", `${API_ENDPOINT.notebook.url}/${username}/${notebook}/${path.join("/")}?children`);
    refetch();
  }



  return (
    <div className="my-1">
      <div className="" onContextMenu={(e) => {
        e.preventDefault();
        e.stopPropagation();
        menu.setClicked(true);
        menu.setPoint({ x: e.clientX, y: e.clientY });
        menu.setData({ call: handleChange, path: path.join("/"), parentRefetch: parentRefetch });
      }}>
        <div className="flex gap-1 px-1 items-center bg-neutral-900 rounded-md">
          {
            data && data.length > 0 && (
              <div className="cursor-pointer" onClick={() => {
                setIsExpanded(!isExpaned);
              }}>
                <IoIosArrowBack className={`-scale-100 transition ${isExpaned ? "rotate-90" : "rotate-0"}`} />
              </div>
            )
          }
          <div>
            <Link href={`${notebookurl}/${path.join("/")}`}>
              {item.title}
            </Link>
          </div>

        </div>
      </div>

      {
        isExpaned && (
          <div className="border-l-2 border-neutral-500">
            {
              data && data.map((child) => {
                let newPath = [...path, child.slug];
                return (
                  <div key={child.id} className="ml-4 borderl">
                    <NavTree
                      item={child}
                      activepath={
                        activepath.slice(1, activepath.length)
                      }
                      username={username}
                      notebook={notebook}
                      path={newPath}
                      root={false}
                      notebookurl={notebookurl}
                      parentRefetch={refetch}
                    />
                  </div>
                );
              })
            }
          </div>
        )
      }

    </div>
  )
};
