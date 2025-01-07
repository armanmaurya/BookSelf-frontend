"use client";
import React from 'react'
import { PanelGroupProps, PanelGroup as ReactPanelGroup } from "react-resizable-panels";


export const PanelGroup = (prop: PanelGroupProps) => {
    return (
        <ReactPanelGroup {...prop}>
            {prop.children}
        </ReactPanelGroup>
    )
}
