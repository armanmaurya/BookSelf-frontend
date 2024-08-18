"use client";
import { createContext } from "react";
import { Path } from "slate";

type PathStoredType = Map<number, Path>;

export const EditableTabsListContext = createContext<{
  dragStartIndex: number;
  dragEndIndex: number;
  setDragStartIndex: (index: number) => void; // Provide the type for setDragStartIndex
  setDragEndIndex: (index: number) => void; // Provide the type for setDragEndIndex
}>({
  dragStartIndex: 0,
  dragEndIndex: 0,
  setDragStartIndex: (index: number) => {},
  setDragEndIndex: (index: number) => {},
});
