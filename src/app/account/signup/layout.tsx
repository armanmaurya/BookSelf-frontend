"use client"
import { AppContext } from "@/components/context";
import RNotification from "@/components/RNotification";
import { useRouter } from "next/navigation";
import { useContext, useEffect } from "react";

export default function Articlelayout({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode;
}) {
  const context = useContext(AppContext);
  const router = useRouter();

  useEffect(() => {
    if (context.isAuthenticated) {
      window.location.href = "/";
    }
  })
  return (
    <main className="h-full">
      <RNotification />
      <div className="flex flex-col items-center justify-center h-full">
        {children}
      </div>
    </main>
  );
}
