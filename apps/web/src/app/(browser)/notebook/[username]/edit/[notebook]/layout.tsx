"use client";
import React from "react";
import { PanelsLayout } from "./PanelsLayout";
import { ResizableLayout } from "./ResizableLayout";
// import { usePathname } from "next/navigation";


const layout = ({ children }: {
    children: React.ReactNode
}) => {
    return (
        <PanelsLayout>
            {children}
        </PanelsLayout>
    );
};

export default layout;

