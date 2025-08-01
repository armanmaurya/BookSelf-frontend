"use client";
import { useEffect, useRef, useState } from "react";
import { LogoutBtn } from "./element/button/LogoutBtn";
import { NewArticleBtn } from "./element/button/NewArticleBtn";
import { motion, AnimationControls, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { YourProfileButton } from "./element/button/YourProfileButton";

export const IconBtn = ({children}: {
  children: React.ReactNode
}) => {
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
  }, []);

  return (
    <div ref={ref}>
      <div
        className="bg-black h-8 w-8 rounded-full hover:cursor-pointer"
        onClick={toggle}
      ></div>
      <AnimatePresence>
        {isOpened && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{
              duration: 0.1,
            }}
            className={`flex overflow-hidden ease-in-out fixed top-14 right-2 bg-white dark:bg-neutral-800 rounded-xl border w-40 items-center justify-center`}
          >
            <ul className="space-y-1 p-2 w-full items-center">
              {/* <button
                onClick={ProfileRoute}
              className="bg-gray-200 rounded p-1.5 w-full"
              >
                Profile
              </button> */}
              <li className="rounded dark:bg-neutral-700 p-1.5 w-full bg-slate-100 text-center hover:cursor-pointer">
                {/* <Link
                  href="/account/personal-info"
                  onClick={() => {
                    setIsOpened(false);
                  }}
                >
                  Account
                </Link> */}
                {children}
              </li>
              <li className="rounded dark:bg-neutral-700 p-1.5 w-full bg-slate-100 text-center hover:cursor-pointer">
                <Link href="/about" onClick={() => {
                  setIsOpened(false);
                }}>
                  About Us
                </Link>
              </li>
              <li className="rounded p-1.5 dark:bg-neutral-700 w-full bg-slate-100 text-center hover:cursor-pointer">
                <NewArticleBtn />
              </li>
              {/* <LogoutBtn /> */}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
