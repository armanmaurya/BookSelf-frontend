"use client";
import React from 'react'
import { PanelProps, Panel } from "react-resizable-panels";


export const ReactPanel = (prop: PanelProps) => {
  return (
    <Panel {...prop}>
      {prop.children}

    </Panel>
  )
}
