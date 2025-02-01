"use client";

import { useSideBar } from "./useSidebar";

interface SideBarElementProps {
  children: React.ReactNode;
  className?: string;
}

export const SideBarElement = ({ children, className }: SideBarElementProps) => {
  const sidebar = useSideBar();

  const handleClick = () => {
    sidebar.close();
  }

  return (
    <li onClick={handleClick} className={`p-2 rounded-lg text-center hover:cursor-pointer hover:bg-blue-400 hover:bg-opacity-20 text-sm sidebar-element ${className}`}>
      {children}
    </li>
  );
};