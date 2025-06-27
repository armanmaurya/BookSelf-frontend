import React, { use, useContext } from "react";
import Link from "next/link";
import { HamburgerIcon } from "../decoration";
import { ProfileIcon } from "./ProfileIcon";
import { SearchInput } from "../element/input";
import { NewArticleButton } from "./newArticleBtn";

export const TopBar = () => {
  return (
    <header className="w-full h-12 z-50">
      <nav className="bg-white flex justify-between items-center dark:bg-[#121212] w-full p-2 pl-7 fixed z-50">
        <div className="flex flex-1 space-x-2 w-full items-center justify-between relative">
          <div className="flex items-center">
            {/* <HamburgerIcon /> */}
            <Link className="text-3xl font-semibold" href="/">
              Home
            </Link>
          </div>
          <SearchInput />
          <div className="flex space-x-3 items-center">
            <NewArticleButton />
            <ProfileIcon />
          </div>
        </div>
      </nav>
    </header>
  );
};
