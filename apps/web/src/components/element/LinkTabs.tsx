"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

interface LinkTabsProps {
  tabs: {
    name: string;
    href: string;
  }[];
  className?: string;
}

export const LinkTabs = ({ tabs, className }: LinkTabsProps) => {
  const searchParams = useSearchParams();
  const activeTab = searchParams.get("tab") || tabs[0]?.name.toLowerCase(); // Default to first tab

  return (
    <div className={`flex ${className}`}>
      <div className="flex space-x-4 shadow-md p-2 rounded-full bg-gray-200 dark:bg-neutral-700 relative">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.name.toLowerCase();

          return (
            <Link key={tab.name} href={`${tab.href}`} className="relative">
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 bg-blue-400 rounded-lg"
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                />
              )}
              <span className="py-2 px-4 relative">
                {tab.name.charAt(0).toUpperCase() + tab.name.slice(1)}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};
