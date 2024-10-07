"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

const Layout = ({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode;
}) => {
  const currentPath = usePathname();
  const getCurrentPathClass = () => {
    console.log(window.innerWidth);
    if (window.innerWidth > 1024) {
      if (currentPath.includes("info")) {
        return "start-home";
      } else if (currentPath.includes("security")) {
        return "start-security";
      }
    } else {
      if (currentPath.includes("info")) {
        return "start-my-article";
      } else if (currentPath.includes("security")) {
        return "start-subscription";
      }
    }
    
  };
  console.log(currentPath)
  return (
    <div className="w-full flex flex-grow mt-5 flex-col lg:flex-row">
      <div className="w-80 h-full relative flex items-center flex-row lg:flex-col">
        <div className={`p-2 h-10 w-32 text-center`}>
          <Link className="cursor-pointer " href="personal-info/">
            Personal info
          </Link>
        </div>
        <div className={`p-2 h-10 w-32 text-center`}>
          <Link href="security/">Security</Link>
        </div>
        <div
          className={`menu-animation ${getCurrentPathClass()} transition-all absolute h-10 w-32 lg:w-full p-2 border-b-2 lg:border-0 lg:bg-slate-300 -z-10 lg:bg-opacity-15 lg:rounded-r-full`}
        ></div>
      </div>
      <div className="h-full w-full text-center p-4">{children}</div>
    </div>
  );
};

export default Layout;
