"use client";
import { API_ENDPOINT } from "@/app/utils";
import { useFetch } from "@bookself/react-hooks";
import { PageResponse } from "@bookself/types";
import { usePathname } from "next/navigation";
import React from "react";
import { NavTree } from "./NavTree";

export const ReadNavTree = () => {
  const path = usePathname();

  const pathArray = path.split("/");
  const username = pathArray[2];
  const notebook = pathArray[3];
  const activepath = pathArray.slice(4, pathArray.length);
  const notebookurl = `/notebook/${username}/${notebook}`;
  const { data, error, loading, refetch } = useFetch<PageResponse[]>(
    `${API_ENDPOINT.notebook.url}/${username}/${notebook}?children`
  );
  return (
    <div>
      <div className="mx-2 h-full overflow-scroll">
        {data &&
          data.map((item) => {
            return (
              <NavTree
                item={item}
                activepath={activepath}
                username={username}
                notebook={notebook}
                path={[item.slug]}
                root={true}
                notebookurl={notebookurl}
                key={item.id}
                parentRefetch={refetch}
              />
            );
          })}
      </div>
      <div></div>
    </div>
  );
};
