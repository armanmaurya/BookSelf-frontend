import { createContext, useState } from "react";

export const EditableTabsContext = createContext({
  activeIndex: 0,
  setActiveIndex: (index: number) => {},
});
