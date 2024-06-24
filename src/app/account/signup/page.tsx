"use client";
import RNotification from "@/components/RNotification";
import { Divider } from "@/components/decoration";
import { VerifyEmailForm } from "@/components/block/form";
import { GoolgeAuth } from "@/components/auth";
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
