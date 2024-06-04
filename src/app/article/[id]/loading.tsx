'use client'
import { Bars } from "react-loader-spinner"
export default function Loading() {
    return (
      <div className="flex items-center justify-center h-full">
        <Bars color="#000" height={80} width={80} />
      </div>
    )
}