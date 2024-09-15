import { Divider } from "@/components/decoration";
import { VerifyEmailForm } from "@/components/blocks/form";
import { GoolgeAuth } from "@/components/auth";
import { Suspense } from "react";



export default async function Register() {
  return (
    <main className="h-full">
      <div className="flex flex-col items-center justify-center h-full">
        <div className="m-4">
          <Suspense>
            <GoolgeAuth redirect_path="/auth/signup" />
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
