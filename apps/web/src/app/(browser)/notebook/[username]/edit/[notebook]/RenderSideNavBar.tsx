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
  // const [isExpaned, setIsExpanded] = useState(false);
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
    getChildren(url).then((data) => {
      setChildren(data);
    });

  }, [url]);
  return (
    <div>
      {children.map((child) => {
        let newPath = [...path, child.slug];
        return (
          <div key={child.id} className="">
            {(
              <ChildItems
                activepath={activepath}
                username={username}
                notebook={notebook}
                path={newPath}
                child={child}
                notebookurl={notebookurl}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};


const ChildItems = ({ child, activepath, notebookurl, username, notebook, path }: { child: PageResponse, activepath: string[], notebookurl: string, username: string, notebook: string, path: string[] }) => {
  const [isExpaned, setIsExpanded] = useState(false);
  const currentSlug = activepath[0];
  console.log(child.slug, currentSlug);
  if (child.slug === currentSlug && !isExpaned) {
    setIsExpanded(true);
  }
  return (
    <div>
      <div className={`m-1 dark:bg-opacity-50 overflow-hidden rounded-md ${
        activepath.join("/") === child.slug ? "bg-blue-400 bg-opacity-15" : ""
      }`} onClick={() => {
        setIsExpanded(!isExpaned);
      }}>
        <div className="flex gap-1 px-1">
          {
            child.has_children && (
              <div className="flex items-center cursor-pointer">
                <IoIosArrowBack className={`-scale-100 transition ${isExpaned ? "rotate-90" : "rotate-0"}`} />
              </div>
            )
          }
          <Link href={`${notebookurl}/${path.join("/")}`}>
            {child.title}
          </Link>
        </div>

      </div>
      {
        child.has_children && isExpaned && (
          <div className="ml-8 border-l-2 border-gray-300">
            <RenderNavBar activepath={activepath.slice(1, activepath.length)} username={username} notebook={notebook} path={path} root={false} notebookurl={notebookurl} />
          </div>
        )
      }
    </div>
  )
}