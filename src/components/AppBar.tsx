import React, { use, useContext } from "react";
import Link from "next/link";
import { HamburgerIcon } from "./decoration";
import ProfileIcon from "./profileIcon";
import { SearchInput } from "./element/input";
import ThemeSwitcher from "./element/button/ThemeSwitchButton";

const AppBar = () => {
  return (
    <header className="shadow-md">
      <nav className=" flex justify-between items-center h-12 pr-2">
        <ul className="flex flex-1 space-x-2 w-full items-center">
          <li>
            <HamburgerIcon />
          </li>
          <li className="w-full text-center sm:text-left">
            <Link className="text-3xl font-semibold" href="/">
              Home
            </Link>
          </li>
        </ul>
        <ul className="flex-1 hidden sm:block">
          <SearchInput />
        </ul>
        <ul className="sm:flex flex-1 flex-row-reverse space-x-4 hidden items-center">
          <ProfileIcon />
          <ThemeSwitcher />
        </ul>
      </nav>
    </header>
  );
};

export default AppBar;
