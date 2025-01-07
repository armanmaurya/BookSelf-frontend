"use client";
import React from 'react'
import { PanelProps, Panel as ReactPanel } from "react-resizable-panels";


export const Panel = (prop: PanelProps) => {
  return (
    <ReactPanel {...prop}>
      {prop.children}

    </ReactPanel>
  )
}
