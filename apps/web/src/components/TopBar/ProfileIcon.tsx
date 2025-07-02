"use client";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { FaUser, FaHistory } from "react-icons/fa";
import { IoIosLogOut } from "react-icons/io";
import { IoDocumentText, IoFileTrayStackedOutline } from "react-icons/io5";
import { SlSettings } from "react-icons/sl";
import { useAuth } from "@/context/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";

export const ProfileIcon = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();

  if (!user) {
    return (
      <div className="flex gap-2">
        <Button variant="outline" asChild>
          <Link href="/signin">Login</Link>
        </Button>
        <Button asChild>
          <Link href="/signup">Sign Up</Link>
        </Button>
      </div>
    );
  }

  return (
    <div ref={ref} className="relative">
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-8 w-8 rounded-full">
            <Avatar className="h-8 w-8">
              <AvatarImage src={user.profilePicture} />
              <AvatarFallback>
                {user.username?.charAt(0).toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <AnimatePresence>
          {isOpen && (
            <DropdownMenuContent
              align="end"
              className="w-56"
              asChild
              forceMount
            >
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <DropdownMenuItem asChild className="cursor-pointer">
                  <Link
                    href={`/user/${user.username}`}
                    className="flex items-center w-full cursor-pointer"
                  >
                    <FaUser className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="cursor-pointer">
                  <Link
                    href={`/user/${user.username}/?tab=articles`}
                    className="flex items-center w-full cursor-pointer"
                  >
                    <IoDocumentText className="mr-2 h-4 w-4" />
                    <span>Your Articles</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="cursor-pointer">
                  <Link
                    href={`/user/${user.username}/?tab=collections`}
                    className="flex items-center w-full cursor-pointer"
                  >
                    <IoFileTrayStackedOutline className="mr-2 h-4 w-4" />
                    <span>Your Collections</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="cursor-pointer">
                  <Link
                    href="/settings/profile"
                    className="flex items-center w-full cursor-pointer"
                  >
                    <SlSettings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="cursor-pointer text-destructive focus:text-destructive"
                  onClick={logout}
                >
                  <IoIosLogOut className="mr-2 h-4 w-4" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </motion.div>
            </DropdownMenuContent>
          )}
        </AnimatePresence>
      </DropdownMenu>
    </div>
  );
};