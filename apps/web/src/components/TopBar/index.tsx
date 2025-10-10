"use client";
import { useState } from "react";
import Link from "next/link";
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
import { HomeIcon, Plus, BookOpen, Search, Sparkles, X } from "lucide-react";
import { FaPenNib } from "react-icons/fa";
import { HamburgerMenuButton } from "./HamburgerMenuButton";

export const TopBar = () => {
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  return (
    <header className="w-full h-16 border-b fixed top-0 z-50 bg-gradient-to-r from-background via-background to-background/95 backdrop-blur-md supports-[backdrop-filter]:bg-background/80 shadow-sm">
      <nav className="container flex items-center justify-between h-full px-4 lg:px-6 relative">
        {/* Mobile Search Overlay - Expands over the entire TopBar */}
        <div 
          className={`
            absolute inset-0 bg-background z-50 md:hidden
            flex items-center gap-3 px-4
            transition-transform duration-300 ease-in-out
            ${mobileSearchOpen ? 'translate-y-0' : '-translate-y-full'}
          `}
        >
          <div className="flex-1">
            <SearchInput />
          </div>
          <Button 
            variant="ghost" 
            size="icon"
            className="hover:bg-muted shrink-0"
            aria-label="Close search"
            onClick={() => setMobileSearchOpen(false)}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Left side - Logo and Navigation */}
        <div className="flex items-center gap-6">
          <Link 
            href="/" 
            className="flex items-center gap-2.5 group transition-all hover:scale-105"
          >
            <div className="relative">
              <BookOpen className="h-6 w-6 text-primary transition-transform group-hover:rotate-6" />
              <Sparkles className="h-3 w-3 text-primary/60 absolute -top-1 -right-1 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              Infobite
            </span>
          </Link>
        </div>

        {/* Center - Search */}
        <div className="flex-1 max-w-xl mx-6 lg:mx-8">
          {/* Show search input on md+ screens */}
          <div className="hidden md:block">
            <SearchInput />
          </div>
          <div className="md:hidden flex justify-end">
            <Button 
              variant="ghost" 
              size="icon"
              className="hover:bg-primary/10 hover:text-primary transition-colors"
              aria-label="Search"
              onClick={() => setMobileSearchOpen(true)}
            >
              <Search className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Right side - Actions */}
        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-2">
            <Button 
              asChild
              className="bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-md hover:shadow-lg transition-all"
            >
              <Link href="/new" className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                <span className="font-medium">New</span>
              </Link>
            </Button>
          </div>
          <div className="md:hidden">
            <Button 
              asChild
              size="icon"
              className="bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-md hover:shadow-lg transition-all"
            >
              <Link href="/new">
                <Plus className="h-5 w-5" />
              </Link>
            </Button>
          </div>
          <ProfileIcon />
        </div>
      </nav>
    </header>
  );
};
