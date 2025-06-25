"use client";
import React from "react";
import { usePathname } from "next/navigation";

const Sidebar = () => {
  const pathname = usePathname();
  const sections = [
    {
      title: "Account",
      items: [
        { label: "Public profile", href: "/settings/profile" },
        { label: "Account", href: "/settings/account" },
        // { label: "Accessibility", href: "/settings/accessibility" },
        // { label: "Notifications", href: "/settings/notifications" },
      ],
    },
    // {
    //   title: "Access",
    //   items: [
    //     { label: "Billing and licensing", href: "/settings/billing" },
    //     { label: "Emails", href: "/settings/emails" },
    //     { label: "Password and authentication", href: "/settings/password" },
    //     { label: "Sessions", href: "/settings/sessions" },
    //     { label: "SSH and GPG keys", href: "/settings/ssh-gpg" },
    //     { label: "Organizations", href: "/settings/organizations" },
    //     { label: "Enterprises", href: "/settings/enterprises" },
    //     { label: "Moderation", href: "/settings/moderation" },
    //   ],
    // },
    // {
    //   title: "Code, planning, and automation",
    //   items: [
    //     { label: "Repositories", href: "/settings/repositories" },
    //   ],
    // },
  ];

  return (
    <aside className="w-full md:w-64 h-auto md:h-full flex-shrink-0 bg-neutral-800 rounded-lg p-4 overflow-y-auto mb-4 md:mb-0">
      {sections.map((section, index) => (
        <div key={index} className="mb-6 last:mb-0">
          {/* <h3 className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-3">
            {section.title}
          </h3> */}
          {/* Horizontal Line */}
          {/* <div className="border-t border-neutral-600 my-3"></div> */}
          <ul className="space-y-1.5">
            {section.items.map((item, itemIndex) => {
              const isActive = pathname === item.href;
              return (
                <li key={itemIndex}>
                  <a
                    href={item.href}
                    className={`block px-3 py-2 text-sm rounded-md transition-colors text-neutral-300 hover:bg-neutral-700 hover:text-white${
                      isActive ? " bg-neutral-700 text-white font-semibold" : ""
                    }`}
                  >
                    {item.label}
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </aside>
  );
};

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-col md:flex-row h-full min-h-0 mx-auto max-w-7xl px-2 sm:px-4 md:px-6">
      <div className="flex flex-col md:flex-row flex-grow min-h-0 h-full md:space-x-4 p-2 sm:p-4">
        <Sidebar />
        <main className="flex-grow min-h-0 flex flex-col">
          <div className="bg-neutral-800 rounded-lg p-4 sm:p-8 overflow-y-auto h-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
