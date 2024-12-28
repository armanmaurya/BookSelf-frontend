"use client";
import { API_ENDPOINT } from "@/app/utils";

export const LogoutBtn = () => {
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
    <button onClick={logout} className=" dark:bg-neutral-700 bg-slate-100 rounded p-1.5 w-full">
      Logout
    </button>
  );
};
