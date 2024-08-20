import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
// import 'react-notifications-component/dist/theme.css'
// import 'animate.css/animate.min.css';
import AppBar from "../../components/AppBar";
import SideBar from "../../components/SideBar";
import { ContextProvider } from "../../components/context";
import NextTopLoader from "nextjs-toploader";
import { ThemeProvider } from "next-themes";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title:
    "BookSelf - Your go-to destination for insightful and engaging articles",
  description:
    "Welcome to bookself.site, your go-to destination for insightful and engaging articles on a wide range of topics. Whether you're looking to stay informed, learn something new, or simply enjoy some quality reading time",
};
export const revalidate = 1;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.className} h-screen dark:bg-neutral-800 dark:text-slate-200`}
      >
        <ThemeProvider attribute="class">{children}</ThemeProvider>
      </body>
    </html>
  );
}
