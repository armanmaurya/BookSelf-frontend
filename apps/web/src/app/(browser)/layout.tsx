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
import { Toaster } from "@/components/ui/toaster"
import { organizationStructuredData, websiteStructuredData } from "@/lib/structured-data";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Infobite - Discover, Learn, and Share Knowledge",
  description:
    "Transform your curiosity into knowledge with Infobite. Explore bite-sized insights, trending topics, and expert perspectives. Join thousands of readers discovering fresh ideas daily on infobite.online",
  keywords: [
    "articles",
    "blog",
    "knowledge",
    "insights",
    "learning",
    "education",
    "trending topics",
    "expert perspectives",
    "infobite",
    "content platform",
    "reading",
    "discovery"
  ],
  authors: [{ name: "Infobite Team" }],
  creator: "Infobite",
  publisher: "Infobite",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://infobite.online"),
  alternates: {
    canonical: "https://infobite.online",
  },
  openGraph: {
    title: "Infobite - Discover, Learn, and Share Knowledge",
    description: "Transform your curiosity into knowledge with Infobite. Explore bite-sized insights, trending topics, and expert perspectives.",
    url: "https://infobite.online",
    siteName: "Infobite",
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Infobite - Discover, Learn, and Share Knowledge",
    description: "Transform your curiosity into knowledge with Infobite. Explore bite-sized insights and trending topics.",
    creator: "@infobite",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
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
        profilePicture
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
    <html lang="en-IN" suppressHydrationWarning>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="canonical" href="https://infobite.online" />
        <meta name="theme-color" content="#000000" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationStructuredData),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(websiteStructuredData),
          }}
        />
      </head>
      <body
        className={`${inter.className} dark:bg-[#121212] dark:text-slate-200`}
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
                    <div className="pt-14">
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
        <Toaster />
      </body>
    </html>
  );
}
