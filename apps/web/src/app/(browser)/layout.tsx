import type { Metadata } from "next";
import { Average } from "next/font/google";
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
import { UserProvider } from "@/context/auth-context";
import { User } from "@/types/user";
import { LoadingProvider, TriangleSpinner } from "@bookself/react-loading";
import { TopBar } from "@/components/TopBar";
import { GlobalSidebar, SidebarProvider } from "@/components/GlobalSidebar";
import ThemeSwitcher from "@/components/element/button/ThemeSwitchButton";
// import client from "@/lib/apolloClient";
import { createServerClient } from "@/lib/ServerClient";
import { gql } from "@apollo/client";
import { GraphQLData } from "@/types/graphql";
import { Toaster } from "@/components/ui/toaster";
import {
  organizationStructuredData,
  websiteStructuredData,
} from "@/lib/structured-data";
import GoogleAnalytics from "@/components/GoogleAnalytics";

const average = Average({ 
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

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
    "discovery",
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
  icons: {
    icon: [
      { url: "/icon.svg", sizes: "any" },
      { url: "/icon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/icon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/icon-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512x512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    other: [
      {
        rel: "mask-icon",
        url: "/safari-pinned-tab.svg",
        color: "#000000",
      },
    ],
  },
  openGraph: {
    title: "Infobite - Discover, Learn, and Share Knowledge",
    description:
      "Transform your curiosity into knowledge with Infobite. Explore bite-sized insights, trending topics, and expert perspectives.",
    url: "https://infobite.online",
    siteName: "Infobite",
    locale: "en_IN",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Infobite - Discover, Learn, and Share Knowledge",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Infobite - Discover, Learn, and Share Knowledge",
    description:
      "Transform your curiosity into knowledge with Infobite. Explore bite-sized insights and trending topics.",
    creator: "@infobite",
    images: ["/og-image.png"],
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
  params
}: Readonly<{
  children: React.ReactNode;
  params: { path?: string[] };
}>) {
  console.log(`Rendering RootLayout with params:`, params.path);
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
        <html lang="en" suppressHydrationWarning style={{ '--font-average': average.style.fontFamily } as React.CSSProperties}>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#000000" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
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
        className={`${average.className} dark:bg-[#121212] dark:text-slate-200`}
      >
        {/* Google Analytics */}
        {process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID && (
          <GoogleAnalytics GA_MEASUREMENT_ID={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID} />
        )}
        
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
            <UserProvider userData={user}>
              <ContextProvider>
                <SidebarProvider>
                  <TopBar />
                  <GlobalSidebar />
                  <div className="pt-14">
                    <div className="">{children}</div>
                  </div>
                </SidebarProvider>
              </ContextProvider>
            </UserProvider>
          </LoadingProvider>
        </ThemeProvider>
        {/* </ApolloProviderWrapper> */}
        <Toaster />
      </body>
    </html>
  );
}
