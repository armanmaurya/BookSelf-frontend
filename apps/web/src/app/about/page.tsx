"use client";
import { Bars } from "react-loader-spinner";
import { MyButton } from "@repo/ui";

export default function Loading() {
  return (
    <div className="flex items-center justify-center bg-slate-600 h-full">
      <Bars color="#000" height={80} width={80} />
      <MyButton/>
    </div>
  );
}
