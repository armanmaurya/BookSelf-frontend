"use client";
import RNotification from "@/app/components/RNotification";
import { Divider } from "@/app/components/decoration";
import { VerifyEmailForm } from "@/app/components/form";
import { GoolgeAuth } from "@/app/components/auth";
import { Suspense } from "react";

export default function Register() {
  return (
    <main className="h-full">
      <div className="flex flex-col items-center justify-center h-full">
        <div className="m-4">
          <Suspense>
            <GoolgeAuth redirect_path="/account/signup" />
          </Suspense>
        </div>
        <div className="w-80 my-3 rounded-full">
          <Divider />
        </div>
        <VerifyEmailForm />
      </div>
    </main>
  );
}
