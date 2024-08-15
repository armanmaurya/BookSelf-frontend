"use client";
import { RenderElementProps } from "slate-react";
import { createContext, useState } from "react";
import { EditableTabsContext } from "../context";
import { Tabs } from "../base/Tabs";

export const RenderTabs = (props: RenderElementProps) => {
  return <Tabs {...props} />;
};
