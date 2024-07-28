"use client";

import { useContext, useEffect, useRef, useState } from "react";
import { AppContext } from "./context";

const SideBar = () => {
  const sideBarState = useContext(AppContext);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        ref.current &&
        !ref.current.contains(event.target as Node) &&
        sideBarState.hamburderButtonRef.current &&
        !sideBarState.hamburderButtonRef.current.contains(event.target as Node)
      ) {
        sideBarState.setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  });
  return (
    <div
      ref={ref}
      className={`${
        sideBarState.isOpen ? "w-44" : "w-0"
      } overflow-hidden fixed  bg-white dark:bg-neutral-800 shadow-md h-full transition-all ease-in-out`}
    >
      <ul className="p-4 m-2 flex flex-col h-full rounded">
        <li>Home</li>
        <li>About</li>
        <li>Upload</li>
      </ul>
    </div>
  );
};

export default SideBar;
