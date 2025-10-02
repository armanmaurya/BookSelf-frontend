import RNotification from "@/components/RNotification";
import { GoolgeAuth } from "@/components/auth";
import { Suspense } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function Login() {
  const cookieStore = cookies();

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/example/`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Cookie: `${cookieStore.get("sessionid")?.name}=${
        cookieStore.get("sessionid")?.value
      }`,
    },
  });
  if (res.ok) {
    redirect("/");
  } else {
    console.log("Error", res);
  }

  return (
    <main className="h-screen">
      <RNotification />
      <div className="flex h-full">
        {/* Left Panel - Hero/Branding */}
        <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary/5 via-background rounded-md to-secondary/10 relative overflow-hidden">
          <div className="absolute inset-0 opacity-30" style={{
            backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.02'%3E%3Cpath d='m36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")"
          }} />
          
          <div className="relative z-10 flex flex-col justify-center px-12 py-16">
            <div className="max-w-lg">
              {/* Logo/Brand */}
              <div className="mb-8">
                <h1 className="text-4xl font-bold text-foreground mb-2">BookSelf</h1>
                <div className="w-12 h-1 bg-primary rounded-full" />
              </div>
              
              {/* Hero Text */}
              <div className="space-y-6">
                <h2 className="text-3xl font-semibold text-foreground leading-tight">
                  Your Personal Library,
                  <span className="text-primary"> Reimagined</span>
                </h2>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Discover, organize, and share your favorite books in a beautiful, intuitive interface. 
                  Join thousands of readers building their digital libraries.
                </p>
              </div>
              
              {/* Feature highlights */}
              <div className="mt-12 space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-primary rounded-full" />
                  <span className="text-sm text-muted-foreground">Smart book recommendations</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-primary rounded-full" />
                  <span className="text-sm text-muted-foreground">Rich reading insights</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-primary rounded-full" />
                  <span className="text-sm text-muted-foreground">Connect with fellow readers</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel - Authentication */}
        <div className="flex-1 lg:w-1/2 flex items-center justify-center px-8 py-16">
          <div className="w-full max-w-md">
            {/* Mobile Brand Header */}
            <div className="lg:hidden text-center mb-8">
              <h1 className="text-2xl font-bold text-foreground mb-2">BookSelf</h1>
              <p className="text-muted-foreground">Welcome back to your library</p>
            </div>

            <div className="bg-card border border-border rounded-lg shadow-sm p-8">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-semibold text-card-foreground mb-2">Sign In</h2>
                <p className="text-muted-foreground">Continue to your personal library</p>
              </div>

              <div className="space-y-6">
                <Suspense>
                  <div className="flex justify-center">
                    <GoolgeAuth redirect_path="/signin" />
                  </div>
                </Suspense>
              </div>
            </div>

            <div className="mt-8 text-center">
              <p className="text-xs text-muted-foreground">
                By continuing, you agree to our{" "}
                <a href="/terms" className="underline hover:text-foreground">Terms of Service</a>{" "}
                and{" "}
                <a href="/privacy" className="underline hover:text-foreground">Privacy Policy</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
