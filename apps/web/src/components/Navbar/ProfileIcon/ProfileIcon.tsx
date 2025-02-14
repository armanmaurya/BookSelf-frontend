"use client";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { FaUser } from "react-icons/fa";
import { IoIosLogOut } from "react-icons/io";
import { SlNotebook } from "react-icons/sl";
import { LogoutBtn } from "../../element/button/LogoutBtn";

export const ProfileIcon = ({ username }: { username: string }) => {
  const [isClick, setIsClick] = useState(false);

  const toggleClick = () => {
    setIsClick(!isClick);
  };

  const ref = useRef<HTMLDivElement>(null);

  const handleClickOutside = (e: MouseEvent) => {
    if (ref.current && !ref.current.contains(e.target as Node)) {
      setIsClick(false);
    }
  }

  const handleEsc = (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      setIsClick(false);
    }
  }

  useEffect(() => {
    window.addEventListener("keydown", handleEsc);
    window.addEventListener("mousedown", handleClickOutside);
    return () => {
      window.removeEventListener("keydown", handleEsc);
      window.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isClick]);

  return (
    <div ref={ref}>
      <div
        className="rounded-full border cursor-pointer shadow-md"
        onClick={toggleClick}
      >
        <img
          className="h-10 object-fill"
          src="https://upload.wikimedia.org/wikipedia/commons/9/99/Sample_User_Icon.png"
          alt=""
        />
      </div>
      <AnimatePresence>
        {isClick && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-14 right-2"
          >
            <div className="">
              <div className="flex justify-end mr-4">
                <div
                  className="dark:bg-neutral-500 h-2 w-2 right-4"
                  style={{ clipPath: "polygon(50% 0, 100% 100%, 0% 100%)" }}
                ></div>
              </div>
              <div className="dark:bg-neutral-500 p-2 rounded-lg shadow-lg min-w-44">
                <div className="flex flex-col space-y-2">
                  <Link
                    href={`/${username}`}
                    className="flex space-x-2 items-center"
                    onClick={toggleClick}
                  >
                    <FaUser />
                    <span>Profile</span>
                  </Link>
                  <Link
                    className="flex space-x-2 items-center"
                    href={`/${username}/notebook`}
                    onClick={toggleClick}
                  >
                    <SlNotebook />
                    <span>Your Notebooks</span>
                  </Link>
                  <LogoutBtn className="flex space-x-2 items-center">
                    <IoIosLogOut />
                    <span>Logout</span>
                  </LogoutBtn>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
