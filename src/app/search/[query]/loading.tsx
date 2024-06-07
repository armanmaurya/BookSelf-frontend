"use client";
// import { MagnifyingGlass } from "react-loader-spinner";
import { newtonsCradle } from "ldrs";

newtonsCradle.register();

// Default values shown

export default function Loading() {
  return (
    <div className="flex items-center justify-center absolute bg-zinc-300 bg-opacity-20 h-full w-full">
      <l-newtons-cradle size="`150" speed="1.4" color="black"></l-newtons-cradle>
    </div>
  );
}
