"use client";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

interface Tab {
  value: string;
  label: string;
}

interface AnimatedTabsProps {
  tabs: Tab[];
  activeTab: string;
  username: string;
}

export const AnimatedTabs = ({ tabs, activeTab, username }: AnimatedTabsProps) => {
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    const activeIndex = tabs.findIndex((tab) => tab.value === activeTab);
    const activeTabElement = tabRefs.current[activeIndex];

    if (activeTabElement) {
      const { offsetLeft, offsetWidth } = activeTabElement;
      setIndicatorStyle({
        left: offsetLeft,
        width: offsetWidth,
      });
    }
  }, [activeTab, tabs]);

  return (
    <Tabs value={activeTab} className="mb-6">
      <div className="relative">
        <TabsList className="relative bg-transparent border-b border-border rounded-none p-0 h-auto">
          {tabs.map((tab, index) => (
            <Link 
              href={`/user/${username}?tab=${tab.value}`} 
              key={tab.value}
              scroll={false}
            >
              <TabsTrigger
                ref={(el) => {
                  tabRefs.current[index] = el;
                }}
                value={tab.value}
                className="relative bg-transparent border-0 rounded-none px-4 py-3 data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:text-primary font-medium transition-colors hover:text-primary/80"
              >
                {tab.label}
              </TabsTrigger>
            </Link>
          ))}
          
          {/* Animated Indicator */}
          <div
            className="absolute bottom-0 h-0.5 bg-primary transition-all duration-300 ease-out"
            style={{
              left: `${indicatorStyle.left}px`,
              width: `${indicatorStyle.width}px`,
            }}
          />
        </TabsList>
      </div>
    </Tabs>
  );
};
