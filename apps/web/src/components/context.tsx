"use client";
import { createContext, useEffect, useRef, useState } from "react";
export const AppContext = createContext<{
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isAuthenticated: boolean;
  hamburderButtonRef: React.RefObject<HTMLDivElement>;
}>({
  isOpen: false,
  setIsOpen: () => {},
  isAuthenticated: false,
  hamburderButtonRef: {current: null},
});

export const ContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const hamburderButtonRef = useRef<HTMLDivElement>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  const checklogin = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/example/`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );
      if (response.ok) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
    }
    catch (error) {
      console.log("Network error");
    }
  }

  useEffect(() => {
    checklogin();
  }, []);

  return (
    <AppContext.Provider value={{ isOpen, setIsOpen, isAuthenticated, hamburderButtonRef }}>
      {children}
    </AppContext.Provider>
  );
};
