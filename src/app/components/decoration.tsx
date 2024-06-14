"use client";
import { useContext } from "react";
import { AppContext } from "./context";
import { Divide as Hamburger } from "hamburger-react";
export const Divider = () => {
  return (
    <div className="w-full flex h-full justify-center items-center">
      <div className="w-full h-0.5 bg-gray-300"></div>
      <span className="mx-2">OR</span>
      <div className="w-full h-0.5 bg-gray-300"></div>
    </div>
  );
};

export const HamburgerIcon = () => {
  const sideBarState = useContext(AppContext);
  console.log("context", sideBarState)
return (
  <div>
      {sideBarState && (
          <Hamburger size={20} toggled={sideBarState.isOpen} toggle={sideBarState.setIsOpen}/>
      )}
  </div>
)
}
