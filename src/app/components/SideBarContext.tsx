"use client";
import { createContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

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
  const checkUser = async () => {
    try {
      console.log(localStorage.getItem("accessToken"));
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/token/verify/`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );
      if (response.ok) {
        setIsAuthenticated(true);
        if (window.location.pathname === "/login") {
          window.location.href = "/";
        }
        console.log("Authenticated");
      } else {
        console.log("access token expired, checking using refresh token");
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/token/refresh/`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              refresh: localStorage.getItem("refreshToken"),
            }),
          }
        );
        if (res.ok) {
          console.log("checking using refresh token");
          const data = await res.json();
          localStorage.setItem("accessToken", data.access);
          console.log("Authenticated");
          setIsAuthenticated(true);
          if (window.location.pathname === "/login") {
            window.location.href = "/";
          }
        } else {
          console.log("Not authenticated");
          setIsAuthenticated(false);
        }
      }
    } catch (error) {
      console.log("Network error");
    }
  };

  useEffect(() => {
    checkUser();
  }, []);

  return (
    <AppContext.Provider value={{ isOpen, setIsOpen, isAuthenticated }}>
      {children}
    </AppContext.Provider>
  );
};
