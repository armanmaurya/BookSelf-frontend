"use client";

import { useContext, useEffect, useRef, useState } from "react";
import { AppContext } from "./context";
import { IoLibrary } from "react-icons/io5";
import Link from "next/link";

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
      } overflow-hidden fixed top-0 z-20 bg-white dark:bg-neutral-900 shadow-md h-full transition-all ease-in-out`}
    >
      <ul className="p-2 flex flex-col h-full rounded">
        <li className="p-2 rounded-lg text-center hover:bg-blue-400 hover:bg-opacity-15">
          <Link onClick={() => {
            sideBarState.setIsOpen(false);
          }} href="/library/my-article" className="justify-center flex items-center">
            <IoLibrary size={20} className="" />
            <span className="pl-3">Library</span>
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default SideBar;
