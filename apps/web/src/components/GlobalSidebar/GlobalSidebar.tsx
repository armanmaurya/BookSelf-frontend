"use client";
import { useState, createContext, useContext, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { 
  FaHome, 
  FaBookOpen, 
  FaSearch, 
  FaUser, 
  FaPenNib,
  FaSignInAlt,
  FaUserPlus,
  FaCog,
  FaTimes,
  FaBook
} from "react-icons/fa";
import { useUser } from "@/hooks/use-user";

interface SidebarContextType {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  toggleSidebar: () => void;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
};

interface SidebarProviderProps {
  children: React.ReactNode;
}

export const SidebarProvider = ({ children }: SidebarProviderProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => setIsOpen(!isOpen);

  // Close sidebar when clicking outside or pressing Escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  return (
    <SidebarContext.Provider value={{ isOpen, setIsOpen, toggleSidebar }}>
      {children}
    </SidebarContext.Provider>
  );
};

interface GlobalSidebarProps {
  className?: string;
}

export const GlobalSidebar = ({ className }: GlobalSidebarProps) => {
  const { isOpen, setIsOpen } = useSidebar();
  const { user } = useUser();

  const closeSidebar = () => setIsOpen(false);

  const navigationItems = [
    {
      href: "/",
      icon: FaHome,
      label: "Home",
      requiresAuth: false,
    },
    {
      href: "/notebooks",
      icon: FaBook,
      label: "Notebooks",
      requiresAuth: false,
    },
  ];

  const userItems = user ? [
    {
      href: `/user/${user.username}`,
      icon: FaUser,
      label: "My Profile",
      requiresAuth: true,
    },
    {
      href: "/new",
      icon: FaPenNib,
      label: "Create",
      requiresAuth: true,
    },
    {
      href: "/settings/profile",
      icon: FaCog,
      label: "Settings",
      requiresAuth: true,
    },
  ] : [
    {
      href: "/signin",
      icon: FaSignInAlt,
      label: "Sign In",
      requiresAuth: false,
    },
    {
      href: "/signup",
      icon: FaUserPlus,
      label: "Sign Up",
      requiresAuth: false,
    },
  ];

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/70 z-40 animate-in fade-in duration-300"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 h-full w-80 bg-background border-r border-border z-50 transform transition-transform duration-300 ease-in-out",
          isOpen ? "translate-x-0" : "-translate-x-full",
          className
        )}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border">
            <Link href="/" onClick={closeSidebar} className="flex items-center gap-2">
              <FaBookOpen className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold">Infobite</span>
            </Link>
            <Button
              variant="ghost"
              size="icon"
              onClick={closeSidebar}
              className="h-8 w-8"
            >
              <FaTimes className="h-4 w-4" />
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto">
            <div className="p-4 space-y-2">
              {/* Main Navigation */}
              <div className="space-y-1">
                {navigationItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={closeSidebar}
                    className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                  >
                    <item.icon className="h-4 w-4" />
                    {item.label}
                  </Link>
                ))}
              </div>

              <div className="border-t border-border my-4" />

              {/* User Section */}
              <div className="space-y-1">
                {user && (
                  <>
                    {user && (
                      <div className="px-3 py-2 mb-2">
                        <div className="flex items-center gap-3">
                          {user.profilePicture ? (
                            <img
                              src={user.profilePicture}
                              alt={user.username}
                              className="h-8 w-8 rounded-full"
                            />
                          ) : (
                            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                              <FaUser className="h-4 w-4 text-primary" />
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">
                              {user.firstName} {user.lastName}
                            </p>
                            <p className="text-xs text-muted-foreground truncate">
                              @{user.username}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {userItems.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={closeSidebar}
                        className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                      >
                        <item.icon className="h-4 w-4" />
                        {item.label}
                      </Link>
                    ))}
                  </>
                )}
              </div>
            </div>
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-border">
            <p className="text-xs text-muted-foreground text-center">
              © 2025 Infobite. All rights reserved.
            </p>
          </div>
        </div>
      </aside>
    </>
  );
};