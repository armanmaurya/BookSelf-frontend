"use client";
import { RenderElementProps } from "slate-react";
import { createContext, useState } from "react";
import { EditableTabsContext } from "../context";

export const EditableTabs = (props: RenderElementProps) => {
  const { attributes, children, element } = props;
  const [activeIndex, setActiveIndex] = useState(0);
  return (
    <EditableTabsContext.Provider value={{ activeIndex, setActiveIndex }}>
      <div className="border rounded-md *:">{children}</div>
    </EditableTabsContext.Provider>
  );
};
