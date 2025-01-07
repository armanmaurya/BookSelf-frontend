"use client";
import { API_ENDPOINT } from "@/app/utils";
import { PageResponse } from "@bookself/types";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { IoIosArrowBack } from "react-icons/io";
import { motion, AnimationControls, AnimatePresence } from "framer-motion";


export const RenderNavBar = ({
  username,
  notebook,
  path = [],
  root,
  activepath,
  notebookurl,
}: {
  username: string;
  notebook: string;
  path?: string[];
  root: boolean;
  activepath: string[];
  notebookurl: string;
}) => {
  const [children, setChildren] = useState<PageResponse[]>([]);
  const [isExapaned, setIsExpanded] = useState(false);
  const [initiallyExpanded, setInitiallyExpanded] = useState(false);
  const getChildren = useCallback(async (url: string) => {
    let res = await fetch(url);
    const data: PageResponse[] = await res.json();
    return data;
  }, []);
  let url;
  if (root) {
    url = `${API_ENDPOINT.notebook.url}/${username}/${notebook}?children`;
  } else {
    url = `${API_ENDPOINT.notebook.url}/${username}/${notebook}/${path?.join(
      "/"
    )}?children`;
  }
  useEffect(() => {
    getChildren(url).then((data) => setChildren(data));
  }, [url]);
  return (
    <div>
      {children.map((child) => {
        let newPath = [...path, child.slug];
        const currentSlug = activepath[0];
        if (currentSlug == child.slug && !initiallyExpanded && !isExapaned && child.has_children && activepath.length > 1) {
          setInitiallyExpanded(true);
          setIsExpanded(true);
        }
        return (
          <div key={child.id} className="">
            <div
              className={`m-1 dark:bg-opacity-50 overflow-hidden rounded-md ${activepath.join("/") === child.slug ? "dark:bg-blue-500" : "dark:bg-neutral-900"
                }`}
            >
              <div className="flex gap-1 px-1">
                {
                  child.has_children && (
                    <div className="flex items-center cursor-pointer" onClick={() => {
                      setIsExpanded(!isExapaned);
                      setInitiallyExpanded(true);
                    }}>
                      <IoIosArrowBack className="-scale-100" />

                    </div>
                  )
                }
                <Link href={`${notebookurl}/${newPath.join("/")}`}>
                  {child.title}
                </Link>
              </div>
            </div>
            <AnimatePresence>
              {(child.has_children && isExapaned && initiallyExpanded) && (
                <motion.div initial={{height: 0}} animate={{height: 30}} exit={{height: 0}} className="overflow-hidden p-0">
                  <div className="ml-4">
                    <RenderNavBar
                      activepath={activepath.slice(1, activepath.length)}
                      username={username}
                      notebook={notebook}
                      path={newPath}
                      root={false}
                      notebookurl={notebookurl}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
};
