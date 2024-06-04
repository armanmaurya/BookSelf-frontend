import React, { use, useContext } from "react";
import Link from "next/link";
import CheckCreadential from "./CheckCreadential";
import HamburgerIcon from "./HamburgerIcon";
import ProfileIcon from "./profileIcon";
import SearchBar from "./searchbar";

const AppBar = () => {

  return (
    <header className="text-black font-serif bg-slate-50 shadow-md">
      <nav className=" flex justify-between items-center h-12 pr-2">
        <ul className="flex flex-1 space-x-2 items-center">
          <li>
            <HamburgerIcon/>
          </li>
          <li>
            <Link className="text-3xl font-semibold" href="/">Home</Link>
          </li>
        </ul>
        <ul className="flex-1">
          <SearchBar/>
        </ul>
        <ul className="flex flex-1 flex-row-reverse space-x-4">
            <ProfileIcon />
        </ul>
      </nav>
    </header>
  );
};

export default AppBar;
