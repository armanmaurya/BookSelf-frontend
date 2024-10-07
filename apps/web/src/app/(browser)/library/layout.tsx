"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRouter } from "next/router";
import React from "react";

const Layout = ({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode;
}) => {
  const currentPath = usePathname();
 
  const getCurrentPathClass = () => {
    if (currentPath.includes("my-article")) {
      return "start-my-article";
    } else if (currentPath.includes("subscription")) {
      return "start-subscription";
    }
  };
  return (
    <div className="h-full flex flex-col pt-2 px-2 text-sm">
      <div className="w-80 relative flex font-light">
        <div className={`p-2 h-10 text-center w-32`}>
          <Link className="cursor-pointer " href="my-article/"> 
            My Article
          </Link>
        </div>
        <div className={`p-2 h-10 text-center w-32`}>
          <Link href="subscription/">Subscription</Link>
        </div>
        <div
          className={`menu-animation ${getCurrentPathClass()} top-0 transition-all absolute h-10 w-32 p-2 border-b-2 border-slate-400 -z-10 bg-opacity-15`}
        ></div>
      </div>
      <div className="h-full w-full">{children}</div>
    </div>
  );
};

export default Layout;
