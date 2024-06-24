"use client";
import { createContext, useEffect, useState } from "react";
export const AppContext = createContext<{
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isAuthenticated: boolean;
}>({
  isOpen: false,
  setIsOpen: () => {},
  isAuthenticated: false,
});

export const ContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
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
    <AppContext.Provider value={{ isOpen, setIsOpen, isAuthenticated }}>
      {children}
    </AppContext.Provider>
  );
};
