"use client";

import { useContext, useState } from "react";
import { AppContext } from "./context";

const SideBar = () => {
  const sideBarState = useContext(AppContext);
  return (
    <div className={`${sideBarState.isOpen ? "w-44" : "w-0"} overflow-hidden sha transition-all ease-in-out`}>
      <ul className="p-4 border m-2 flex flex-col h-full rounded">
        <li>Home</li>
        <li>About</li>
        <li>Upload</li>
      </ul>
    </div>
  );
};

export default SideBar;
