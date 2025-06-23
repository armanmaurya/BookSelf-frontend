import { Divider } from "@/components/decoration";
import { VerifyEmailForm } from "@/components/blocks/form";
import { GoolgeAuth } from "@/components/auth";
import { Suspense } from "react";



export default async function SignUpPage() {
  return (
    <main className="h-full">
      <div className="flex flex-col items-center justify-center absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <div className="m-4">
          <Suspense>
            <GoolgeAuth redirect_path="/signup" />
          </Suspense>
        </div>
        {/* <div className="w-80 my-3 rounded-full">
          <Divider />
        </div> */}
        {/* <VerifyEmailForm /> */}
      </div>
    </main>
  );
}
