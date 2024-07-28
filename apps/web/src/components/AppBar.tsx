import React, { use, useContext } from "react";
import Link from "next/link";
import { HamburgerIcon } from "./decoration";
import ProfileIcon from "./profileIcon";
import { SearchInput } from "./element/input";
import ThemeSwitcher from "./element/button/ThemeSwitchButton";

const AppBar = () => {
  return (
    <header className="shadow-md fixed dark:bg-neutral-800 bg-white w-full h-12">
      <nav className=" flex justify-between items-center  pr-2">
        <div className="flex flex-1 space-x-2 w-full items-center justify-between">
          <div className="flex items-center">
            <HamburgerIcon />
            <Link className="text-3xl font-semibold" href="/">
              Home
            </Link>
          </div>
          <SearchInput />
          <div className="flex">
            <ThemeSwitcher />
            <ProfileIcon />
          </div>
        </div>
      </nav>
    </header>
  );
};

export default AppBar;
