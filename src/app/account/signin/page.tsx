"use client";

import RNotification from "@/components/RNotification";

import { GoolgeAuth } from "@/components/auth";
import { LoginForm } from "@/components/blocks/form";
import { Divider } from "@/components/decoration";
import { Suspense, useContext, useEffect } from "react";
import { AppContext } from "@/components/context";

export default function Login() {
  const context = useContext(AppContext);

  useEffect(() => {
    if (context.isAuthenticated) {
      window.location.href = "/";
    }
  })
  return (
    <main className="h-full">
      <RNotification />
      <div className="flex flex-col items-center justify-center h-full">
        <div className="m-4">
          <Suspense>
            <GoolgeAuth redirect_path="/account/signin" />
          </Suspense>
        </div>
        <div className="w-80 my-3 rounded-full">
          <Divider />
        </div>
        <LoginForm />
      </div>
    </main>
  );
}
