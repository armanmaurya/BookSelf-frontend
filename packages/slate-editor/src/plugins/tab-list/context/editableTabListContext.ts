"use client";
import { createContext } from "react";
import { Path } from "slate";

export const EditableTabsListContext = createContext<{
  dragTabPath: React.MutableRefObject<Path | null>;
  draggedOverTabPath: React.MutableRefObject<Path | null>;
}>({
  dragTabPath: { current: null },
  draggedOverTabPath: { current: null },
});
