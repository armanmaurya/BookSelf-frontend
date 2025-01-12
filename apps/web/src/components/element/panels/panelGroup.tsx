"use client";
import React from 'react'
import { PanelGroupProps, PanelGroup } from "react-resizable-panels";


export const ReactPanelGroup = (prop: PanelGroupProps) => {
    return (
        <PanelGroup {...prop}>
            {prop.children}
        </PanelGroup>
    )
}
