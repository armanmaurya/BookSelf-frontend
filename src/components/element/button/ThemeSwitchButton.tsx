"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
// import { DarkModeToggle } from "react-dark-mode-toggle-2";

const ThemeSwitcher = () => {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();
  const [isDarkMode, setIsDarkMode] = useState(false);

  const prefersDarkMode = () =>
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches;

  useEffect(() => {
    setMounted(true);
    if (theme === "dark") {
      setIsDarkMode(true);
    } else if (theme === "light") {
      setIsDarkMode(false);
    } else if (theme === "system") {
      setIsDarkMode(prefersDarkMode());
    }
    console.log(theme);
  });

  //   if (!mounted) {
  //     return null;
  //   }

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    setTheme(isDarkMode ? "light" : "dark");
  };

  return (
    <div className="flex items-center px-2">
      <div
        className="w-12 h-6 bg-slate-500 rounded-full flex items-center p-1 hover:cursor-pointer relative"
        onClick={toggleTheme}
      >
        <div
          className={`h-5 w-5 rounded-full absolute transition ${
            isDarkMode
              ? "translate-x-5 bg-neutral-700"
              : "translate-x-0 bg-white"
          }`}
        ></div>
        <svg
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="stroke-white fill-white w-5 h-5"
        >
          <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
          <g
            id="SVGRepo_tracerCarrier"
            strokeLinecap="round"
            strokeLinejoin="round"
          ></g>
          <g id="SVGRepo_iconCarrier">
            {" "}
            <path
              d="M3.32031 11.6835C3.32031 16.6541 7.34975 20.6835 12.3203 20.6835C16.1075 20.6835 19.3483 18.3443 20.6768 15.032C19.6402 15.4486 18.5059 15.6834 17.3203 15.6834C12.3497 15.6834 8.32031 11.654 8.32031 6.68342C8.32031 5.50338 8.55165 4.36259 8.96453 3.32996C5.65605 4.66028 3.32031 7.89912 3.32031 11.6835Z"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            ></path>{" "}
          </g>
        </svg>
        <svg
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="stroke-white fill-white h-5 w-5"
        >
          <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
          <g
            id="SVGRepo_tracerCarrier"
            strokeLinecap="round"
            strokeLinejoin="round"
          ></g>
          <g id="SVGRepo_iconCarrier">
            {" "}
            <circle cx="12" cy="12" r="5" strokeWidth="1.5"></circle>{" "}
            <path d="M12 2V4" strokeWidth="1.5" strokeLinecap="round"></path>{" "}
            <path d="M12 20V22" strokeWidth="1.5" strokeLinecap="round"></path>{" "}
            <path d="M4 12L2 12" strokeWidth="1.5" strokeLinecap="round"></path>{" "}
            <path
              d="M22 12L20 12"
              strokeWidth="1.5"
              strokeLinecap="round"
            ></path>{" "}
            <path
              d="M19.7778 4.22266L17.5558 6.25424"
              strokeWidth="1.5"
              strokeLinecap="round"
            ></path>{" "}
            <path
              d="M4.22217 4.22266L6.44418 6.25424"
              strokeWidth="1.5"
              strokeLinecap="round"
            ></path>{" "}
            <path
              d="M6.44434 17.5557L4.22211 19.7779"
              strokeWidth="1.5"
              strokeLinecap="round"
            ></path>{" "}
            <path
              d="M19.7778 19.7773L17.5558 17.5551"
              strokeWidth="1.5"
              strokeLinecap="round"
            ></path>{" "}
          </g>
        </svg>
      </div>
      {/* <DarkModeToggle onChange={toggleTheme} isDarkMode={isDarkMode} size={50} speed={2.5}/> */}
    </div>
  );
};

export default ThemeSwitcher;
