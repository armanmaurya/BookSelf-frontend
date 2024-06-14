"use client";

import RNotification from "@/app/components/RNotification";

import { GoolgeAuth } from "@/app/components/auth";
import { LoginForm } from "@/app/components/form";
import { Divider } from "@/app/components/decoration";
import { Suspense, useContext, useEffect } from "react";
import { AppContext } from "@/app/components/context";

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
