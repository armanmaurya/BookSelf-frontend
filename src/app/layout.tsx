import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
// import 'react-notifications-component/dist/theme.css'
// import 'animate.css/animate.min.css';
import AppBar from "./components/AppBar";
import SideBar from "./components/SideBar";
import { ContextProvider } from "./components/context";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};
export const revalidate = 3600;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} h-screen`}>
        <ContextProvider>
          <AppBar />
          <div className="flex overflow-auto">
            <SideBar />
            <div className="w-full h-full">{children}</div>
          </div>
        </ContextProvider>
      </body>
    </html>
  );
}
