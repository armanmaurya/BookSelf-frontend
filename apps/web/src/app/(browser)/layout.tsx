import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
import {
  SideBar,
  SideBarElement,
  SideBarProvider,
} from "@bookself/react-sidebar";
import { ContextProvider } from "../../components/context";
import NextTopLoader from "nextjs-toploader";
import { ThemeProvider } from "next-themes";
import { IoBookOutline, IoLibrary, IoPaperPlane } from "react-icons/io5";
import { cookies } from "next/headers";
import { API_ENDPOINT } from "../utils";
import { SlNote } from "react-icons/sl";
import { AuthProvider } from "@/context/AuthContext";
import { User } from "@/types/auth";
import { LoadingProvider, TriangleSpinner } from "@bookself/react-loading";
import { TopBar } from "@/components/TopBar";
import ThemeSwitcher from "@/components/element/button/ThemeSwitchButton";
import { ApolloProviderWrapper } from "@/context/ApolloProvider";
// import client from "@/lib/apolloClient";
import { createServerClient } from "@/lib/ServerClient";
import { gql } from "@apollo/client";
import { GraphQLData } from "@/types/graphql";

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
  const QUERY = gql`
    query MyQuery {
      me {
        username
        email
        firstName
        lastName
      }
    }
  `;
  const cookieStore = cookies();
  const {
    data,
  }: {
    data: GraphQLData;
  } = await createServerClient().query({ query: QUERY });
  let user: User | null = data.me;
  console.log("User", user);
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.className} h-screen dark:bg-neutral-800 dark:text-slate-200`}
      >
        {/* <ApolloProviderWrapper> */}
          <ThemeProvider attribute="class" enableSystem>
            <NextTopLoader />
            <ThemeSwitcher className="fixed right-2 bottom-4" />
            <LoadingProvider>
              <TriangleSpinner
                className="absolute h-screen w-screen bg-black bg-opacity-30 left-0 top-0 flex items-center justify-center"
                height={100}
                width={100}
                color="grey"
              />
              <AuthProvider userData={user}>
                <ContextProvider>
                  <SideBarProvider>
                    <TopBar />
                    <div className="h-auto">
                      <div className="p-3">{children}</div>
                      <SideBar className="w-40">
                        {/* <SideBarElement className="flex">
                          <IoLibrary size={20} className="" />
                          <span className="pl-3">Library</span>
                        </SideBarElement>
                        <SideBarElement className="flex">
                          <IoBookOutline size={20} className="" />
                          <span className="pl-3">Your Notebook</span>
                        </SideBarElement> */}
                        <SideBarElement className="flex">
                          <SlNote size={20} className="" />
                          <span className="pl-3">Nothing</span>
                        </SideBarElement>
                      </SideBar>
                    </div>
                  </SideBarProvider>
                </ContextProvider>
              </AuthProvider>
            </LoadingProvider>
          </ThemeProvider>
        {/* </ApolloProviderWrapper> */}
      </body>
    </html>
  );
}
