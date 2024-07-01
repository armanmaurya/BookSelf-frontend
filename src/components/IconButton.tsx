"use client";
import { useEffect, useRef, useState } from "react";
import { NewArticleBtn, LogoutBtn } from "./element/button";

export const IconBtn = () => {
  const [isOpened, setIsOpened] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const toggle = () => {
    setIsOpened(!isOpened);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpened(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  });

  return (
    <div className="" ref={ref}>
      <div
        className="bg-black h-8 w-8 rounded-full hover:cursor-pointer"
        onClick={toggle}
      ></div>
      <div
        className={`${
          isOpened ? "h-44" : "h-0"
        } flex overflow-hidden ease-in-out absolute  border top-14 right-7 z-10 bg-white dark:bg-neutral-800 rounded-2xl shadow-xl w-40 items-center justify-center`}
      >
        <ul className="space-y-1 p-2 w-full items-center">
          {/* <button
                onClick={ProfileRoute}
                className="bg-gray-200 rounded p-1.5 w-full"
              >
                Profile
              </button> */}
          <li className="rounded dark:bg-neutral-700 p-1.5 w-full bg-slate-100 text-center hover:cursor-pointer">
            Settings
          </li>
          <li className="rounded p-1.5 dark:bg-neutral-700 w-full bg-slate-100 text-center hover:cursor-pointer">
            <NewArticleBtn />
          </li>
          <LogoutBtn />
        </ul>
      </div>
    </div>
  );
};
