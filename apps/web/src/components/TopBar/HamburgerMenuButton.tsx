"use client";
import { Button } from "@/components/ui/button";
import { useSidebar } from "@/components/GlobalSidebar";
import { FaBars } from "react-icons/fa";

export const HamburgerMenuButton = () => {
  const { toggleSidebar } = useSidebar();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleSidebar}
      className="h-8 w-8"
      aria-label="Open menu"
    >
      <FaBars className="h-4 w-4" />
    </Button>
  );
};