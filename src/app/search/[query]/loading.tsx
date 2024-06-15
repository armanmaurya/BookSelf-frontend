"use client";
import { ThreeCircles } from "react-loader-spinner";
export default function Loading() {
  return (
    <div className="flex items-center justify-center absolute bg-zinc-300 bg-opacity-20 h-full w-full">
      <ThreeCircles color="#000" height={50} width={50} />
    </div>
  );
}
