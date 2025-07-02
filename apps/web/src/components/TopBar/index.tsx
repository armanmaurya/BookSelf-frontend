"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ProfileIcon } from "./ProfileIcon";
import { SearchInput } from "../element/input";
import { NewArticleButton } from "../blocks/buttons/NewArticleBtn";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
} from "@/components/ui/navigation-menu";
import { navigationMenuTriggerStyle } from "@/components/ui/navigation-menu";
import { HomeIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { FaPenNib } from "react-icons/fa";

export const TopBar = () => {
  const [prevScrollPos, setPrevScrollPos] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPos = window.scrollY;

      // Always show header when at top of page
      if (currentScrollPos === 0) {
        setVisible(true);
        return;
      }

      // Show/hide based on scroll direction
      setVisible(prevScrollPos > currentScrollPos || currentScrollPos < 10);
      setPrevScrollPos(currentScrollPos);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [prevScrollPos]);

  return (
    <AnimatePresence initial={false}>
      {visible && (
        <motion.header
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          exit={{ y: -100 }}
          transition={{ type: "spring", damping: 20, stiffness: 300 }}
          className="w-full h-14 border-b sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
        >
          <nav className="container flex items-center justify-between h-full px-4">
            {/* Left side - Logo and Navigation */}
            <div className="flex items-center gap-6">
              <Link href="/" className="flex items-center gap-2">
                <HomeIcon className="h-5 w-5" />
                <span className="text-lg font-semibold">Home</span>
              </Link>
            </div>

            {/* Center - Search */}
            <div className="flex-1 max-w-md mx-4">
              {/* Show search input on md+ screens, icon button on small screens */}
              <div className="hidden md:block">
                <SearchInput />
              </div>
              <div className="md:hidden flex justify-end">
                <Button variant="ghost" size="icon" aria-label="Search">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <circle
                      cx="11"
                      cy="11"
                      r="7"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                    <line
                      x1="21"
                      y1="21"
                      x2="16.65"
                      y2="16.65"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                </Button>
              </div>
            </div>

            {/* Right side - Actions */}
            <div className="flex items-center gap-3">
              <div className="hidden md:flex items-center gap-2">
                <NewArticleButton>
                  <FaPenNib className="h-4 w-4" />
                  <span>Write</span>
                </NewArticleButton>
              </div>
              <ProfileIcon />
            </div>
          </nav>
        </motion.header>
      )}
    </AnimatePresence>
  );
};
