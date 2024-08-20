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
    if (currentPath.includes("info")) {
      return "start-home";
    } else if (currentPath.includes("security")) {
      return "start-security";
    }
  };
  return (
    <div className="h-full w-full flex flex-grow mt-5">
      <div className="w-80 h-full relative">
        <div className={`p-2 h-10 text-center`}>
          <Link className="cursor-pointer " href="info/">
            Personal info
          </Link>
        </div>
        <div className={`p-2 h-10 text-center`}>
          <Link href="security/">Security</Link>
        </div>
        <div
          className={`menu-animation ${getCurrentPathClass()} transition-all absolute h-10 w-full p-2 bg-slate-300 -z-10 bg-opacity-15 rounded-r-full`}
        ></div>
      </div>
      <div className="h-full w-full text-center">{children}</div>
    </div>
  );
};

export default Layout;
