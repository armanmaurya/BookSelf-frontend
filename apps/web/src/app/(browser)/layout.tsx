import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
// import 'react-notifications-component/dist/theme.css'
// import 'animate.css/animate.min.css';
import AppBar from "../../components/AppBar";
import { SideBar, SideBarElement } from "@/components/blocks/Sidebar";
import { ContextProvider } from "../../components/context";
import NextTopLoader from "nextjs-toploader";
import { ThemeProvider } from "next-themes";
import { IoBookOutline, IoLibrary, IoPaperPlane } from "react-icons/io5";
import { cookies } from "next/headers";
import { API_ENDPOINT } from "../utils";
import { SlNote } from "react-icons/sl";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title:
    "BookSelf - Your go-to destination for insightful and engaging articles",
  description:
    "Welcome to bookself.site, your go-to destination for insightful and engaging articles on a wide range of topics. Whether you're looking to stay informed, learn something new, or simply enjoy some quality reading time",
};
export const revalidate = 1;

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = cookies();
  const res = await fetch(`${API_ENDPOINT.googleAuth.url}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Cookie: `${cookieStore.get("sessionid")?.name}=${cookieStore.get("sessionid")?.value
        }`,
    },
  });
  let data = {
    username: ""
  };
  if (res.ok) {
    data = await res.json();
  } else {
    console.log("Error", res);
  }
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.className} h-screen dark:bg-neutral-800 dark:text-slate-200`}
      >
        <ThemeProvider attribute="class" enableSystem>
          <NextTopLoader />

          <ContextProvider>
            <AppBar />
            <div className="h-full w-full">
              <div className="h-full pt-12">{children}</div>
              <SideBar>
                <SideBarElement href="/library/my-article">
                  <IoLibrary size={20} className="" />
                  <span className="pl-3">Library</span>
                </SideBarElement>
                <SideBarElement href={`/notebook/${data.username}/`}>
                  <IoBookOutline size={20} className="" />
                  <span className="pl-3">Your Notebook</span>
                </SideBarElement>
                <SideBarElement href={`/article/${data.username}/`}>
                  <SlNote size={20} className="" />
                  <span className="pl-3">Your Articles</span>
                </SideBarElement>
              </SideBar>
            </div>
          </ContextProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
