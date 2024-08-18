import { RenderElementProps } from "slate-react";
import { TabList } from "../base/TabList";
import { EditableTabsListContext } from "../../context/editableTabListContext";
import { useState } from "react";
import { Path } from "slate";

export const EditableTabList = (props: RenderElementProps) => {
  const [dragStartIndex, setDragStartIndex] = useState(0);
  const [dragEndIndex, setDragEndIndex] = useState(0);

  return (
    <EditableTabsListContext.Provider
      value={{
        dragStartIndex,
        setDragStartIndex,
        dragEndIndex,
        setDragEndIndex,
     
      }}
    >
      <TabList {...props} />
    </EditableTabsListContext.Provider>
  );
};
