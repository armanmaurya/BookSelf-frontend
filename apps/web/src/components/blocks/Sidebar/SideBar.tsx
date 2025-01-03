"use client";

import { useContext, useEffect, useRef, useState } from "react";
import { AppContext } from "../../context";
import { IoLibrary } from "react-icons/io5";
import Link from "next/link";
import { IoCloseCircleSharp } from "react-icons/io5";

export const SideBar = ({ children }: { children: React.ReactNode }) => {
  const sideBarState = useContext(AppContext);
  const ref = useRef<HTMLDivElement>(null);
  const handleButtonClick = () => {
    const elements = document.getElementsByClassName("sidebar-element");
    for (let i = 0; i < elements.length; i++) {
      elements[i].addEventListener("click", () => {
        sideBarState.setIsOpen(false);
      });
    }
  }
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

  useEffect(() => {
    handleButtonClick();
  }, []);
  return (
    <div
      ref={ref}
      className={`${
        sideBarState.isOpen ? "translate-x-0" : "-translate-x-full"
      } overflow-hidden fixed top-0 bg-white dark:bg-neutral-900 rounded-r-md shadow-md h-full transition-all ease-in-out`}
    >
      <button
        className="absolute top-2 right-2 cursor-pointer"
        onClick={(e) => {
          sideBarState.setIsOpen(false);
        }}
      >
        <IoCloseCircleSharp size={24} />
      </button>
      <ul className="p-2 flex flex-col h-full rounded pt-8">{children}</ul>
    </div>
  );
};
