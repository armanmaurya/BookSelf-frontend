"use client";
import { API_ENDPOINT } from "@/app/utils";

export const LogoutBtn = ({
  className,
  children,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  const logout = async () => {
    try {
      const res = await fetch(API_ENDPOINT.logout.url, {
        method: API_ENDPOINT.logout.method,
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (res.ok) {
        console.log("Logout successful");
        window.location.href = "/signin";
      }
    } catch (error) {
      console.log("Network error");
    }
  };
  return (
    <button onClick={logout} className={`${className}`}>
      {children}
    </button>
  );
};
