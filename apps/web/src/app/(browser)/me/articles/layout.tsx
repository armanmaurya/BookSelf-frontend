"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

export default function ArticlesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const currentTab = pathname.split("/").pop();
  const tabs = ["draft", "public"];

  return (
    <div className="">
      {/* Tab Navigation */}
      <div className="fixed right-1/2 translate-x-1/2">
        <div className="flex space-x-4 shadow-md p-2 w-full rounded-full bg-neutral-700">
          {tabs.map((tab) => {
            const isActive = currentTab === tab;
            return (
              <Link key={tab} href={`${tab}`} className="relative">
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-blue-400 rounded-lg"
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  />
                )}
                <span className="py-2 px-4 relative text-white">
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Page Content */}
      <div>
        <div className="pt-12">{children}</div>
      </div>
    </div>
  );
}
