"use client";
import React from "react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

const Sidebar = () => {
  const pathname = usePathname();
  const sections = [
    {
      title: "Account",
      items: [
        { label: "Public profile", href: "/settings/profile" },
        { label: "Account", href: "/settings/account" },
      ],
    },
  ];

  return (
    <Card className="w-full md:w-64 h-fit md:h-full flex-shrink-0">
      <ScrollArea className="h-full">
        <CardContent className="p-4">
          {sections.map((section, index) => (
            <div key={index} className="mb-6 last:mb-0">
              <ul className="space-y-1">
                {section.items.map((item, itemIndex) => {
                  const isActive = pathname === item.href;
                  return (
                    <li key={itemIndex}>
                      <Button
                        variant="ghost"
                        asChild
                        className={cn(
                          "w-full justify-start px-3",
                          isActive
                            ? "bg-accent text-accent-foreground font-medium"
                            : "text-muted-foreground hover:text-foreground"
                        )}
                      >
                        <a href={item.href}>
                          {item.label}
                        </a>
                      </Button>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </CardContent>
      </ScrollArea>
    </Card>
  );
};

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-col md:flex-row min-h-screen mx-auto max-w-7xl px-4 sm:px-6">
      <div className="flex flex-col md:flex-row flex-1 gap-4 py-4">
        <Sidebar />
        <main className="flex-1">
          <Card className="h-full">
            <CardContent className="p-4 sm:p-6">
              {children}
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
};

export default Layout;