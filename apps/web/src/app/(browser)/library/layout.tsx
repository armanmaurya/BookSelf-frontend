"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";

const Layout = ({
  children, 
}: {
  children: React.ReactNode;
}) => {
  const path = usePathname();
  const [menuPosWidth, setMenuPosWidth] = useState({
    width: 0,
    left: 0,
  });

  useEffect(() => {
    const menu = document.getElementById(`${path.split("/").pop()}`);
    if (menu) {
      setMenuPosWidth({
        width: menu.offsetWidth,
        left: menu.offsetLeft,
      });

    }

    const menuBottomBar = document.getElementById("menu-bottom-bar");
    if (menuBottomBar) {
      menuBottomBar.classList.remove("hidden");
    }

    



  }, [path]);


  return (
    <div className="h-full flex flex-col pt-2 px-2 text-sm">
      <div className="w-80 relative flex font-light">
        <div id="my-article" className={`p-2 h-10 text-center`}>
          <Link className="cursor-pointer " href="my-article/">
            My Article
          </Link>
        </div>
        <div id="subscription" className={`p-2 h-10 text-center`}>
          <Link href="subscription/">Subscription</Link>
        </div>
        <div id="notebooks" className={`p-2 h-10 text-center`}>
          <Link href="notebooks/">Your Notebooks</Link>
        </div>
        <div
        style={{width: menuPosWidth.width, left: menuPosWidth.left}}
        id="menu-bottom-bar"
          className={`menu-animation top-0 hidden transition-all absolute h-10 w-32 p-2 border-b-2 border-slate-400 -z-10 bg-opacity-15`}
        ></div>
      </div>
      <div className="h-full w-full">{children}</div>
    </div>
  );
};

export default Layout;
